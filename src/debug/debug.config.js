// src/debug/debug.config.js

export const DEBUG_CONFIG = {
    DEBUG: true,

    DEBUG_CREATURE_ID: null,    // Mettre un ID de créature pour ne logger que ses actions (null pour désactiver)

    // Mouvements
    DEBUG_MOVE_TOWARDS: false,
    DEBUG_MOVE_RANDOM: false,
    DEBUG_MOVE_BLOCKED: false,

    // Autres catégories
    DEBUG_DECISIONS: false,
    DEBUG_VISION: false,
    DEBUG_REPRODUCTION: false,
    DEBUG_ENERGY: false,
    DEBUG_POPULATION: false,

    // Morts spécifiques
    DEBUG_DEATH: false,          // mort générique (si tu veux garder)
    DEBUG_DEATH_ENERGY: false,   // mort par énergie
    DEBUG_DEATH_AGE: false,      // mort par âge
    DEBUG_PREDATION: true,      // mort par prédation

    // Naissances
    DEBUG_BIRTH_INITIAL: false,
    DEBUG_BIRTH_REPRODUCTION: false,

    DEBUG_LIMIT: false,
    DEBUG_MAX_LOGS: 2000,
};
