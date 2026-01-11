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
        this.elCarnivoreAvg = document.getElementById("hud-carnivore-avg");
        this.elHerbivores = document.getElementById("hud-herbivores");
        this.elOmnivores = document.getElementById("hud-omnivores");
        this.elCarnivores = document.getElementById("hud-carnivores");
        this.elAvgSpeed = document.getElementById("hud-avg-speed");
        this.elAvgVision = document.getElementById("hud-avg-vision");
        this.elAvgMetabolism = document.getElementById("hud-avg-metabolism");
        this.elAvgFertility = document.getElementById("hud-avg-fertility");
        this.elAvgMutation = document.getElementById("hud-avg-mutation");

        this.elAvgMaxAge = document.getElementById("hud-avg-maxage");
        this.elAvgColor = document.getElementById("hud-avg-color");

        this.elTopGenes = document.getElementById("hud-top-genes");

        this.elTopColors = document.getElementById("hud-top-colors");

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
        this.elCarnivoreAvg.textContent = (sim.stats.avgCarnivore * 100).toFixed(1) + "%";
        this.elHerbivores.textContent = sim.stats.herbivores;
        this.elOmnivores.textContent = sim.stats.omnivores;
        this.elCarnivores.textContent = sim.stats.carnivores;
        this.elAvgSpeed.textContent = sim.stats.avgSpeed.toFixed(2);
        this.elAvgVision.textContent = sim.stats.avgVision.toFixed(2);
        this.elAvgMetabolism.textContent = sim.stats.avgMetabolism.toFixed(2);
        this.elAvgFertility.textContent = sim.stats.avgFertility.toFixed(2);
        this.elAvgMutation.textContent = (sim.stats.avgMutation * 100).toFixed(2) + "%";

        this.elAvgMaxAge.textContent = sim.stats.avgMaxAge.toFixed(1);

        const col = sim.stats.avgColor;
        this.elAvgColor.innerHTML = 
            `<div style="display:flex; align-items:center;">
                <span style="
                    width:18px;
                    height:18px;
                    background:rgb(${col.r.toFixed(0)}, ${col.g.toFixed(0)}, ${col.b.toFixed(0)});
                    border:1px solid #000;
                    margin-right:6px;
                "></span>
                rgb(${col.r.toFixed(0)}, ${col.g.toFixed(0)}, ${col.b.toFixed(0)})
            </div>`;
        this.elTopGenes.innerHTML = sim.stats.topGenes
            .map(g => `<div>${g.name} : ${g.value}</div>`)
            .join("");
        
        this.elTopColors.innerHTML = sim.stats.topColors
            .map(c => `
                <div style="display:flex; align-items:center; margin-bottom:3px;">
                    <span style="
                        width:18px;
                        height:18px;
                        background:${c.rgb};
                        border:1px solid #000;
                        margin-right:6px;
                    "></span>
                    ${c.rgb} — ${c.percent}%
                </div>
            `)
            .join("");



    }
}
