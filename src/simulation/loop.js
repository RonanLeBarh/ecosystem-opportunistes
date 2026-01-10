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

    // Boucle continue (sera liée au renderer)
    start() {
        this.running = true;

        const loop = () => {
            if (!this.running) return;

            for (let i = 0; i < CONFIG.SIMULATION_SPEED; i++) {
                this.step();
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
    }

}
