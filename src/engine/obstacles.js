// src/engine/obstacles.js

import { CONFIG } from "../simulation/config.js";

export class ObstaclesManager {
    constructor() {
        this.density = CONFIG.OBSTACLE_DENSITY; // proportion de cases bloquées
    }

    // Génère des obstacles aléatoires
    generateRandom(world) {
        for (let y = 0; y < world.height; y++) {
            for (let x = 0; x < world.width; x++) {
                if (Math.random() < this.density) {
                    const cell = world.getCell(x, y);
                    if (!cell.creature) {
                        cell.obstacle = true;
                        cell.resource = false; // pas de ressource sur un obstacle
                    }
                }
            }
        }
    }

    // Génère un mur vertical
    generateVerticalWall(world, x) {
        for (let y = 0; y < world.height; y++) {
            const cell = world.getCell(x, y);
            cell.obstacle = true;
            cell.resource = false;
        }
    }

    // Génère un mur horizontal
    generateHorizontalWall(world, y) {
        for (let x = 0; x < world.width; x++) {
            const cell = world.getCell(x, y);
            cell.obstacle = true;
            cell.resource = false;
        }
    }

    // Génère un motif personnalisé (plus tard si besoin)
    generatePattern(world, patternFn) {
        for (let y = 0; y < world.height; y++) {
            for (let x = 0; x < world.width; x++) {
                if (patternFn(x, y)) {
                    const cell = world.getCell(x, y);
                    cell.obstacle = true;
                    cell.resource = false;
                }
            }
        }
    }
}
