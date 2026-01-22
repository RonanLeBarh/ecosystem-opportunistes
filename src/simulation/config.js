// src/simulation/config.js

export const CONFIG = {
    // --- Monde ---
    WORLD_WIDTH: 100,
    WORLD_HEIGHT: 100,

    // --- Ressources ---
    RESOURCE_SPAWN_RATE: 0.05,        // [0.01-0.10] Densité initiale de ressources. + = plus de nourriture pour herbivores
    RESOURCE_REGEN_RATE: 0.01,        // [0.001-0.05] Régénération par cycle. + = ressources plus rapides
    RESOURCE_ENERGY_VALUE: 100,      // [50-200] Énergie par ressource. + = herbivores plus viables

    // --- Obstacles ---
    OBSTACLE_DENSITY: 0.0,           // densité initiale (2%)

    // --- Énergie  ---
    CREATURE_INITIAL_ENERGY: 20,     // [10-50] Énergie de départ. + = plus de survie initiale
    CREATURE_MAX_ENERGY: 100,       // [50-200] Énergie maximale. + = plus de réserve

    // Durée de vie génétique
    CREATURE_MAX_AGE_MIN: 200,      // [100-500] Âge minimum. + = vie plus longue
    CREATURE_MAX_AGE_MAX: 600,      // [300-1000] Âge maximum. + = espérance de vie plus élevée
    AGE_MUTATION_AMOUNT: 10,        // [5-25] Variation d'âge à reproduction. + = plus de diversité

    // --- Mutations ---
    MUTATION_AMOUNT: 0.05,          // [0.01-0.15] Force des mutations. + = changements plus radicaux
    COLOR_MUTATION_AMOUNT: 10,      // [5-30] Mutation couleur. + = plus de variété visuelle

    // --- Simulation ---
    SIMULATION_SPEED: 1,            // [1-20] Cycles par frame. + = simulation plus rapide
    SLOW_FACTOR: 30,               // [5-50] Ralentissement des vitesses lentes. + = mouvements plus fluides
    MAX_CYCLES_PER_FRAME: 10,      // [5-20] Limite de cycles par frame. + = plus rapide mais risque de lags

    // --- Reproduction ---
    REPRODUCTION_ENERGY_THRESHOLD: 80,  // [50-100] Énergie minimale pour reproduction. + = plus difficile
    REPRODUCTION_ENERGY_COST: 40,       // [20-80] Coût énergétique. + = reproduction plus coûteuse

    // --- Seuils de faim (0 = rassasié, 1 = affamé) ---
    HUNGER_THRESHOLD_HUNT: 0.30,     // [0.3-0.9] Seuil pour chasser. + = plus difficile de chasser
    HUNGER_THRESHOLD_FLEE: 0.30,     // [0.1-0.5] Seuil pour fuir. + = fuite plus rare
    HUNGER_THRESHOLD_REPRO: 0.20,    // [0.1-0.4] Seuil pour reproduction. + = reproduction plus facile

    // --- Agressivité ---
    AGGRESSIVENESS_THRESHOLD_ATTACK: 0.3,  // [0.2-0.9] Seuil d'agressivité. + = attaques plus rares

    // --- Densité ---
    DENSITY_THRESHOLD_NO_ATTACK: 0.8,      // [0.1-0.8] Densité max pour attaquer. + = attaques même si dense

    // --- Mode Équilibré ---
    PACIFIST_MODE: false,                  // true = pacifique, false = normal
    HERBIVORE_BONUS: 1.0,                  // [0.5-2.0] Bonus herbivores. + = herbivores plus forts
    CARNIVORE_MALUS: 1.0,                  // [0.5-2.0] Malus carnivores. + = carnivores plus faibles
    
    // --- Équilibre évolutif ---
    CARNIVORE_ENERGY_PENALTY: 0.1,         // [0.0-0.5] Coût supplémentaire carnivores. + = plus cher
    HERBIVORE_RESOURCE_BONUS: 1.2,         // [1.0-2.0] Bonus ressources herbivores. + = plus d'énergie
    CARNIVORE_REPRODUCTION_MALUS: 1.0,     // [0.7-1.5] Malus reproduction carnivores. + = moins de reproduction

    // --- Debug ---
    DEBUG: true,              // active/désactive tous les logs
    DEBUG_CREATURE_ID: 12,   // si tu veux suivre UNE créature
    DEBUG_LOG_MOVEMENT: true, // log des déplacements
    DEBUG_LOG_DECISIONS: true,// log des décisions
    DEBUG_LOG_VISION: true,   // log de ce qu’elle voit

    // --- Bornes génétiques ---
    GENE_LIMITS: {
        SPEED_MIN: 1,          // Vitesse minimale
        SPEED_MAX: 5,          // [1-10] Vitesse maximale. + = mouvements plus rapides

        VISION_MIN: 1,         // Vision minimale
        VISION_MAX: 10,        // [5-20] Vision maximale. + = détection plus lointaine

        METABOLISM_MIN: 0.2,   // Métabolisme minimal (faible consommation)
        METABOLISM_MAX: 3,     // [1-5] Métabolisme maximal. + = plus de dépense énergétique

        FERTILITY_MIN: 0.1,    // Fertilité minimale
        FERTILITY_MAX: 1,      // [0.5-1] Fertilité maximale. + = reproduction plus fréquente

        MUTATION_RATE_MIN: 0.05,   // 5% minimum de mutation
        MUTATION_RATE_MAX: 0.3,     // [0.1-0.5] 30% maximum. + = plus de diversité génétique

        CARNIVORE_MIN: 0,       // 0% = herbivore pur
        CARNIVORE_MAX: 1,       // 100% = carnivore pur
    },

    // Tolérance pour le calcul de la couleur moyenne
    COLOR_FAMILY_TOLERANCE: 30,

};
