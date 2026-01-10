// src/simulation/config.js

export const CONFIG = {
    // --- Monde ---
    WORLD_WIDTH: 100,
    WORLD_HEIGHT: 100,

    // --- Ressources ---
    RESOURCE_SPAWN_RATE: 0.05,        // densité initiale (5%)
    RESOURCE_REGEN_RATE: 0.001,        // régénération par cycle (1%)
    RESOURCE_ENERGY_VALUE: 20,        // énergie gagnée en mangeant 20

    // --- Obstacles ---
    OBSTACLE_DENSITY: 0.00,           // densité initiale (2%)

    // --- Créatures ---
    CREATURE_INITIAL_ENERGY: 20,         // énergie initiale 20
    //CREATURE_ENERGY_COST: 0.5,        // coût de maintenance par cycle

    // Durée de vie génétique
    CREATURE_MAX_AGE_MIN: 200,
    CREATURE_MAX_AGE_MAX: 600,
    AGE_MUTATION_AMOUNT: 10,          // variation possible à la reproduction

    // --- Mutations ---
    MUTATION_AMOUNT: 0.05,            // mutation des traits (0–1)
    COLOR_MUTATION_AMOUNT: 10,        // mutation couleur (0–255)

    // --- Simulation ---
    SIMULATION_SPEED: 2,            // cycles par frame (1 lent → 20 très rapide)
    SLOW_FACTOR: 5,                  // ralentit uniquement les petites vitesses 5 lent mais fluide 20 ultra lent


    // --- Reproduction ---
    REPRODUCTION_ENERGY_THRESHOLD: 80,   // énergie minimale pour se reproduire 80
    REPRODUCTION_ENERGY_COST: 40,        // coût pour le parent 40
    
    // --- Vision ---
    //VISION_RANGE: 10,                 // portée de vision des créatures

    // --- Debug ---
    DEBUG: true,              // active/désactive tous les logs
    DEBUG_CREATURE_ID: 12,   // si tu veux suivre UNE créature
    DEBUG_LOG_MOVEMENT: true, // log des déplacements
    DEBUG_LOG_DECISIONS: true,// log des décisions
    DEBUG_LOG_VISION: true,   // log de ce qu’elle voit

    // --- Bornes génétiques ---
    GENE_LIMITS: {
        SPEED_MIN: 1,
        SPEED_MAX: 5,

        VISION_MIN: 1,
        VISION_MAX: 10,

        METABOLISM_MIN: 0.2,
        METABOLISM_MAX: 3,

        FERTILITY_MIN: 0.1,
        FERTILITY_MAX: 1,

        MUTATION_RATE_MIN: 0.01,
        MUTATION_RATE_MAX: 0.1
    },

};
