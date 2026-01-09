// src/creatures/behavior.js

import { CONFIG } from "../simulation/config.js";

export class Behavior {
    static decide(creature, world) {
        const cell = world.getCell(creature.x, creature.y);

        // 1. Si ressource sur place → manger
        if (cell.resource) {
            return "eat";
        }

        // 2. Chercher une ressource proche
        const target = this.findNearbyResource(creature, world);
        if (target) {
            return { type: "move_towards", target };
        }

        // 3. Sinon → déplacement aléatoire
        return { type: "move_random" };
    }

    // Cherche une ressource dans un rayon de vision
    static findNearbyResource(creature, world) {
        const vision = CONFIG.VISION_RANGE;

        for (let dy = -vision; dy <= vision; dy++) {
            for (let dx = -vision; dx <= vision; dx++) {
                const nx = creature.x + dx;
                const ny = creature.y + dy;

                if (!world.isInside(nx, ny)) continue;

                const cell = world.getCell(nx, ny);
                if (cell.resource) {
                    return { x: nx, y: ny };
                }
            }
        }

        return null;
    }
}
