// src/creatures/behavior.js

import { CONFIG } from "../simulation/config.js";

export class Behavior {

    // --- Point d’entrée principal ---
    static decide(creature, world) {

        // 1) Construire le contexte complet
        const ctx = this.buildContext(creature, world);

        // 2) Calculer les scores
        const scores = this.computeScores(creature, world, ctx);

        // 3) Choisir la meilleure action
        const bestAction = this.chooseBestAction(scores);

        return bestAction;
    }

    // --- Contexte complet ---
    static buildContext(creature, world) {

        const cell = world.getCell(creature.x, creature.y);

        return {
            cell,
            resourceHere: cell.resource,
            nearbyResource: this.findNearbyResource(creature, world),
            nearbyPrey: this.findNearbyPrey(creature, world),
            nearbyThreat: this.findNearbyThreat(creature, world),
            hunger: 1 - (creature.energy / creature.maxEnergy),
            localDensity: this.computeLocalDensity(creature, world)
        };
    }

    // --- Système de score complet ---
    static computeScores(creature, world, ctx) {

        const scores = {
            eat: 0,
            hunt: 0,
            flee: 0,
            move_towards_resource: 0,
            explore: 0,
            move_random: 1
        };

        const hunger = ctx.hunger;

        // --- 1) Manger si ressource sur place ---
        if (ctx.resourceHere) {
            scores.eat = 200;
        }

        // --- 2) Chasse (conditions strictes et paramétrables) ---
        if (ctx.nearbyPrey) {

            const dx = Math.abs(ctx.nearbyPrey.x - creature.x);
            const dy = Math.abs(ctx.nearbyPrey.y - creature.y);
            const distFactor = 1 / (dx + dy + 1);

            const isCarnivore = creature.genes.carnivore > 0.4;
            const isHungry = hunger > CONFIG.HUNGER_THRESHOLD_HUNT;
            const isAggressive = creature.traits.aggressiveness > CONFIG.AGGRESSIVENESS_THRESHOLD_ATTACK;
            const notCrowded = ctx.localDensity < CONFIG.DENSITY_THRESHOLD_NO_ATTACK;

            // 🦁 Correction : Les carnivores peuvent chasser même sans être agressifs
            if ((isCarnivore && isHungry && notCrowded) ||
                (isAggressive && isHungry && notCrowded && creature.genes.carnivore > 0.2)) {

                scores.hunt =
                    creature.genes.carnivore * 80 +
                    creature.traits.hunting_preference * 40 +
                    hunger * 40 +
                    distFactor * 20;
            }
        }

        // --- 3) Fuite ---
        if (ctx.nearbyThreat) {
            scores.flee =
                creature.traits.fear * 100 +
                (1 - creature.traits.aggressiveness) * 40 +
                (1 - creature.genes.carnivore) * 30;
        }

        // --- 4) Chercher une ressource ---
        if (ctx.nearbyResource) {
            scores.move_towards_resource =
                60 +
                hunger * 80 +
                creature.traits.gathering_preference * 50;
        }

        // --- 5) Exploration ---
        const densityPenalty = ctx.localDensity * 40;
        const dangerPenalty = ctx.nearbyThreat ? 50 : 0;

        scores.explore =
            creature.traits.curiosity * 80 +
            Math.random() * 20 +
            (1 - densityPenalty) * 30 -
            dangerPenalty;

        scores._ctx = ctx;
        return scores;
    }



    // --- Choisir la meilleure action ---
    static chooseBestAction(scores) {
        let best = null;
        let bestScore = -Infinity;

        for (let action in scores) {
            if (scores[action] > bestScore && action !== "_ctx") {
                bestScore = scores[action];
                best = action;
            }
        }

        const ctx = scores._ctx;

        switch (best) {

            case "eat":
                return "eat";

            case "hunt":
                if (ctx.nearbyPrey)
                    return { type: "move_towards", target: ctx.nearbyPrey };
                return { type: "move_random" };

            case "flee":
                return { type: "flee", threat: ctx.nearbyThreat };

            case "move_towards_resource":
                if (ctx.nearbyResource)
                    return { type: "move_towards", target: ctx.nearbyResource };
                return { type: "move_random" };

            case "explore":
                return { type: "explore" };

            default:
                return { type: "move_random" };
        }
    }

    // --- Recherche optimisée de ressources ---
    static findNearbyResource(creature, world) {
        const vision = Math.floor(creature.genes.vision);
        let best = null;
        let bestScore = -Infinity;

        for (let dy = -vision; dy <= vision; dy++) {
            for (let dx = -vision; dx <= vision; dx++) {

                const nx = creature.x + dx;
                const ny = creature.y + dy;

                if (!world.isInside(nx, ny)) continue;
                if (dx === 0 && dy === 0) continue;

                const cell = world.getCell(nx, ny);
                if (!cell.resource) continue;

                const dist = Math.abs(dx) + Math.abs(dy);
                const distFactor = 1 / (dist + 1);

                const threat = this.findNearbyThreat(creature, world);
                const dangerPenalty = threat ? 0.5 : 1;

                const density = this.computeLocalDensityAt(world, nx, ny);
                const densityPenalty = 1 - density;

                const score =
                    distFactor * 60 +
                    creature.traits.gathering_preference * 40 +
                    densityPenalty * 30 +
                    dangerPenalty * 20;

                if (score > bestScore) {
                    bestScore = score;
                    best = { x: nx, y: ny };
                }
            }
        }

        return best;
    }

    // --- Recherche de proies ---
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
                if (target === creature) continue;
                
                // Éviter les attaques entre créatures au régime alimentaire similaire
                const carnivoreDiff = Math.abs(creature.genes.carnivore - target.genes.carnivore);
                if (carnivoreDiff < 0.3) continue; // Pas assez de différence alimentaire

                return { x: nx, y: ny };
            }
        }

        return null;
    }

    // --- Recherche de menaces ---
    static findNearbyThreat(creature, world) {
        const vision = Math.floor(creature.genes.vision);

        for (let dy = -vision; dy <= vision; dy++) {
            for (let dx = -vision; dx <= vision; dx++) {

                const nx = creature.x + dx;
                const ny = creature.y + dy;

                if (!world.isInside(nx, ny)) continue;
                if (dx === 0 && dy === 0) continue;

                const cell = world.getCell(nx, ny);
                if (!cell.creature) continue;

                const other = cell.creature;

                if (other.genes.carnivore > 0.6 || other.traits.aggressiveness > 0.7) {
                    return { x: nx, y: ny };
                }
            }
        }

        return null;
    }

    // --- Densité locale autour de la créature ---
    static computeLocalDensity(creature, world) {
        return this.computeLocalDensityAt(world, creature.x, creature.y);
    }

    // --- Densité locale autour d'une position ---
    static computeLocalDensityAt(world, x, y) {
        const radius = 2;
        let count = 0;

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {

                const nx = x + dx;
                const ny = y + dy;

                if (!world.isInside(nx, ny)) continue;
                if (dx === 0 && dy === 0) continue;

                const cell = world.getCell(nx, ny);
                if (cell.creature) count++;
            }
        }

        return Math.min(1, count / 12);
    }
}
