# PLAN.md — Architecture & Roadmap du Simulateur d’Écosystème

## 🧭 Objectif général
Créer un simulateur d’écosystème minimaliste mais évolutif, où des créatures pixelisées interagissent dans un monde 2D.  
Chaque créature possède des traits génétiques (couleur, vitesse, vision, métabolisme, fertilité, carnivorisme, etc.) qui mutent légèrement à chaque génération.

L’objectif est d’observer l’émergence de comportements naturels :
- lignées dominantes
- clusters de couleurs
- stratégies de survie
- cycles proies/prédateurs
- extinctions et expansions

Le tout avec un HUD clair, un logger modulaire, et une architecture propre.

---

# 🧩 1. Modules terminés (100 % fonctionnels)

## ✔ 1.1 Logger modulaire
- Filtrage par type de log
- Filtrage par creatureId
- Labels français
- Avertissement pour type inconnu
- Logs propres pour :
  - déplacements
  - décisions
  - vision
  - reproduction
  - mort (énergie, âge, prédation)
  - population
  - cycle

## ✔ 1.2 Moteur du monde
- Grille 2D
- Cellules avec ressource / obstacle / créature
- Déplacements sécurisés via `world.moveCreature`
- Gestion des limites
- Nettoyage des morts

## ✔ 1.3 Créatures
- Traits génétiques complets
- Mutations contrôlées
- Vitesse mutante (trait)
- Couleur mutante (avec tolérance pour familles)
- Carnivorisme fonctionnel
- Mort propre
- Reproduction évolutive

## ✔ 1.4 Behavior simple
- Priorité ressource
- Priorité chasse si carnivore
- Vision fonctionnelle
- Déplacements cohérents

## ✔ 1.5 Ressources
- Génération initiale
- Régénération dynamique
- Consommation

## ✔ 1.6 HUD complet
- Population
- Âge moyen
- Morts énergie / âge
- Naissances
- Cycle
- Ressources restantes
- Carnivorisme (moyenne + répartition)
- Moyennes génétiques
- Top 3 gènes dominants
- Top 3 couleurs (avec tolérance)
- Couleur moyenne (carré RGB)

## ✔ 1.7 Renderer
- Affichage grille
- Créatures colorées
- Ressources
- Obstacles

---

# 🧩 2. Modules en cours (partiellement implémentés)

## 🔄 2.1 Behavior évolutif
- Chasse fonctionnelle
- Recherche de ressource OK
- Déplacements OK
- Manque encore :
  - fuite
  - agressivité
  - curiosité
  - imitation
  - score d’action

## 🔄 2.2 Génétique avancée
- Mutations OK
- Bornes OK
- Manque encore :
  - mutation comportementale pondérée
  - interactions entre traits

## 🔄 2.3 Diversité visuelle
- Top 3 couleurs OK
- Tolérance OK
- Manque encore :
  - suivi des familles dans le temps
  - mini-map des clusters

---

# 🧩 3. Modules à venir (prochaines étapes)

## ⏳ 3.1 Behavior avancé
- Système de score interne
- Pondération par faim / danger / opportunité
- Fuite des prédateurs
- Agressivité contextuelle
- Exploration intelligente
- Mémoire locale (dernière ressource, dernier danger)

## ⏳ 3.2 Événements dynamiques
- Pénuries
- Zones riches
- Migrations
- Extinctions de lignées
- Explosion de population

## ⏳ 3.3 HUD avancé
- Graphiques d’évolution (population, carnivorisme, vitesse)
- Mini-map
- Sélection d’une créature (fiche détaillée)

## ⏳ 3.4 Logging avancé
- Export JSON
- Résumé automatique
- Détection d’événements
- Analyse narrative

---

# 🧩 4. Alignement avec la vision globale

Le projet est actuellement en **version 0.4** :

- Le moteur est stable  
- Les créatures évoluent réellement  
- Les lignées apparaissent  
- Le HUD donne une vision claire  
- Le logger est professionnel  
- L’architecture est propre et modulaire  

Les prochaines étapes (behavior avancé + mémoire + agressivité + événements) s’intègrent parfaitement dans la structure actuelle.

Aucune dérive, aucune incohérence :  
👉 le projet est parfaitement aligné avec la vision initiale.

---

# 🧩 5. Roadmap synthétique

| Version | Contenu |
|--------|---------|
| **0.4 (actuel)** | Moteur complet, génétique, HUD, prédation, stats |
| **0.5** | Behavior avancé (fuite, agressivité, curiosité) |
| **0.6** | Mémoire locale + imitation |
| **0.7** | Événements dynamiques |
| **0.8** | HUD graphique + mini-map |
| **0.9** | Export / résumé / analyse |
| **1.0** | Version stable, écosystème complet |

---

# 🧩 6. Conclusion

Le projet est propre, stable, cohérent et prêt pour les prochaines étapes.  
Ce document sert désormais de référence officielle pour la suite du développement.

