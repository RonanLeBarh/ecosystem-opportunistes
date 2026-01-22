// src/creatures/creature.js

import { Traits } from "./traits.js";
import { CONFIG } from "../simulation/config.js";
import { Reproduction } from "./reproduction.js";
import { Behavior } from "./behavior.js";

let CREATURE_ID_COUNTER = 0;

export class Creature {
    constructor(x, y, traits = Traits.random()) {
        this.id = CREATURE_ID_COUNTER++;
        this.x = x;
        this.y = y;

        this.traits = traits;

        // États dynamiques
        this.energy = CONFIG.CREATURE_INITIAL_ENERGY;
        this.age = 0;
        this.maxEnergy = CONFIG.CREATURE_MAX_ENERGY;


        // Mémoire simple (sera étendue plus tard)
        this.memory = {
            lastRichSpot: null,
            lastDanger: null,
            lastObservedSuccess: null
        };
        this.genes = {
            speed: 1.0,          // vitesse de déplacement
            vision: 3,           // rayon de vision
            metabolism: 1.0,     // énergie consommée par cycle
            fertility: 0.5,      // probabilité de reproduction
            mutationRate: 0.3,   // chance de mutation par gène (augmenté pour plus de diversité)
            carnivore: traits.hunting_preference  // synchronisé avec la préférence de chasse
        };
    }

    // Mise à jour d'une créature à chaque cycle
    update(world) {

        // Perte d'énergie
        let energyCost = this.genes.metabolism;
        
        // Pénalité pour carnivores
        if (this.genes.carnivore > 0.5) {
            energyCost += CONFIG.CARNIVORE_ENERGY_PENALTY * this.genes.carnivore;
        }
        
        this.energy -= energyCost;// coût de maintenance

        // Si énergie <= 0 → clamp à 0 et mort instantanée
        if (this.energy <= 0) {
            this.energy = 0;
            world.simulation.logger.log("death_energy", {
                creatureId: this.id,
                age: this.age,
                energy: this.energy
            });
            this.die(world);
            return;
        }

        // Vieillissement
        this.age++;
        if (this.age >= this.traits.max_age) {
            world.simulation.logger.log("death_age", {
                creatureId: this.id,
                age: this.age,
                energy: this.energy
            });
            this.die(world);
            return;
        }

        // Déplacement selon la vitesse génétique
        const steps = Math.floor(this.genes.speed);
        for (let i = 0; i < steps; i++) {
            const action = this.decide(world);
            this.executeAction(action, world);
        }

        // Reproduction
        if (Reproduction.canReproduce(this)) {
            Reproduction.createOffspring(this, world);
        }
    }

    // Décision de l'action à effectuer
    decide(world) {
        return Behavior.decide(this, world);
    }

    // Exécution de l'action
    executeAction(action, world) {
        // Cas simple : action = "eat" ou "move_random"
        if (typeof action === "string") {
            switch (action) {
                case "eat":
                    this.eat(world);
                    return;
                case "move_random":
                    this.moveRandom(world);
                    return;
            }
        }

        // Cas avancé : action = { type: "...", ... }
        switch (action.type) {
            case "move_towards":
                this.moveTowards(action.target, world);
                break;

            case "move_random":
                this.moveRandom(world);
                break;
            case "flee":
                this.flee(world, action.threat);
                break;
            case "explore":
                this.explore(world);
                break;
        }
    }

// --- Déplacement vers une cible ---
moveTowards(target, world) {
    // Vérification de la cible
    if (!target || target.x === undefined || target.y === undefined) {
        world.simulation.logger.log("move_towards", {
            creatureId: this.id,
            from: { x: this.x, y: this.y },
            reason: "INVALID_TARGET",
            target
        });
        return;
    }

    const dx = Math.sign(target.x - this.x);
    const dy = Math.sign(target.y - this.y);

    const newX = this.x + dx;
    const newY = this.y + dy;

    if (!world.isInside(newX, newY)) return;

    const cell = world.getCell(newX, newY);
    
    // Détermine le type de cible pour les logs
    let targetType = "unknown";
    if (cell.resource) targetType = "RESSOURCE";
    if (cell.creature) targetType = "PROIE";

    // --- Collision avec une créature ---
    if (cell.creature && cell.creature !== this) {

        const prey = cell.creature;

        // --- Conditions d’attaque paramétrées ---
        const hungerRatio = this.energy / this.maxEnergy;
        const isHungry = hungerRatio < (1 - CONFIG.HUNGER_THRESHOLD_HUNT);
        const isCarnivore = this.genes.carnivore > 0.4;
        const isAggressive = this.traits.aggressiveness > CONFIG.AGGRESSIVENESS_THRESHOLD_ATTACK;

        // Correction : appel statique
        const localDensity = Behavior.computeLocalDensity(this, world);
        const notCrowded = localDensity < CONFIG.DENSITY_THRESHOLD_NO_ATTACK;

        // Vérification stricte contre le cannibalisme
        const carnivoreDiff = Math.abs(this.genes.carnivore - prey.genes.carnivore);
        const isNotCannibalistic = carnivoreDiff >= 0.3;

        const shouldAttack =
            (isCarnivore && isHungry && notCrowded && isNotCannibalistic) ||
            (isAggressive && isHungry && notCrowded && this.genes.carnivore > 0.2 && isNotCannibalistic);

        // Debug : pourquoi l'attaque n'a pas lieu
        if (!shouldAttack) {
            let blockedReasons = [];
            if (!isHungry) blockedReasons.push("NOT_HUNGRY");
            if (!notCrowded) blockedReasons.push("TOO_CROWDED");
            if (!isNotCannibalistic) blockedReasons.push("CANNIBALISM_BLOCKED");
            if (isCarnivore && isHungry && notCrowded && isNotCannibalistic) blockedReasons.push("CARNIVORE_OK");
            if (isAggressive && isHungry && notCrowded && this.genes.carnivore > 0.2 && isNotCannibalistic) blockedReasons.push("AGGRESSIVE_OK");
            
            world.simulation.logger.log("attack_blocked", {
                cycle: world.simulation.cycle,
                predator: this.id,
                prey: prey.id,
                predatorCarnivore: Math.round(this.genes.carnivore * 100) / 100,
                preyCarnivore: Math.round(prey.genes.carnivore * 100) / 100,
                blockedReasons: blockedReasons.join(", "),
                carnivoreDiff: Math.round(carnivoreDiff * 100) / 100,
                hungerRatio: Math.round(hungerRatio * 100) / 100,
                localDensity: Math.round(localDensity * 100) / 100
            });
        }

        if (shouldAttack) {

            // Détermine la raison de l'attaque
            let attackReason = "";
            if (isCarnivore && isHungry && notCrowded && isNotCannibalistic) {
                attackReason = "CARNIVORE_HUNT";
            } else if (isAggressive && isHungry && notCrowded && this.genes.carnivore > 0.2 && isNotCannibalistic) {
                attackReason = "AGGRESSIVE_HUNT";
            }

            world.simulation.logger.log("predation", {
                cycle: world.simulation.cycle,
                predator: this.id,
                prey: prey.id,
                attackReason,
                predatorCarnivore: Math.round(this.genes.carnivore * 100) / 100,
                preyCarnivore: Math.round(prey.genes.carnivore * 100) / 100,
                carnivoreDiff: Math.round(carnivoreDiff * 100) / 100,
                hungerRatio: Math.round(hungerRatio * 100) / 100,
                localDensity: Math.round(localDensity * 100) / 100
            });

            // Gain d'énergie (réduit pour les carnivores)
            let energyGain = prey.energy;
            if (this.genes.carnivore > 0.5) {
                energyGain *= 0.6; // 40% de pénalité pour carnivores
            }
            this.energy += energyGain;

            // Mort propre
            prey.die(world);

            // Déplacement dans la cellule
            world.moveCreature(this.x, this.y, newX, newY);
            this.x = newX;
            this.y = newY;

            return;
        }
    }

    // --- Blocage ---
    if (cell.obstacle || cell.creature) {
        world.simulation.logger.log("move_blocked", {
            creatureId: this.id,
            from: { x: this.x, y: this.y },
            attempted: { x: newX, y: newY },
            reason: cell.obstacle ? "obstacle" : "creature",
            config: CONFIG
        });
        return;
    }

    // --- Déplacement normal ---
    world.moveCreature(this.x, this.y, newX, newY);
    this.x = newX;
    this.y = newY;

    world.simulation.logger.log("move_towards", {
        creatureId: this.id,
        from: { x: this.x, y: this.y },
        to: { x: newX, y: newY },
        target,
        targetType,
        config: CONFIG
    });
}

    // Manger une ressource
    eat(world) {
        const cell = world.getCell(this.x, this.y);
        if (cell.resource) {
            cell.resource = false;
            let energyGain = CONFIG.RESOURCE_ENERGY_VALUE;
            
            // Bonus pour les herbivores
            if (this.genes.carnivore < 0.3) {
                energyGain *= CONFIG.HERBIVORE_RESOURCE_BONUS;
            }
            
            this.energy += energyGain;
        }
        world.simulation.logger.log("eat", {
            creatureId: this.id,
            x: this.x,
            y: this.y,
            energy: this.energy
        });

    }

    // --- Déplacement aléatoire intelligent ---
    moveRandom(world) {

        const dirs = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 },
            { dx: 1, dy: 1 },
            { dx: -1, dy: -1 },
            { dx: 1, dy: -1 },
            { dx: -1, dy: 1 }
        ];

        let best = null;
        let bestScore = -Infinity;

        for (const d of dirs) {

            const nx = this.x + d.dx;
            const ny = this.y + d.dy;

            if (!world.isInside(nx, ny)) continue;

            const cell = world.getCell(nx, ny);

            // impossible d'aller ici
            if (cell.obstacle || cell.creature) continue;

            // Score de la direction
            let score = 0;

            // 1) Éviter les zones dangereuses
            const threat = world.behavior?.findNearbyThreat
                ? world.behavior.findNearbyThreat(this, world)
                : null;

            if (threat) {
                const distThreat =
                    Math.abs(nx - threat.x) + Math.abs(ny - threat.y);
                score += distThreat * 20; // plus loin = mieux
            }

            // 2) Favoriser les zones peu denses
            const density = Behavior.computeLocalDensityAt(world, nx, ny)

            score += (1 - density) * 30;

            // 3) Favoriser les zones riches (si ressource proche)
            if (cell.resource) score += 40;

            // 4) Curiosité génétique
            score += this.traits.curiosity * 10;

            // 5) Variation naturelle
            score += Math.random() * 10;

            if (score > bestScore) {
                bestScore = score;
                best = { x: nx, y: ny };
            }
        }

        // Si aucune direction valide → rester sur place
        if (!best) return;

        world.moveCreature(this.x, this.y, best.x, best.y);
        this.x = best.x;
        this.y = best.y;

        world.simulation.logger.log("move_random", {
            creatureId: this.id,
            from: { x: this.x, y: this.y },
            to: best,
            reason: "random_intelligent"
        });
    }

    // --- Fuite d'une menace ---
    flee(world, threat) {

        if (!threat) {
            // fallback si aucune menace valide
            this.moveRandom(world);
            return;
        }

        // Direction opposée à la menace
        const dx = Math.sign(this.x - threat.x);
        const dy = Math.sign(this.y - threat.y);

        // Position cible
        const newX = this.x + dx;
        const newY = this.y + dy;

        // Si la direction opposée est hors du monde → fallback
        if (!world.isInside(newX, newY)) {
            this.moveRandom(world);
            return;
        }

        const cell = world.getCell(newX, newY);

        // Si bloqué par obstacle ou créature → fallback
        if (cell.obstacle || cell.creature) {
            this.moveRandom(world);
            return;
        }

        // Déplacement propre via le moteur
        world.moveCreature(this.x, this.y, newX, newY);
        this.x = newX;
        this.y = newY;

        // Log
        world.simulation.logger.log("move_towards", {
            creatureId: this.id,
            from: { x: this.x, y: this.y },
            to: { x: newX, y: newY },
            reason: "flee",
            threat,
            config: CONFIG
        });
    }

    // --- Exploration intelligente ---
    explore(world) {

        // directions possibles
        const dirs = [
            [1, 0], [-1, 0],
            [0, 1], [0, -1],
            [1, 1], [-1, -1],
            [1, -1], [-1, 1]
        ];

        // choisir une direction aléatoire mais pondérée par curiosité
        const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];

        const newX = this.x + dx;
        const newY = this.y + dy;

        if (!world.isInside(newX, newY)) {
            this.moveRandom(world);
            return;
        }

        const cell = world.getCell(newX, newY);

        if (cell.obstacle || cell.creature) {
            this.moveRandom(world);
            return;
        }

        world.moveCreature(this.x, this.y, newX, newY);
        this.x = newX;
        this.y = newY;

        world.simulation.logger.log("move_random", {
            creatureId: this.id,
            from: { x: this.x, y: this.y },
            to: { x: newX, y: newY },
            reason: "explore",
            config: CONFIG
        });
    }

    // Mort de la créature
    die(world) {
        const cell = world.getCell(this.x, this.y);
        if (cell) {
            cell.creature = null;
        }
        this.dead = true;
        world.simulation.logger.log("death", {
            creatureId: this.id,
            x: this.x,
            y: this.y,
            age: this.age,
            energy: this.energy,
            cycle: world.simulation.cycle
        });
    }
}
