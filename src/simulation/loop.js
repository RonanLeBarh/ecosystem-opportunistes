// src/simulation/loop.js

import { World } from "../engine/world.js";
import { ResourcesManager } from "../engine/resources.js";
import { ObstaclesManager } from "../engine/obstacles.js";
import { Creature } from "../creatures/creature.js";
import { CONFIG } from "./config.js";
import { Logger } from "../logging/logger.js";

export class Simulation {
    constructor() {
        // --- Monde ---
        this.world = new World(CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);

        // --- Gestionnaires ---
        this.resources = new ResourcesManager();
        this.obstacles = new ObstaclesManager();

        // --- Créatures ---
        this.creatures = [];

        // --- Cycle ---
        this.cycle = 0;
        this.running = false;

        // --- Logger ---
        this.logger = new Logger();
        this.logger.simulation = this;

        // Lien retour pour le logging depuis le monde
        this.world.simulation = this;

        // Statistiques de la simulation
        this.stats = {
            averageAge: 0,
            deathEnergy: 0,
            deathAge: 0,
            deathEnergyPercent: 0,
            deathAgePercent: 0,
            birthInitial: 0,
            birthReproduction: 0,
            totalResources: 0
        };

    }

    // Initialisation complète
    init() {
        // Obstacles
        this.obstacles.generateRandom(this.world);

        // Ressources
        this.resources.spawnInitial(this.world);

        // Créatures initiales
        for (let i = 0; i < CONFIG.INITIAL_CREATURE_COUNT; i++) {
            this.spawnRandomCreature();
        }
    }

    // Ajoute une créature à une position libre
    spawnRandomCreature() {
        let x, y, cell;

        do {
            x = Math.floor(Math.random() * this.world.width);
            y = Math.floor(Math.random() * this.world.height);
            cell = this.world.getCell(x, y);
        } while (cell.obstacle || cell.creature);

        const creature = new Creature(x, y);
        this.creatures.push(creature);
            cell.creature = creature;
            this.logger.log("birth_initial", {
                creatureId: creature.id,
                x,
                y,
                cycle: this.cycle
            });

    }

    // Un cycle complet de simulation
    step() {
        this.cycle++;
        this.logger.log("cycle", { cycle: this.cycle });
        // Régénération des ressources
        this.resources.regenerate(this.world);

        // Mise à jour des créatures
        for (let creature of this.creatures) {
            if (!creature.dead) {
                creature.update(this.world);
            }
        }

        // Nettoyage des créatures mortes
        this.creatures = this.creatures.filter(c => !c.dead);
        for (let y = 0; y < this.world.height; y++) {
            for (let x = 0; x < this.world.width; x++) {
                const cell = this.world.getCell(x, y);
                if (cell.creature && cell.creature.dead) {
                    cell.creature = null;
                }
            }
        }

        // Logging de la population
        if (this.creatures.length > 0) {
            this.logger.log("population", {
                count: this.creatures.length,
                cycle: this.cycle
            });
        }
        this.updateStats();
        window.hud.update();
    }

    // Boucle continue
    start() {
        this.running = true;

        const loop = () => {
            if (!this.running) return;

            let cycles = CONFIG.SIMULATION_SPEED;

            // 🔥 Ralentir uniquement les petites vitesses
            if (cycles === 1) cycles = 1 / CONFIG.SLOW_FACTOR;

            // cycles peut être fractionnaire → accumulateur
            this._accumulator = (this._accumulator || 0) + cycles;

            while (this._accumulator >= 1) {
                this.step();
                this._accumulator -= 1;
            }

            requestAnimationFrame(loop);
        };

        loop();
    }



    stop() {
        this.running = false;
    }
    updateStats() {
        const creatures = this.creatures;
        const totalAge = creatures.reduce((sum, c) => sum + c.age, 0);
        this.stats.averageAge = creatures.length ? totalAge / creatures.length : 0;

        const totalDeaths = this.stats.deathEnergy + this.stats.deathAge;
        this.stats.deathEnergyPercent = totalDeaths ? (this.stats.deathEnergy / totalDeaths) * 100 : 0;
        this.stats.deathAgePercent = totalDeaths ? (this.stats.deathAge / totalDeaths) * 100 : 0;

        // 🔥 Correction : compter les ressources dans le monde
        let totalResources = 0;
        for (let y = 0; y < this.world.height; y++) {
            for (let x = 0; x < this.world.width; x++) {
                const cell = this.world.getCell(x, y);
                if (cell.resource) totalResources++;
            }
        }
        this.stats.totalResources = totalResources;

        // --- Carnivorisme moyen ---
        let totalCarnivore = 0;
        for (let c of this.creatures) {
            totalCarnivore += c.genes.carnivore;
        }
        this.stats.avgCarnivore = this.creatures.length
            ? totalCarnivore / this.creatures.length
            : 0;
        let herb = 0, omni = 0, carn = 0;

        for (let c of this.creatures) {
            if (c.genes.carnivore < 0.33) herb++;
            else if (c.genes.carnivore < 0.66) omni++;
            else carn++;
        }

        this.stats.herbivores = herb;
        this.stats.omnivores = omni;
        this.stats.carnivores = carn;
        // --- Moyennes génétiques ---
        let totalSpeed = 0;
        let totalVision = 0;
        let totalMetabolism = 0;
        let totalFertility = 0;
        let totalMutation = 0;

        let totalMaxAge = 0;

        // Pour la couleur moyenne
        let totalR = 0, totalG = 0, totalB = 0;

        for (let c of creatures) {
            totalSpeed += c.genes.speed;
            totalVision += c.genes.vision;
            totalMetabolism += c.genes.metabolism;
            totalFertility += c.genes.fertility;
            totalMutation += c.genes.mutationRate;

            totalMaxAge += c.traits.max_age;

            totalR += c.traits.color_r;
            totalG += c.traits.color_g;
            totalB += c.traits.color_b;
        }

        // --- Top 3 couleurs avec tolérance ---
        const tolerance = CONFIG.COLOR_FAMILY_TOLERANCE;
        const families = [];

        function distance(c1, c2) {
            return Math.sqrt(
                (c1.r - c2.r) ** 2 +
                (c1.g - c2.g) ** 2 +
                (c1.b - c2.b) ** 2
            );
        }

        for (let c of creatures) {
            const col = {
                r: Math.round(c.traits.color_r),
                g: Math.round(c.traits.color_g),
                b: Math.round(c.traits.color_b)
            };

            // Chercher une famille existante proche
            let found = false;
            for (let fam of families) {
                if (distance(col, fam.color) < tolerance) {
                    fam.count++;
                    found = true;
                    break;
                }
            }

            // Sinon créer une nouvelle famille
            if (!found) {
                families.push({
                    color: col,
                    count: 1
                });
            }
        }

        // Trier et prendre le top 3
        this.stats.topColors = families
            .sort((a, b) => b.count - a.count)
            .slice(0, 3)
            .map(f => ({
                rgb: `rgb(${f.color.r}, ${f.color.g}, ${f.color.b})`,
                percent: ((f.count / creatures.length) * 100).toFixed(1)
            }));


        const n = creatures.length || 1;

        this.stats.avgSpeed = totalSpeed / n;
        this.stats.avgVision = totalVision / n;
        this.stats.avgMetabolism = totalMetabolism / n;
        this.stats.avgFertility = totalFertility / n;
        this.stats.avgMutation = totalMutation / n;

        this.stats.avgMaxAge = totalMaxAge / n;

        this.stats.avgColor = {
            r: totalR / n,
            g: totalG / n,
            b: totalB / n
        };
        const geneMap = {
            "Vitesse": this.stats.avgSpeed,
            "Vision": this.stats.avgVision,
            "Métabolisme": this.stats.avgMetabolism,
            "Fertilité": this.stats.avgFertility,
            "Carnivore": this.stats.avgCarnivore,
            "Mutation": this.stats.avgMutation
        };

        this.stats.topGenes = Object.entries(geneMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([name, value]) => ({
                name,
                value: (value * 100).toFixed(1) + "%"
            }));


    }

}
