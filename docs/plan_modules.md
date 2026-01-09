# Plan détaillé des modules — Écosystème d’Opportunistes Minimalistes

Ce document décrit précisément le rôle de chaque fichier du projet.  
Il sert de guide pour coder proprement, sans ambiguïté, et pour avancer module par module.

---

# 1. /engine — Moteur du monde

## 1.1 world.js
Responsabilités :
- Initialiser la grille (tableau 2D)
- Fournir des méthodes utilitaires :
  - `getCell(x, y)`
  - `setCreature(x, y, creature)`
  - `moveCreature(fromX, fromY, toX, toY)`
  - `addResource(x, y)`
  - `removeResource(x, y)`
  - `isInside(x, y)`
  - `isObstacle(x, y)`
- Gérer les limites du monde
- Gérer les collisions simples

---

## 1.2 cell.js
Responsabilités :
- Représenter une case de la grille
- Contient :
  - `resource` (bool ou quantité)
  - `obstacle` (bool)
  - `creature` (référence ou null)
- Méthodes simples :
  - `isEmpty()`
  - `hasResource()`
  - `hasCreature()`

---

## 1.3 resources.js
Responsabilités :
- Générer les ressources initiales
- Régénérer les ressources à chaque cycle
- Paramètres :
  - densité initiale
  - taux de régénération
  - valeur énergétique
- Méthodes :
  - `spawnInitial(world)`
  - `regenerate(world)`

---

## 1.4 obstacles.js
Responsabilités :
- Générer des obstacles fixes
- Créer des zones, murs, couloirs
- Méthodes :
  - `generate(world, pattern)`

---

# 2. /creatures — Moteur des créatures

## 2.1 creature.js
Responsabilités :
- Classe principale d’une créature
- Contient :
  - position (x, y)
  - traits génétiques
  - traits dynamiques
  - mémoire
- Méthodes :
  - `update(world)`
  - `decide(world)`
  - `move(world)`
  - `eat(world)`
  - `hunt(world)`
  - `flee(world)`
  - `reproduce(world)`
  - `die(world)`

---

## 2.2 traits.js
Responsabilités :
- Générer les traits initiaux
- Gérer les mutations
- Gérer la transmission des traits
- Méthodes :
  - `createRandomTraits()`
  - `mutateTraits(parentTraits)`
  - `inheritTraits(parentTraits)`

---

## 2.3 behavior.js
Responsabilités :
- Calculer le score interne pour chaque action
- Pondérer les actions selon :
  - faim
  - danger
  - opportunités
  - imitation
  - curiosité
  - agressivité
- Méthodes :
  - `computeActionScores(creature, world)`
  - `chooseBestAction(scores)`

---

## 2.4 reproduction.js
Responsabilités :
- Vérifier si la créature peut se reproduire
- Créer un descendant
- Appliquer les mutations
- Placer le descendant dans une case libre
- Méthodes :
  - `canReproduce(creature)`
  - `createOffspring(creature)`
  - `placeOffspring(world, creature)`

---

## 2.5 memory.js
Responsabilités :
- Stocker une mémoire courte :
  - dernière zone riche
  - dernier danger
  - dernier comportement observé
- Méthodes :
  - `remember(creature, event)`
  - `forgetOldEntries(creature)`

---

# 3. /simulation — Boucle principale

## 3.1 loop.js
Responsabilités :
- Boucle de simulation :
  - mise à jour des ressources
  - mise à jour des créatures
  - mort / naissance
  - logs
  - stats
  - rendu visuel
- Méthodes :
  - `start()`
  - `update()`
  - `step()`

---

## 3.2 events.js
Responsabilités :
- Détecter les événements importants :
  - extinction de lignée
  - explosion de population
  - mutation rare
  - migration
  - pénurie de nourriture
- Méthodes :
  - `detectEvents(world, creatures)`
  - `report(event)`

---

## 3.3 config.js
Responsabilités :
- Stocker tous les paramètres globaux :
  - taille de la grille
  - densité des ressources
  - taux de mutation
  - coût énergétique
  - vitesse de simulation
- Exporter un objet `CONFIG`

---

# 4. /ui — Affichage

## 4.1 renderer.js
Responsabilités :
- Dessiner la grille
- Dessiner les créatures
- Dessiner les ressources
- Dessiner les obstacles
- Méthodes :
  - `draw(world, creatures)`
  - `drawCreature(creature)`
  - `drawResource(x, y)`
  - `drawObstacle(x, y)`

---

## 4.2 colors.js
Responsabilités :
- Convertir les traits génétiques en couleur
- Gérer les variations visuelles
- Méthodes :
  - `traitsToColor(traits)`
  - `mutateColor(traits)`

---

## 4.3 controls.js
Responsabilités :
- Pause / reprise
- Vitesse de simulation
- Zoom (optionnel)
- Sélection d’une créature (optionnel)
- Méthodes :
  - `togglePause()`
  - `setSpeed(value)`

---

# 5. /logging — Journalisation

## 5.1 logger.js
Responsabilités :
- Enregistrer les événements importants
- Format texte simple
- Méthodes :
  - `log(eventType, data)`
  - `exportLog()`

---

## 5.2 stats.js
Responsabilités :
- Calculer les statistiques globales :
  - population
  - âge moyen
  - énergie moyenne
  - distributions des traits
  - diversité génétique
- Méthodes :
  - `update(creatures)`
  - `getStats()`

---

## 5.3 summarizer.js
Responsabilités :
- Générer un résumé final :
  - lignées dominantes
  - stratégies observées
  - événements marquants
  - évolution des traits
- Méthodes :
  - `generateSummary(log, stats)`

---

# 6. Conclusion

Ce plan de modules sert de guide pour coder proprement, sans confusion.  
Chaque fichier a une responsabilité claire.  
On pourra avancer module par module, en commençant par le moteur du monde.
