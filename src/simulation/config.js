// src/simulation/config.js

export const CONFIG = {
    // --- Monde ---
    WORLD_WIDTH: 100,
    WORLD_HEIGHT: 100,

    // --- Ressources ---
    RESOURCE_SPAWN_RATE: 0.05,        // densité initiale (5%)
    RESOURCE_REGEN_RATE: 0.01,        // régénération par cycle (1%)
    RESOURCE_ENERGY_VALUE: 20,        // énergie gagnée en mangeant

    // --- Obstacles ---
    OBSTACLE_DENSITY: 0.02,           // densité initiale (2%)

    // --- Créatures ---
    CREATURE_START_ENERGY: 50,
    CREATURE_ENERGY_COST: 0.5,        // coût de maintenance par cycle

    // Durée de vie génétique
    CREATURE_MAX_AGE_MIN: 200,
    CREATURE_MAX_AGE_MAX: 600,
    AGE_MUTATION_AMOUNT: 10,          // variation possible à la reproduction

    // --- Mutations ---
    MUTATION_AMOUNT: 0.05,            // mutation des traits (0–1)
    COLOR_MUTATION_AMOUNT: 10,        // mutation couleur (0–255)

    // --- Simulation ---
    SIMULATION_SPEED: 1,              // cycles par frame (modifiable)
};
