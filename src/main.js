// src/main.js

import { Simulation } from "./simulation/loop.js";
import { Renderer } from "./ui/renderer.js";
import { CONFIG } from "./simulation/config.js";
import { HUD } from "./ui/hud.js";

// Nombre de créatures initiales (on l'ajoute ici pour éviter d'éditer config.js)
CONFIG.INITIAL_CREATURE_COUNT = 50;

// Création de la simulation
let sim = new Simulation();
sim.init();
document.getElementById("speed").value = CONFIG.SIMULATION_SPEED;

// Bouton pause
document.getElementById("btn-pause").addEventListener("click", () => {
    if (sim.running) {
        sim.stop();
        document.getElementById("btn-pause").textContent = "Reprendre";
    } else {
        sim.start();
        document.getElementById("btn-pause").textContent = "Pause";
    }
});

// Bouton reset
document.getElementById("btn-reset").addEventListener("click", () => {
    sim.stop();

    // Nouvelle simulation
    sim = new Simulation();
    sim.init();

    // HUD mis à jour
    window.hud.simulation = sim;

    // Renderer mis à jour
    renderer.simulation = sim;

    // Redémarrage
    sim.start();
});


// Slider vitesse
document.getElementById("speed").addEventListener("input", (e) => {
    CONFIG.SIMULATION_SPEED = Number(e.target.value);
});




sim.logger.simulation = sim;

// Création du HUD
const hud = new HUD(sim);
window.hud = hud;// On rend le HUD accessible globalement si besoin

// initialisation du monde
sim.init();

// Récupération du canvas
const canvas = document.getElementById("worldCanvas");

// Création du renderer
const renderer = new Renderer(sim, canvas);

// Boucle d'affichage
function renderLoop() {
    renderer.draw();
    requestAnimationFrame(renderLoop);
}

// Démarrage de la boucle d'affichage
renderLoop();

// Démarrage de la simulation
sim.start();
