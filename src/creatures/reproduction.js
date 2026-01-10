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

                return child;
            }
        }

        return null; // pas de place
    }
}
