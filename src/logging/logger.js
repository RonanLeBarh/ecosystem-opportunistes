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
}
