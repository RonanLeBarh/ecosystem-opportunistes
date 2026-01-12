// src/creatures/traits.js

import { CONFIG } from "../simulation/config.js";

export class Traits {
    constructor({
        // Traits visibles (couleur)
        color_r = Math.floor(Math.random() * 256),
        color_g = Math.floor(Math.random() * 256),
        color_b = Math.floor(Math.random() * 256),

        // Traits comportementaux
        gathering_preference = Math.random(),
        hunting_preference = Math.random(),
        aggressiveness = Math.random(),
        curiosity = Math.random(),
        fear = Math.random(),

        // Traits physiques
        speed = 1,
        efficiency = Math.random(),
        max_age = CONFIG.CREATURE_MAX_AGE_MIN + Math.random() * (CONFIG.CREATURE_MAX_AGE_MAX - CONFIG.CREATURE_MAX_AGE_MIN)
    } = {}) {
        this.color_r = color_r;
        this.color_g = color_g;
        this.color_b = color_b;

        this.gathering_preference = gathering_preference;
        this.hunting_preference = hunting_preference;
        this.aggressiveness = aggressiveness;
        this.curiosity = curiosity;
        this.fear = fear;

        this.speed = speed;
        this.efficiency = efficiency;
        this.max_age = max_age;
    }

    // Génère un ensemble de traits totalement aléatoires
    static random() {
        return new Traits({});
    }

    // Hérite des traits du parent avec mutation légère
    static inherit(parentTraits) {
        
        // Fonction de mutation
        const mutate = (value, amount = CONFIG.MUTATION_AMOUNT) => {
            let v = value + (Math.random() * 2 - 1) * amount;
            return Math.min(1, Math.max(0, v)); // clamp 0–1
        };
        // Mutation couleur
        const mutateColor = (value) => {
            let v = value + Math.floor((Math.random() * 2 - 1) * CONFIG.COLOR_MUTATION_AMOUNT);
            return Math.min(255, Math.max(0, v));
        };
        // Mutation légère
        let newSpeed = parentTraits.speed + (Math.random() * 2 - 1) * CONFIG.MUTATION_AMOUNT;

        // Clamp dans les bornes
        newSpeed = Math.max(CONFIG.GENE_LIMITS.SPEED_MIN, Math.min(CONFIG.GENE_LIMITS.SPEED_MAX, newSpeed));


        return new Traits({
            // Couleur
            color_r: mutateColor(parentTraits.color_r),
            color_g: mutateColor(parentTraits.color_g),
            color_b: mutateColor(parentTraits.color_b),

            // Comportement
            gathering_preference: mutate(parentTraits.gathering_preference),
            hunting_preference: mutate(parentTraits.hunting_preference),
            aggressiveness: mutate(parentTraits.aggressiveness),
            curiosity: mutate(parentTraits.curiosity),
            fear: mutate(parentTraits.fear),

            // Physique
            speed: newSpeed,
            efficiency: mutate(parentTraits.efficiency),
            max_age: parentTraits.max_age + (Math.random() * 2 - 1) * CONFIG.AGE_MUTATION_AMOUNT
        });
    }
}
