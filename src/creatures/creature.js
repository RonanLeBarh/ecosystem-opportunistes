// src/creatures/creature.js

import { Traits } from "./traits.js";
import { CONFIG } from "../simulation/config.js";
import { Reproduction } from "./reproduction.js";
import { Behavior } from "./behavior.js";

export class Creature {
    constructor(x, y, traits = Traits.random()) {
        this.x = x;
        this.y = y;

        this.traits = traits;

        // États dynamiques
        this.energy = CONFIG.CREATURE_START_ENERGY;
        this.age = 0;

        // Mémoire simple (sera étendue plus tard)
        this.memory = {
            lastRichSpot: null,
            lastDanger: null,
            lastObservedSuccess: null
        };
    }

    // Mise à jour d'une créature à chaque cycle
    update(world) {
        this.age++;
        this.energy -= CONFIG.CREATURE_ENERGY_COST; // coût de maintenance

        if (this.energy <= 0 || this.age >= this.traits.max_age) {
            this.die(world);
            return;
        }

        const action = this.decide(world);
        this.executeAction(action, world);
        // Reproduction
        if (Reproduction.canReproduce(this)) {
            Reproduction.createOffspring(this, world);
        }
    }

    // Décision de l'action à effectuer
    decide(world) {
        return Behavior.decide(this, world);
    }

    // Exécution de l'action
    executeAction(action, world) {
        switch (action) {
            case "eat":
                this.eat(world);
                break;

            case "move_random":
                this.moveRandom(world);
                break;
            case "move_towards":
                this.moveTowards(action.target, world);
                break;
        }
    }
    
    // Déplacement vers une cible
    moveTowards(target, world) {
        const dx = Math.sign(target.x - this.x);
        const dy = Math.sign(target.y - this.y);

        const newX = this.x + dx;
        const newY = this.y + dy;

        if (!world.isInside(newX, newY)) return;

        const cell = world.getCell(newX, newY);
        if (cell.obstacle || cell.creature) return;

        world.moveCreature(this.x, this.y, newX, newY);
        this.x = newX;
        this.y = newY;
    }

    // Manger une ressource
    eat(world) {
        const cell = world.getCell(this.x, this.y);
        if (cell.resource) {
            cell.resource = false;
            this.energy += CONFIG.RESOURCE_ENERGY_VALUE;
        }
    }

    // Déplacement aléatoire simple
    moveRandom(world) {
        const dirs = [
            [1, 0], [-1, 0],
            [0, 1], [0, -1]
        ];

        const [dx, dy] = dirs[Math.floor(Math.random() * dirs.length)];

        const newX = this.x + dx;
        const newY = this.y + dy;

        if (!world.isInside(newX, newY)) return;

        const target = world.getCell(newX, newY);
        if (target.obstacle || target.creature) return;

        // Déplacement
        world.moveCreature(this.x, this.y, newX, newY);
        this.x = newX;
        this.y = newY;
    }

    // Mort de la créature
    die(world) {
        const cell = world.getCell(this.x, this.y);
        if (cell) {
            cell.creature = null;
        }
        this.dead = true;
        world.simulation.logger.log("death", {
            x: this.x,
            y: this.y,
            age: this.age,
            energy: this.energy,
            cycle: world.simulation.cycle
        });
    }
}
