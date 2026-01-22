# Requirements — Simulateur d’Écosystème Évolutif 

## 1. Objectif du projet

Créer un simulateur d’écosystème 2D où des créatures pixelisées évoluent dans un environnement dynamique.  
Chaque créature possède des traits génétiques (couleur, vitesse, vision, métabolisme, fertilité, carnivorisme…) qui mutent légèrement à chaque génération.

Le but est d’observer l’émergence de comportements naturels :
- lignées dominantes
- clusters de couleurs
- stratégies de survie
- cycles proies/prédateurs
- extinctions et expansions

Le simulateur doit être :
- lisible visuellement
- modulaire
- performant
- évolutif
- entièrement local

---

# 2. Vue d’ensemble

Le monde est une grille 2D.  
Chaque case peut contenir :
- une ressource
- un obstacle
- une créature
- ou être vide

À chaque cycle :
1. Les ressources se régénèrent  
2. Les créatures prennent une décision  
3. Elles se déplacent, mangent, chassent ou se reproduisent  
4. Elles vieillissent et peuvent mourir  
5. Les statistiques globales sont mises à jour  
6. Le HUD affiche l’état du monde  

---

# 3. Les créatures

## 3.1 Représentation
- Un carré coloré sur la grille
- La couleur reflète la lignée (avec tolérance pour regrouper les familles proches)
- Une créature occupe une seule case

## 3.2 Traits génétiques (hérités + mutation)
- `color_r`, `color_g`, `color_b` (0–255)
- `speed` (1–5)
- `max_age` (200–600)
- `gathering_preference`
- `hunting_preference`
- `aggressiveness`
- `curiosity`
- `fear`

## 3.3 Gènes (hérités + mutation)
- `vision` (1–10)
- `metabolism` (0.2–3)
- `fertility` (0.1–1)
- `mutationRate` (0.05–0.3)
- `carnivore` (0–1)

## 3.4 Besoins et limites
Une créature meurt si :
- son énergie tombe à 0  
- son âge dépasse `max_age`  

Une créature peut se reproduire si :
- son énergie dépasse un seuil configurable  
- une case libre est disponible autour d’elle  
- un partenaire compatible est à proximité (reproduction sexuée)

La reproduction nécessite **deux créatures** qui vont :
- croiser leurs gènes (50% parent1 + 50% parent2)
- appliquer des mutations sur les gènes résultants
- créer un descendant dans une case libre adjacente  

---

# 4. Comportement des créatures

## 4.1 Actions possibles
- se déplacer (aléatoire ou dirigé)
- manger une ressource
- chasser une autre créature
- se reproduire
- rester sur place (si bloquée)

## 4.2 Décision
Le comportement actuel suit cet ordre :
1. Si ressource sur la case → manger  
2. Si carnivore → chercher une proie  
3. Chercher une ressource dans le champ de vision  
4. Sinon → déplacement aléatoire  

## 4.3 Vision
- Vision carrée autour de la créature
- Recherche de la ressource la plus proche
- Recherche de la proie la plus proche

---

# 5. Environnement

## 5.1 Grille
- Taille configurable (100×100 par défaut)
- Chaque case est un objet `Cell`

## 5.2 Ressources
- Génération initiale selon densité
- Régénération à chaque cycle
- Valeur énergétique configurable

## 5.3 Obstacles
- Cases infranchissables
- Peuvent former des murs ou motifs

---

# 6. Reproduction et mutations

## 6.1 Reproduction
- Seuil d’énergie configurable
- Coût énergétique configurable
- Descendant placé sur une case libre adjacente
- Traits hérités + mutation légère

## 6.2 Mutations
- Mutation des traits physiques (speed, max_age…)
- Mutation des couleurs
- Mutation des gènes (vision, carnivore, metabolism…)
- Mutation contrôlée par `mutationRate`

---

# 7. HUD et interface

## 7.1 HUD global
Affiche :
- population
- âge moyen
- morts énergie / âge
- naissances (initiales / reproduction)
- cycle
- ressources restantes
- carnivorisme (moyenne + répartition)
- moyennes génétiques
- top 3 gènes dominants
- top 3 couleurs (avec tolérance)
- couleur moyenne (carré RGB)

## 7.2 Contrôles
- Pause / reprise
- Reset
- Vitesse de simulation (slider)

---

# 8. Logging

## 8.1 Événements loggés
- déplacements
- décisions
- vision
- reproduction
- mort (énergie, âge, prédation)
- population
- cycle

## 8.2 Fonctionnalités
- filtrage par type
- filtrage par creatureId
- labels français
- avertissement pour type inconnu

---

# 9. Statistiques globales

Calculées à chaque cycle :
- âge moyen
- carnivorisme moyen
- répartition herbivore / omnivore / carnivore
- moyennes génétiques
- top 3 gènes dominants
- top 3 couleurs (avec tolérance)
- ressources restantes

---

# 10. Objectifs non fonctionnels

- Code modulaire et lisible
- Architecture extensible
- Performance correcte pour 100×100 cases
- Simulation fluide en temps réel
- Aucun framework externe

---

# 11. Roadmap (synchronisée avec PLAN.md)

## Version actuelle : **0.4**
- Moteur complet
- Génétique évolutive
- HUD avancé
- Prédation
- Stats globales
- Top couleurs et gènes

## Prochaines versions
- 0.5 : Behavior avancé (fuite, agressivité, curiosité)
- 0.6 : Mémoire locale + imitation
- 0.7 : Événements dynamiques
- 0.8 : HUD graphique + mini-map
- 0.9 : Export / résumé / analyse
- 1.0 : Version stable

---

# 12. Conclusion

Ce document décrit précisément les besoins fonctionnels et techniques du simulateur.  
Il est aligné avec l’état actuel du projet et sert de référence pour les futures évolutions.
