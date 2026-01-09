// src/main.js

import { Simulation } from "./simulation/loop.js";
import { Renderer } from "./ui/renderer.js";
import { CONFIG } from "./simulation/config.js";

// Nombre de créatures initiales (on l'ajoute ici pour éviter d'éditer config.js)
CONFIG.INITIAL_CREATURE_COUNT = 50;

// Création de la simulation
const sim = new Simulation();
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

renderLoop();
sim.start();
