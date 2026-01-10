// src/logging/logger.js

import { DEBUG_CONFIG } from "../debug/debug.config.js";

export class Logger {
    constructor() {
        this.count = 0;

        this.typeToFlag = {
            // Mouvements
            "move_towards": "DEBUG_MOVE_TOWARDS",
            "move_random": "DEBUG_MOVE_RANDOM",
            "move_blocked": "DEBUG_MOVE_BLOCKED",

            // Décisions
            "decision": "DEBUG_DECISIONS",
            "vision": "DEBUG_VISION",

            // Reproduction
            "reproduction": "DEBUG_REPRODUCTION",
            "birth_initial": "DEBUG_BIRTH_INITIAL",
            "birth_reproduction": "DEBUG_BIRTH_REPRODUCTION",

            // Énergie
            "eat": "DEBUG_ENERGY",
            "energy": "DEBUG_ENERGY",

            // Mort
            "death": "DEBUG_DEATH",
            "death_energy": "DEBUG_DEATH_ENERGY",
            "death_age": "DEBUG_DEATH_AGE",


            // Population
            "population": "DEBUG_POPULATION",
            "cycle": "DEBUG_POPULATION",
        };


        this.typeToLabel = {
            "move_towards": "Déplacement vers une cible",
            "move_random": "Déplacement aléatoire",
            "move_blocked": "Déplacement bloqué",

            "decision": "Décision",
            "vision": "Vision",

            "reproduction": "Reproduction",
            "birth_initial": "Naissance initiale",
            "birth_reproduction": "Naissance par reproduction",

            "eat": "Consommation de ressource",
            "energy": "Énergie",

            "death": "Mort",
            "death_energy": "Mort par énergie",
            "death_age": "Mort par âge",

            "population": "Population",
            "cycle": "Cycle",
        };

    }

    log(type, data) {
        if (!DEBUG_CONFIG.DEBUG) return;

        if (DEBUG_CONFIG.DEBUG_LIMIT && this.count >= DEBUG_CONFIG.DEBUG_MAX_LOGS)
            return;

        // Vérifie si ce type de log est supporté
        const flagName = this.typeToFlag[type];

        if (!flagName) {
            console.warn(
                `[Logger] Type de log inconnu : "${type}". ` +
                `Aucun flag correspondant dans DEBUG_CONFIG.`
            );
            return;
        }

        if (!DEBUG_CONFIG[flagName]) return;

        if (DEBUG_CONFIG.DEBUG_CREATURE_ID !== null) {
            if (
                data.creatureId !== DEBUG_CONFIG.DEBUG_CREATURE_ID &&
                data.parentId !== DEBUG_CONFIG.DEBUG_CREATURE_ID &&
                data.childId !== DEBUG_CONFIG.DEBUG_CREATURE_ID
            ) {
                return;
            }
        }

        const label = this.typeToLabel[type] || type;
        console.log(`[${label}]`, data);

        this.count++;
    }
}
