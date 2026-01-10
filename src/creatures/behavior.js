// src/creatures/behavior.js

import { CONFIG } from "../simulation/config.js";

export class Behavior {
    static decide(creature, world) {
        const cell = world.getCell(creature.x, creature.y);

        // Si carnivore → chercher une proie
        if (creature.genes.carnivore > 0.5) {
            const prey = this.findNearbyPrey(creature, world);
            if (prey) {
                return { type: "move_towards", target: prey };
            }
        }

        // 1. Si ressource sur place → manger
        if (cell.resource) {
            world.simulation.logger.log("decision", {
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
            world.simulation.logger.log("vision", {
                creatureId: creature.id,
                target
            });
            world.simulation.logger.log("decision", {
                creatureId: creature.id,
                action: "move_towards",
                target,
                reason: "resource_in_vision",
                config: CONFIG
            });
            return { type: "move_towards", target };
        }

        // 3. Sinon → déplacement aléatoire
        world.simulation.logger.log("decision", {
            creatureId: creature.id,
            action: "move_random",
            reason: "no_resource_found",
            config: CONFIG
        });
        return { type: "move_random" };

    }

    // Cherche une ressource dans un rayon de vision
    static findNearbyResource(creature, world) {
        const vision = Math.floor(creature.genes.vision);
        let best = null;
        let bestDist = Infinity;

        for (let dy = -vision; dy <= vision; dy++) {
            for (let dx = -vision; dx <= vision; dx++) {

                const nx = creature.x + dx;
                const ny = creature.y + dy;

                if (!world.isInside(nx, ny)) continue;
                if (dx === 0 && dy === 0) continue;

                const cell = world.getCell(nx, ny);
                if (!cell.resource) continue;

                // Distance manhattan
                const dist = Math.abs(dx) + Math.abs(dy);

                // Ajout d'un léger bruit pour casser les égalités
                const noise = Math.random() * 0.0001;

                const score = dist + noise;

                if (score < bestDist) {
                    bestDist = score;
                    best = { x: nx, y: ny };
                }
            }
        }

        return best;
    }
    
    // Cherche une proie dans un rayon de vision
    static findNearbyPrey(creature, world) {
        const vision = Math.floor(creature.genes.vision);

        for (let dy = -vision; dy <= vision; dy++) {
            for (let dx = -vision; dx <= vision; dx++) {

                const nx = creature.x + dx;
                const ny = creature.y + dy;

                if (!world.isInside(nx, ny)) continue;
                if (dx === 0 && dy === 0) continue;

                const cell = world.getCell(nx, ny);
                if (!cell.creature) continue;

                const target = cell.creature;

                // éviter le cannibalisme si tu veux
                if (target === creature) continue;

                return { x: nx, y: ny };
            }
        }

        return null;
    }


}
