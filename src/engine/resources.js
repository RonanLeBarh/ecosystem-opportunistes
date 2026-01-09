// src/engine/resources.js

import { CONFIG } from "../simulation/config.js";

export class ResourcesManager {
    constructor() {
        this.spawnRate = CONFIG.RESOURCE_SPAWN_RATE;      // densité initiale
        this.regenRate = CONFIG.RESOURCE_REGEN_RATE;      // taux de régénération
        this.energyValue = CONFIG.RESOURCE_ENERGY_VALUE;  // énergie gagnée par ressource
    }

    // Génère les ressources initiales dans le monde
    spawnInitial(world) {
        for (let y = 0; y < world.height; y++) {
            for (let x = 0; x < world.width; x++) {
                if (Math.random() < this.spawnRate) {
                    const cell = world.getCell(x, y);
                    if (!cell.obstacle) {
                        cell.resource = true;
                    }
                }
            }
        }
    }

    // Régénère les ressources à chaque cycle
    regenerate(world) {
        for (let y = 0; y < world.height; y++) {
            for (let x = 0; x < world.width; x++) {
                const cell = world.getCell(x, y);

                // Pas de régénération sur obstacle ou créature
                if (cell.obstacle || cell.creature) continue;

                // Chance de faire repousser une ressource
                if (!cell.resource && Math.random() < this.regenRate) {
                    cell.resource = true;
                }
            }
        }
    }
}
