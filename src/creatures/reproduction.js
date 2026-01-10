// src/creatures/reproduction.js

import { Traits } from "./traits.js";
import { CONFIG } from "../simulation/config.js";
import { Creature } from "./creature.js";

export class Reproduction {
    static canReproduce(creature) {
        return creature.energy >= CONFIG.REPRODUCTION_ENERGY_THRESHOLD;
    }

    static createOffspring(parent, world) {
        // Trouver une case libre autour du parent
        const dirs = [
            [1, 0], [-1, 0],
            [0, 1], [0, -1]
        ];

        for (let [dx, dy] of dirs) {
            const nx = parent.x + dx;
            const ny = parent.y + dy;

            if (!world.isInside(nx, ny)) continue;

            const cell = world.getCell(nx, ny);
            if (!cell.obstacle && !cell.creature) {
                // Traits hérités + mutation
                const childTraits = Traits.inherit(parent.traits);

                const child = new Creature(nx, ny, childTraits);
                cell.creature = child;
                world.simulation.creatures.push(child);
                world.simulation.logger.log("reproduction", {
                    parentId: parent.id,
                    childId: child.id,
                    x: nx,
                    y: ny,
                    cycle: world.simulation.cycle
                });
                world.simulation.logger.log("birth_reproduction", {
                    parentId: parent.id,
                    childId: child.id,
                    parentX: parent.x,
                    parentY: parent.y,
                    childX: nx,
                    childY: ny,
                    cycle: world.simulation.cycle
                });
                // Le parent perd de l'énergie
                parent.energy -= CONFIG.REPRODUCTION_ENERGY_COST;
                // Génétique du child avec mutation
                const p = parent;
                const L = CONFIG.GENE_LIMITS;
                child.genes = {
                    speed: Reproduction.mutateGene(p.genes.speed, p.genes.mutationRate, L.SPEED_MIN, L.SPEED_MAX),
                    vision: Reproduction.mutateGene(p.genes.vision, p.genes.mutationRate, L.VISION_MIN, L.VISION_MAX),
                    metabolism: Reproduction.mutateGene(p.genes.metabolism, p.genes.mutationRate, L.METABOLISM_MIN, L.METABOLISM_MAX),
                    fertility: Reproduction.mutateGene(p.genes.fertility, p.genes.mutationRate, L.FERTILITY_MIN, L.FERTILITY_MAX),
                    mutationRate: Reproduction.mutateGene(p.genes.mutationRate, p.genes.mutationRate, L.MUTATION_RATE_MIN, L.MUTATION_RATE_MAX),
                    carnivore: Reproduction.mutateGene(p.genes.carnivore, p.genes.mutationRate, L.CARNIVORE_MIN, L.CARNIVORE_MAX),

                };
                return child;
            }
        }

        return null; // pas de place
    }
    static mutateGene(value, rate, min = 0.1, max = 10) {
        if (Math.random() < rate) {
            value += (Math.random() - 0.5) * 0.2;
        }
        return Math.max(min, Math.min(max, value));
    }
}
