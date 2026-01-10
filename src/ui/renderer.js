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

        canvas.style.width = canvas.width + "px";
        canvas.style.height = canvas.height + "px";

    }

    draw() {
        const world = this.simulation.world;
        const ctx = this.ctx;

        // Efface tout le canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Parcours toutes les cases du monde
        for (let y = 0; y < world.height; y++) {
            for (let x = 0; x < world.width; x++) {
                const cell = world.getCell(x, y);
                const px = x * this.cellSize;
                const py = y * this.cellSize;

                // Fond noir
                ctx.fillStyle = "#111";
                ctx.fillRect(px, py, this.cellSize, this.cellSize);

                if (cell.obstacle) {
                    ctx.fillStyle = "#444";
                    ctx.fillRect(px, py, this.cellSize, this.cellSize);
                    continue;
                }

                if (cell.resource) {
                    ctx.fillStyle = "#00cc00";
                    ctx.fillRect(px, py, this.cellSize, this.cellSize);
                    continue;
                }

                if (cell.creature && !cell.creature.dead) {
                    const t = cell.creature.traits;
                    ctx.fillStyle = `rgb(${t.color_r}, ${t.color_g}, ${t.color_b})`;
                    ctx.fillRect(px, py, this.cellSize, this.cellSize);
                    continue;
                }
            }
        }

    }
}
