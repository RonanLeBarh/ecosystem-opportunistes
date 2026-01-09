# Architecture Technique — Écosystème d’Opportunistes Minimalistes

## 1. Vue d’ensemble

Le projet est structuré en modules indépendants et lisibles.  
Chaque module a une responsabilité claire.  
L’objectif est de permettre une évolution simple du code sans créer de dépendances complexes.

L’architecture repose sur 5 grands blocs :

1. **Engine** — moteur du monde (grille, ressources, obstacles)
2. **Creatures** — moteur des créatures (traits, comportement, reproduction)
3. **Simulation** — boucle principale, mise à jour, gestion du temps
4. **UI** — affichage 2D minimaliste (canvas)
5. **Logging** — journalisation, statistiques, résumé final

---

## 2. Structure des dossiers

/src
/engine
world.js
cell.js
resources.js
obstacles.js

/creatures
creature.js
traits.js
behavior.js
reproduction.js
memory.js

/simulation
loop.js
events.js
config.js

/ui
renderer.js
colors.js
controls.js

/logging
logger.js
stats.js
summarizer.js

---

## 3. Description des modules

### 3.1 /engine

#### **world.js**
- Initialise la grille
- Stocke les cases
- Fournit des méthodes :
  - `getCell(x, y)`
  - `setCreature(x, y, creature)`
  - `moveCreature(from, to)`
  - `addResource(x, y)`
  - `isObstacle(x, y)`
- Gère les limites du monde

#### **cell.js**
- Représente une case de la grille
- Peut contenir :
  - ressource
  - obstacle
  - créature
  - vide

#### **resources.js**
- Gère :
  - densité initiale
  - régénération
  - valeur énergétique
- Méthodes :
  - `spawnResources()`
  - `regenerate()`

#### **obstacles.js**
- Génère des obstacles fixes
- Peut créer des zones, murs, couloirs

---

### 3.2 /creatures

#### **creature.js**
- Classe principale d’une créature
- Contient :
  - traits génétiques
  - traits dynamiques
  - position
  - énergie
  - âge
  - mémoire
- Méthodes :
  - `update()`
  - `decide()`
  - `move()`
  - `eat()`
  - `hunt()`
  - `flee()`
  - `reproduce()`
  - `die()`

#### **traits.js**
- Initialise les traits génétiques
- Gère les mutations
- Gère la transmission des traits

#### **behavior.js**
- Calcule le score interne
- Détermine l’action optimale
- Prend en compte :
  - faim
  - danger
  - opportunités
  - imitation
  - curiosité
  - agressivité

#### **reproduction.js**
- Gère :
  - conditions de reproduction
  - création du descendant
  - mutation des traits
  - placement du nouveau-né

#### **memory.js**
- Mémoire courte :
  - dernière zone riche
  - dernier danger
  - dernier comportement observé

---

### 3.3 /simulation

#### **loop.js**
- Boucle principale :
  - mise à jour des ressources
  - mise à jour des créatures
  - mort / naissance
  - logs
  - stats
  - rendu visuel

#### **events.js**
- Détecte les événements importants :
  - extinction de lignée
  - explosion de population
  - mutation rare
  - migration
  - pénurie de nourriture

#### **config.js**
- Paramètres globaux :
  - taille de la grille
  - densité des ressources
  - taux de mutation
  - coût énergétique
  - vitesse de simulation

---

### 3.4 /ui

#### **renderer.js**
- Dessine la grille
- Dessine les créatures (carrés colorés)
- Dessine les ressources
- Dessine les obstacles

#### **colors.js**
- Convertit les traits génétiques en couleur
- Gère les variations visuelles

#### **controls.js**
- Pause / reprise
- Vitesse de simulation
- Zoom (optionnel)
- Sélection d’une créature (optionnel)

---

### 3.5 /logging

#### **logger.js**
- Enregistre :
  - naissances
  - morts
  - mutations
  - événements majeurs
- Format texte simple

#### **stats.js**
- Calcule :
  - population
  - âge moyen
  - énergie moyenne
  - distributions des traits
  - diversité génétique

#### **summarizer.js**
- Génère un résumé final :
  - lignées dominantes
  - stratégies observées
  - événements marquants
  - évolution des traits
  - analyse narrative

---

## 4. Flux de données

### 1. La simulation appelle :
- `world.updateResources()`
- `creature.update()`
- `logger.log()`
- `stats.update()`
- `renderer.draw()`

### 2. Les créatures lisent :
- l’état du monde
- les cases voisines
- leur mémoire
- leurs traits

### 3. Les créatures écrivent :
- leur nouvelle position
- leur énergie
- leur âge
- leurs descendants

### 4. Le logger écrit :
- dans un buffer texte
- dans un fichier (optionnel plus tard)

---

## 5. Évolutivité

L’architecture permet d’ajouter facilement :

- nouvelles actions
- nouveaux traits
- nouveaux types de ressources
- météo / saisons
- IA plus avancée
- interface plus riche
- export JSON
- analyse automatique par IA

---

## 6. Conclusion

Cette architecture est :
- simple
- modulaire
- maintenable
- évolutive
- adaptée à ton style de travail
- parfaite pour un projet émergent

Elle te permettra d’ajouter des fonctionnalités sans casser le reste du code.
