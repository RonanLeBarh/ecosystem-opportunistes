// src/creatures/behavior.js

import { CONFIG } from "../simulation/config.js";

export class Behavior {
    static decide(creature, world) {
        const cell = world.getCell(creature.x, creature.y);

        // 1. Si ressource sur place → manger
        if (cell.resource) {
            world.simulation.logger.debug("decision", {
                creatureId: creature.id,
                action: "eat",
                reason: "resource_on_cell",
                config: CONFIG
            });

            return "eat";
        }

        // 2. Chercher une ressource proche
        const target = this.findNearbyResource(creature, world);
        if (target) {
            world.simulation.logger.debug("decision", {
                creatureId: creature.id,
                action: "move_towards",
                target,
                reason: "resource_in_vision",
                config: CONFIG
            });
            return { type: "move_towards", target };
        }

        // 3. Sinon → déplacement aléatoire
        world.simulation.logger.debug("decision", {
            creatureId: creature.id,
            action: "move_random",
            reason: "no_resource_found",
            config: CONFIG
        });
        return { type: "move_random" };

    }

    // Cherche une ressource dans un rayon de vision
    static findNearbyResource(creature, world) {
        const vision = CONFIG.VISION_RANGE;
        let best = null;
        let bestDist = Infinity;
        for (let dy = -vision; dy <= vision; dy++) {
            for (let dx = -vision; dx <= vision; dx++) {
                const nx = creature.x + dx;
                const ny = creature.y + dy;

                if (!world.isInside(nx, ny)) continue;

                const cell = world.getCell(nx, ny);
                if (!cell.resource) continue;

                // distance manhattan
                const dist = Math.abs(dx) + Math.abs(dy);

                if (dist < bestDist) {
                    bestDist = dist;
                    best = { x: nx, y: ny };
                }
            }
        }

        return best;
    }
}
