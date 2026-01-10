// src/main.js

import { Simulation } from "./simulation/loop.js";
import { Renderer } from "./ui/renderer.js";
import { CONFIG } from "./simulation/config.js";
import { HUD } from "./ui/hud.js";

// Nombre de créatures initiales (on l'ajoute ici pour éviter d'éditer config.js)
CONFIG.INITIAL_CREATURE_COUNT = 50;

// Création de la simulation
const sim = new Simulation();
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
