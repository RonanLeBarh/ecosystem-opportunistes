export class HUD {
    constructor(simulation) {
        this.simulation = simulation;

        this.elCreatures = document.getElementById("hud-creatures");
        this.elAge = document.getElementById("hud-age");
        this.elDeathEnergy = document.getElementById("hud-death-energy");
        this.elDeathAge = document.getElementById("hud-death-age");
        this.elBirths = document.getElementById("hud-births");
        this.elCycle = document.getElementById("hud-cycle");
        this.elResources = document.getElementById("hud-resources");
    }

    update() {
        const sim = this.simulation;

        this.elCreatures.textContent = sim.creatures.length;
        this.elAge.textContent = sim.stats.averageAge.toFixed(1);
        this.elDeathEnergy.textContent = sim.stats.deathEnergyPercent.toFixed(1) + "%";
        this.elDeathAge.textContent = sim.stats.deathAgePercent.toFixed(1) + "%";
        this.elBirths.textContent = `${sim.stats.birthInitial} / ${sim.stats.birthReproduction}`;
        this.elCycle.textContent = sim.cycle;
        this.elResources.textContent = sim.stats.totalResources;
    }
}
