// src/engine/world.js

import { Cell } from "./cell.js";
import { CONFIG } from "../simulation/config.js";

export class World {
    constructor(width = CONFIG.WORLD_WIDTH, height = CONFIG.WORLD_HEIGHT) {
        this.width = width;
        this.height = height;

        // Création de la grille 2D
        this.grid = [];
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                row.push(new Cell());
            }
            this.grid.push(row);
        }
    }

    // Vérifie si une position est dans la grille
    isInside(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    // Récupère une case
    getCell(x, y) {
        if (!this.isInside(x, y)) return null;
        return this.grid[y][x];
    }

    // Place une créature dans une case
    setCreature(x, y, creature) {
        const cell = this.getCell(x, y);
        if (cell && !cell.obstacle) {
            cell.creature = creature;
        }
    }

    // Déplace une créature d'une case à une autre
    moveCreature(fromX, fromY, toX, toY) {
        if (!this.isInside(toX, toY)) return false;

        const fromCell = this.getCell(fromX, fromY);
        const toCell = this.getCell(toX, toY);

        if (!fromCell || !toCell) return false;
        if (toCell.obstacle || toCell.creature) return false;

        toCell.creature = fromCell.creature;
        fromCell.creature = null;

        return true;
    }

    // Ajoute une ressource
    addResource(x, y) {
        const cell = this.getCell(x, y);
        if (cell && !cell.obstacle) {
            cell.resource = true;
        }
    }

    // Retire une ressource
    removeResource(x, y) {
        const cell = this.getCell(x, y);
        if (cell) {
            cell.resource = false;
        }
    }

    // Vérifie si une case est un obstacle
    isObstacle(x, y) {
        const cell = this.getCell(x, y);
        return cell ? cell.obstacle : true;
    }
}
