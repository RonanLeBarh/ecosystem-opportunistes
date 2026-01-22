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
            "predation" : "DEBUG_PREDATION",
            "attack_blocked": "DEBUG_ATTACK_BLOCKED",


            // Population
            "population": "DEBUG_POPULATION",
            "cycle": "DEBUG_CYCLE",
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
            "predation" : "Mort par une autre créature",
            "attack_blocked": "Attaque bloquée",

            "population": "Population",
            "cycle": "Cycle",
        };

    }

    log(type, data) {
        if (type === "birth_initial") this.simulation.stats.birthInitial++;
        if (type === "birth_reproduction") this.simulation.stats.birthReproduction++;
        if (type === "death_energy") {
            this.simulation.stats.deathEnergy++;
            
            // 📊 Comptage détaillé par type de créature
            if (data.creatureId) {
                const creature = this.simulation.creatures.find(c => c.id === data.creatureId);
                if (creature) {
                    if (creature.genes.carnivore > 0.66) {
                        this.simulation.stats.deathCarnivoreHunger++;
                        this.simulation.stats.deathByType.carnivore++;
                    } else if (creature.genes.carnivore < 0.33) {
                        this.simulation.stats.deathHerbivoreHunger++;
                        this.simulation.stats.deathByType.herbivore++;
                    } else {
                        this.simulation.stats.deathOmnivoreHunger++;
                        this.simulation.stats.deathByType.omnivore++;
                    }
                }
            }
        }
        if (type === "death_age") this.simulation.stats.deathAge++;
        if (type === "predation") {
            this.simulation.stats.deathsByAttack++;
            
            // 🗡️ Comptage détaillé des victimes par type
            if (data.prey) {
                // Utiliser les données directes du log au lieu de chercher dans la liste
                const preyCarnivore = data.preyCarnivore || 0;
                if (preyCarnivore > 0.66) {
                    this.simulation.stats.deathByAttackByType.carnivore++;
                } else if (preyCarnivore < 0.33) {
                    this.simulation.stats.deathByAttackByType.herbivore++;
                } else {
                    this.simulation.stats.deathByAttackByType.omnivore++;
                }
            }
        }
        
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
