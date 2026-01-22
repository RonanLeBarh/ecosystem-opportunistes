# Plan détaillé des modules — Simulateur d’Écosystème Évolutif 

Ce document décrit précisément le rôle de chaque module du projet.  
Il sert de guide pour maintenir une architecture claire, cohérente et extensible.

---

# 1. /engine — Moteur du monde

## 1.1 world.js
Responsabilités :
- Initialiser la grille 2D
- Fournir les méthodes :
  - `getCell(x, y)`
  - `isInside(x, y)`
  - `moveCreature(fromX, fromY, toX, toY)`
  - `addResource(x, y)`
  - `removeResource(x, y)`
- Gérer les collisions et les limites
- Assurer la cohérence du monde (pas de doublons, pas de fantômes)

---

## 1.2 cell.js
Responsabilités :
- Représenter une case du monde
- Contient :
  - `resource` (bool)
  - `obstacle` (bool)
  - `creature` (référence)
- Méthodes utilitaires :
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
- Influence directe sur la dynamique de population

---

## 1.4 obstacles.js
Responsabilités :
- Générer des obstacles fixes
- Créer des murs, couloirs ou motifs
- Influencer les déplacements et stratégies

---

# 2. /creatures — Moteur des créatures

## 2.1 creature.js
Responsabilités :
- Représenter une créature vivante
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
- Gestion propre des déplacements via `world.moveCreature`

---

## 2.2 traits.js
Responsabilités :
- Générer les traits initiaux
- Gérer les mutations des traits visibles et physiques
- Hériter des traits du parent
- Clamp automatique des valeurs (ex : speed entre 1 et 5)
- Mutation couleur contrôlée par `COLOR_MUTATION_AMOUNT`

---

## 2.3 behavior.js
Responsabilités :
- Décider l’action optimale selon :
  - ressource sur la case
  - carnivorisme
  - vision
  - opportunités proches
- Recherche de proies
- Recherche de ressources
- Déplacements aléatoires
- Base solide pour un futur comportement avancé

---

## 2.4 reproduction.js
Responsabilités :
- Vérifier si deux créatures peuvent se reproduire
- Vérifier la compatibilité et la proximité des partenaires
- Créer un descendant par croisement génétique
- Appliquer les mutations sur les gènes hérités
- Placer le descendant dans une case libre
- Gérer le coût énergétique pour les deux parents
- Croisement : 50% gènes parent1 + 50% gènes parent2 + mutations
- Mutation contrôlée par `mutationRate` des deux parents

---

# 3. /simulation — Boucle principale

## 3.1 loop.js
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

---

## 3.2 config.js
Responsabilités :
- Stocker tous les paramètres globaux :
  - taille du monde
  - densité des ressources
  - taux de mutation
  - bornes génétiques
  - reproduction
  - vitesse de simulation
  - tolérance des familles de couleurs
- Sert de référence unique pour toute la simulation

---

# 4. /ui — Interface utilisateur

## 4.1 renderer.js
Responsabilités :
- Dessiner la grille
- Dessiner les créatures (carrés colorés)
- Dessiner les ressources
- Dessiner les obstacles
- Gérer la taille du canvas

---

## 4.2 hud.js
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
  - couleur moyenne
- Mise à jour automatique à chaque cycle

---

# 5. /logging — Journalisation

## 5.1 logger.js
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

# 6. Modules futurs (préparés par l’architecture)

## 6.1 Behavior avancé
- Score d’action
- Fuite
- Agressivité
- Curiosité
- Imitation
- Mémoire locale

## 6.2 Événements dynamiques
- pénuries
- zones riches
- migrations
- extinctions de lignées

## 6.3 HUD avancé
- graphiques d’évolution
- mini-map
- sélection de créature

## 6.4 Export & analyse
- export JSON
- résumé automatique
- analyse narrative

---

# 7. Conclusion

Ce document décrit précisément la structure du projet et les responsabilités de chaque module.  
Il est synchronisé avec l’état actuel du code et sert de référence pour les futures évolutions.
