// src/engine/cell.js

export class Cell {
    constructor() {
        this.resource = false;   // Présence de nourriture
        this.obstacle = false;   // Case bloquée
        this.creature = null;    // Référence vers une créature
    }

    isEmpty() {
        return !this.resource && !this.obstacle && !this.creature;
    }

    hasResource() {
        return this.resource === true;
    }

    hasCreature() {
        return this.creature !== null;
    }
}
