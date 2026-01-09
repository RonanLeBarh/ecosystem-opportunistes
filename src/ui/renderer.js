// src/ui/renderer.js

import { CONFIG } from "../simulation/config.js";

export class Renderer {
    constructor(simulation, canvas) {
        this.simulation = simulation;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // Taille d'une case en pixels
        this.cellSize = 5;

        // Ajuste la taille du canvas
        canvas.width = simulation.world.width * this.cellSize;
        canvas.height = simulation.world.height * this.cellSize;
    }

    draw() {
        const world = this.simulation.world;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let y = 0; y < world.height; y++) {
            for (let x = 0; x < world.width; x++) {
                const cell = world.getCell(x, y);

                // Coordonnées pixel
                const px = x * this.cellSize;
                const py = y * this.cellSize;

                // Obstacle
                if (cell.obstacle) {
                    ctx.fillStyle = "#444";
                    ctx.fillRect(px, py, this.cellSize, this.cellSize);
                    continue;
                }

                // Ressource
                if (cell.resource) {
                    ctx.fillStyle = "#00cc00";
                    ctx.fillRect(px, py, this.cellSize, this.cellSize);
                }

                // Créature
                if (cell.creature) {
                    const t = cell.creature.traits;
                    ctx.fillStyle = `rgb(${t.color_r}, ${t.color_g}, ${t.color_b})`;
                    ctx.fillRect(px, py, this.cellSize, this.cellSize);
                }
            }
        }
    }
}
