// src/simulation/loop.js

import { World } from "../engine/world.js";
import { ResourcesManager } from "../engine/resources.js";
import { ObstaclesManager } from "../engine/obstacles.js";
import { Creature } from "../creatures/creature.js";
import { CONFIG } from "./config.js";

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
    }

    // Un cycle complet de simulation
    step() {
        this.cycle++;

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
}
