// src/logging/logger.js

export class Logger {
    constructor() {
        this.entries = [];
    }

    log(type, data = {}) {
        const entry = {
            cycle: data.cycle ?? null,
            type,
            ...data
        };

        this.entries.push(entry);

        // Affichage console (optionnel mais utile)
        console.log(`[${type}]`, entry);
    }

    getAll() {
        return this.entries;
    }

    debug(type, data = {}) {
        if (!data.config?.DEBUG) return;

        // Filtrage par ID si demandé
        if (data.config.DEBUG_CREATURE_ID !== null) {
            if (data.creatureId !== data.config.DEBUG_CREATURE_ID) return;
        }

        console.log(`[DEBUG:${type}]`, data);
    }

}
