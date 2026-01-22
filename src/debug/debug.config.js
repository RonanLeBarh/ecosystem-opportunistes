// src/debug/debug.config.js

export const DEBUG_CONFIG = {
    DEBUG: true,

    DEBUG_CREATURE_ID: null,    // Mettre un ID de créature pour ne logger que ses actions (null pour désactiver)

    // Mouvements
    DEBUG_MOVE_TOWARDS: false,  // mouvement vers une cible
    DEBUG_MOVE_RANDOM: false,   // mouvement aléatoire
    DEBUG_MOVE_BLOCKED: false,  // mouvement bloqué

    // Autres catégories
    DEBUG_DECISIONS: false,     // décisions générales
    DEBUG_VISION: false,        // vision (recherche de proies/menaces)
    DEBUG_REPRODUCTION: false,  // reproduction
    DEBUG_ENERGY: false,        // gestion de l'énergie
    DEBUG_POPULATION: false,    // population (naissances/morts)
    DEBUG_CYCLE: false,       // cycles de simulation

    // Morts spécifiques
    DEBUG_DEATH: false,        // mort générique (si tu veux garder)
    DEBUG_DEATH_ENERGY: true,  // mort par énergie
    DEBUG_DEATH_AGE: false,     // mort par âge
    DEBUG_PREDATION: false,     // mort par prédation
    DEBUG_ATTACK_BLOCKED: false, // attaques bloquées

    // Naissances
    DEBUG_BIRTH_INITIAL: false,  // naissance initiale
    DEBUG_BIRTH_REPRODUCTION: false,// naissance par reproduction

    DEBUG_LIMIT: false,
    DEBUG_MAX_LOGS: 2000,
};
