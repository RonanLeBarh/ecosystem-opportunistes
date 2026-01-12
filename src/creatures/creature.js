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
            mutationRate: 0.02,   // chance de mutation par gène
            carnivore: 0.0       // 0 = herbivore, 1 = carnivore, entre les deux = omnivore
        };
    }

    // Mise à jour d'une créature à chaque cycle
    update(world) {

        // Perte d'énergie
        this.energy -= this.genes.metabolism;// coût de maintenance

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
        }
    }

    // Déplacement vers une cible
    moveTowards(target, world) {
        const dx = Math.sign(target.x - this.x);
        const dy = Math.sign(target.y - this.y);

        const newX = this.x + dx;
        const newY = this.y + dy;

        if (!world.isInside(newX, newY)) return;

        const cell = world.getCell(newX, newY);

        if (cell.creature && cell.creature !== this) {
            if (this.genes.carnivore > 0.5) {
                const prey = cell.creature;

                world.simulation.logger.log("predation", {
                    predator: this.id,
                    prey: cell.creature.id,
                    predatorCarnivore: this.genes.carnivore,
                    preyCarnivore: cell.creature.genes.carnivore,
                    cycle: world.simulation.cycle
                });
                // gagner son énergie
                this.energy += cell.creature.energy;

                // Tuer proprement
                prey.die(world);

                // remplacer la créature dans la cellule
                world.moveCreature(this.x, this.y, newX, newY);
                this.x = newX;
                this.y = newY;

                return;
            }
        }

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

        world.moveCreature(this.x, this.y, newX, newY);
        this.x = newX;
        this.y = newY;
        world.simulation.logger.log("move_towards", {
            creatureId: this.id,
            from: { x: this.x, y: this.y },
            to: { x: newX, y: newY },
            target,
            config: CONFIG
        });

    }

    // Manger une ressource
    eat(world) {
        const cell = world.getCell(this.x, this.y);
        if (cell.resource) {
            cell.resource = false;
            this.energy += CONFIG.RESOURCE_ENERGY_VALUE;
        }
        world.simulation.logger.log("eat", {
            creatureId: this.id,
            x: this.x,
            y: this.y,
            energy: this.energy
        });

    }

    // Déplacement aléatoire simple
    moveRandom(world) {
        const dirs = [
            [1, 0], [-1, 0],
            [0, 1], [0, -1]
        ];

        const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];

        const newX = this.x + dx;
        const newY = this.y + dy;

        if (!world.isInside(newX, newY)) return;

        const target = world.getCell(newX, newY);

        if (target.obstacle || target.creature) {
            world.simulation.logger.log("move_blocked", {
                creatureId: this.id,
                from: { x: this.x, y: this.y },
                attempted: { x: newX, y: newY },
                reason: target.obstacle ? "obstacle" : "creature",
                config: CONFIG
            });
            return;
        }

        // Déplacement
        world.moveCreature(this.x, this.y, newX, newY);
        this.x = newX;
        this.y = newY;
        world.simulation.logger.log("move_random", {
            creatureId: this.id,
            from: { x: this.x, y: this.y },
            to: { x: newX, y: newY },
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
