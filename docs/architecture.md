# Architecture Technique — Simulateur d’Écosystème Évolutif

## 1. Vue d’ensemble

Le projet est structuré en modules indépendants, lisibles et extensibles.  
Chaque fichier a une responsabilité claire, ce qui permet d’ajouter de nouvelles fonctionnalités sans casser l’existant.

L’architecture repose sur 5 grands blocs :

1. **Engine** — moteur du monde (grille, cellules, ressources, obstacles)
2. **Creatures** — moteur des créatures (traits, comportement, reproduction)
3. **Simulation** — boucle principale, stats, logs
4. **UI** — affichage 2D + HUD
5. **Logging** — journalisation et statistiques globales

Cette architecture est **cohérente avec le code actuel** et **compatible avec les futures évolutions**.

---

# 2. Structure des dossiers

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

/simulation
loop.js
config.js

/ui
renderer.js
hud.js

/logging
logger.js

main.js
style.css

---

# 3. Description détaillée des modules

## 3.1 /engine — Moteur du monde

### **world.js**
Responsabilités :
- Initialise la grille 2D
- Fournit les méthodes :
  - `getCell(x, y)`
  - `isInside(x, y)`
  - `moveCreature(fromX, fromY, toX, toY)`
  - `addResource(x, y)`
  - `removeResource(x, y)`
- Gère les collisions et les limites
- Sert de base à toutes les interactions

### **cell.js**
Responsabilités :
- Représente une case du monde
- Contient :
  - `resource` (bool)
  - `obstacle` (bool)
  - `creature` (référence)
- Méthodes utilitaires :
  - `isEmpty()`
  - `hasResource()`
  - `hasCreature()`

### **resources.js**
Responsabilités :
- Génère les ressources initiales
- Régénère les ressources à chaque cycle
- Paramètres :
  - densité initiale
  - taux de régénération
  - valeur énergétique

### **obstacles.js**
Responsabilités :
- Génère des obstacles fixes
- Peut créer des murs ou motifs
- Influence les déplacements et stratégies

---

## 3.2 /creatures — Moteur des créatures

### **creature.js**
Responsabilités :
- Représente une créature vivante
- Contient :
  - position (x, y)
  - traits génétiques (couleur, speed, max_age…)
  - gènes (vision, carnivore, mutationRate…)
  - énergie, âge
- Méthodes :
  - `update(world)`
  - `decide(world)`
  - `executeAction(action)`
  - `moveTowards(target)`
  - `moveRandom()`
  - `eat()`
  - `die()`

### **traits.js**
Responsabilités :
- Générer les traits initiaux
- Gérer les mutations des traits visibles et physiques
- Hériter des traits du parent
- Clamp automatique des valeurs (ex : speed entre 1 et 5)

### **behavior.js**
Responsabilités :
- Décider l’action optimale :
  - manger si ressource
  - chasser si carnivore
  - chercher ressource
  - déplacement aléatoire
- Vision locale
- Recherche de proies
- Recherche de ressources

### **reproduction.js**
Responsabilités :
- Vérifier si une créature peut se reproduire
- Créer un descendant
- Appliquer les mutations génétiques
- Placer le descendant dans une case libre
- Gérer le coût énergétique

---

## 3.3 /simulation — Boucle principale

### **loop.js**
Responsabilités :
- Boucle de simulation :
  - mise à jour des ressources
  - mise à jour des créatures
  - mort / naissance
  - nettoyage des cellules
  - logs
  - statistiques globales
  - mise à jour du HUD
- Calcul des statistiques :
  - âge moyen
  - carnivorisme
  - moyennes génétiques
  - top 3 gènes
  - top 3 couleurs (avec tolérance)
  - ressources restantes

### **config.js**
Responsabilités :
- Paramètres globaux :
  - taille du monde
  - densité des ressources
  - taux de mutation
  - bornes génétiques
  - vitesse de simulation
  - reproduction
  - tolérance des familles de couleurs

---

## 3.4 /ui — Interface utilisateur

### **renderer.js**
Responsabilités :
- Dessiner la grille
- Dessiner les créatures (carrés colorés)
- Dessiner les ressources
- Dessiner les obstacles
- Gérer la taille du canvas

### **hud.js**
Responsabilités :
- Afficher les statistiques globales :
  - population
  - âge moyen
  - morts énergie / âge
  - naissances
  - cycle
  - ressources restantes
  - carnivorisme
  - moyennes génétiques
  - top 3 gènes
  - top 3 couleurs (avec carrés RGB)
- Mise à jour automatique à chaque cycle

---

## 3.5 /logging — Journalisation

### **logger.js**
Responsabilités :
- Enregistrer les événements importants :
  - déplacements
  - décisions
  - vision
  - reproduction
  - mort (énergie, âge, prédation)
  - population
  - cycle
- Filtrage par type de log
- Filtrage par creatureId
- Labels français
- Avertissement pour type inconnu

---

# 4. Flux de données

1. **Simulation.step()** :
   - met à jour les ressources
   - met à jour chaque créature
   - nettoie les morts
   - calcule les stats
   - met à jour le HUD

2. **Renderer.draw()** :
   - dessine le monde à chaque frame

3. **HUD.update()** :
   - affiche les stats en temps réel

4. **Logger.log()** :
   - enregistre les événements

---

# 5. Points d’extension prévus

L’architecture actuelle permet d’ajouter facilement :

- comportement avancé (fuite, agressivité, curiosité)
- mémoire locale
- événements dynamiques
- mini-map
- graphiques HUD
- export JSON
- résumé automatique
- sélection de créature

Aucune refonte n’est nécessaire :  
👉 l’architecture est déjà prête pour la suite.

---

# 6. Conclusion

Cette architecture est :

- simple  
- modulaire  
- maintenable  
- évolutive  
- parfaitement alignée avec le code actuel  
- prête pour les futures fonctionnalités  

Elle constitue une base solide pour un simulateur d’écosystème évolutif complet.
