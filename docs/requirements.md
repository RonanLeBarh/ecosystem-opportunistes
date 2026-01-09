# Écosystème d’Opportunistes Minimalistes — Requirements

## 1. Objectif du projet

Créer une simulation 2D minimaliste où des créatures pixelisées (carrés colorés) évoluent dans un environnement avec ressources et obstacles.  
Chaque créature possède des traits génétiques qui influencent son comportement (chasse, cueillette, agressivité, curiosité, durée de vie, etc.), et ces traits se transmettent avec mutations légères.  
L’objectif est d’observer l’émergence de comportements complexes (stratégies, lignées dominantes, extinctions, migrations) à partir de règles simples.

La simulation doit être :
- lisible visuellement
- simple à comprendre
- modulaire et maintenable
- 100 % locale et gratuite
- compatible avec une analyse textuelle (logs + résumé)

---

## 2. Vue d’ensemble de la simulation

- Monde 2D avec grille de taille configurable (par exemple 100x100 cases).
- Chaque case peut contenir :
  - une ressource (nourriture)
  - un obstacle
  - une créature
  - ou être vide

- Temps discret en **cycles** (“ticks”).
- À chaque cycle :
  - les créatures prennent une décision
  - les ressources se régénèrent partiellement
  - l’âge des créatures augmente
  - les événements importants sont loggés

---

## 3. Les créatures

### 3.1 Représentation

- Chaque créature est représentée par un **carré coloré** sur la grille.
- La **couleur** reflète certains traits génétiques (ex : combinaison de préférences ou de lignées).
- Une créature occupe une seule case à la fois.

### 3.2 Traits génétiques

Chaque créature possède des traits numériques, transmis aux descendants avec petites mutations :

- Traits visibles :
  - `color_r` : composante rouge (0–255)
  - `color_g` : composante verte (0–255)
  - `color_b` : composante bleue (0–255)

- Traits comportementaux :
  - `gathering_preference` : préférence pour la cueillette (0–1)
  - `hunting_preference` : préférence pour la chasse (0–1)
  - `aggressiveness` : tendance à attaquer en cas de manque ou d’opportunité (0–1)
  - `curiosity` : tendance à explorer de nouvelles zones (0–1)
  - `fear` : tendance à fuir les dangers / groupes hostiles (0–1)

- Traits physiques :
  - `speed` : nombre de cases max par cycle (souvent 1, avec variations possibles)
  - `efficiency` : quantité d’énergie gagnée ou perdue lors des actions (0–1)
  - `max_age` : durée de vie maximale en cycles

- Traits dynamiques (non héréditaires) :
  - `energy` : énergie actuelle
  - `age` : âge en cycles
  - mémoire locale simple (ex : dernière zone riche, dernier danger)

### 3.3 Besoins et limites

- Une créature **meurt** si :
  - `energy <= 0`
  - ou `age >= max_age`

- Une créature peut **se reproduire** si :
  - `energy` dépasse un seuil configurable
  - et éventuellement si certaines conditions environnementales sont réunies (optionnel au début)

---

## 4. Comportement des créatures

### 4.1 Actions possibles par cycle

À chaque cycle, une créature peut :

- **Se déplacer** :
  - vers une case voisine (ou rester sur place)
  - en tenant compte des obstacles

- **Manger** :
  - une ressource présente sur sa case
  - ou une autre créature (chasse) si les conditions sont réunies

- **Fuir** :
  - s’éloigner d’une zone jugée dangereuse (prédateurs, agressivité élevée)

- **Explorer** :
  - se diriger vers une zone inconnue ou peu fréquentée, influencée par `curiosity`

- **Imiter** :
  - copier un comportement observé chez une créature proche ayant eu récemment du succès (gain d’énergie, survie)

- **Se reproduire** :
  - créer un descendant sur une case disponible proche
  - transmettre les traits avec petites variations (mutations)

### 4.2 Décision

La décision est prise via un **score interne** basé sur :

- état interne (énergie, faim, âge)
- traits (chasse, cueillette, agressivité, curiosité, peur)
- informations locales (présence de ressources, créatures proches, dangers)
- éventuellement mémoire courte

La créature choisit l’action qui maximise ce score (ou via une probabilité pondérée).

---

## 5. Environnement

### 5.1 Grille

- Grille 2D de taille configurable.
- Les cases peuvent être :
  - `empty` : vide
  - `resource` : contient de la nourriture
  - `obstacle` : bloc infranchissable
  - `creature` : occupée par une créature

### 5.2 Ressources

- Les ressources :
  - apparaissent initialement selon une distribution (aléatoire, zones riches, etc.)
  - se **régénèrent** au fil des cycles (taux configurable)
  - sont consommées par les créatures pour gagner de l’énergie

- Paramètres :
  - taux de régénération
  - densité initiale
  - valeur énergétique par ressource

### 5.3 Obstacles

- Certaines cases sont des obstacles :
  - non traversables
  - influencent les chemins possibles
  - créent des “zones” et des goulots d’étranglement

---

## 6. Reproduction et mutations

### 6.1 Reproduction

- Quand une créature atteint un certain seuil d’énergie :
  - elle peut créer un descendant
  - l’énergie est partagée ou réduite (à définir précisément)
  - le descendant apparaît sur une case voisine libre (si possible)

### 6.2 Mutations

- À chaque reproduction :
  - certains traits peuvent varier légèrement (petit + ou − aléatoire)
  - éventuellement avec une probabilité de mutation par trait

- Effet attendu :
  - apparition de nouvelles lignées
  - diversification des stratégies
  - émergence de “familles” visuellement identifiables par leur couleur

---

## 7. Agressivité contextuelle

- L’agressivité d’une créature dépend :
  - de son trait génétique `aggressiveness`
  - de son niveau d’énergie (plus elle est en manque, plus elle peut devenir dangereuse)
  - de la densité de créatures autour (compétition)

- Comportements potentiels :
  - chasse d’autres créatures faibles
  - attaque opportuniste si la proie est isolée
  - fuite si peur > agressivité perçue

---

## 8. Boucle de simulation

À chaque cycle :

1. Mettre à jour les ressources (régénération).
2. Pour chaque créature (dans un ordre défini ou aléatoire) :
   - augmenter l’âge
   - diminuer l’énergie de base (coût de maintenance)
   - décider d’une action
   - exécuter l’action (déplacement, manger, chasser, fuir, reproduire, etc.)
   - mettre à jour l’énergie
   - vérifier la mort éventuelle

3. Mettre à jour les statistiques globales.
4. Enregistrer les événements importants dans le log.
5. Rafraîchir l’affichage visuel.

---

## 9. Affichage / interface

- Affichage 2D minimaliste (type grille) :
  - chaque case = pixel ou petit carré
  - créatures = carrés colorés
  - obstacles = couleur fixe (ex : gris)
  - ressources = couleur spécifique (ex : vert)

- Possibilités d’affichage :
  - vitesse de simulation ajustable
  - pause / reprise
  - zoom (optionnel à définir plus tard)
  - survol / clic pour voir les traits d’une créature (optionnel plus tard)

---

## 10. Système de logs et d’histoire

### 10.1 Log des événements

Le système doit enregistrer dans un fichier texte ou en mémoire :

- naissance de créatures
- mort de créatures
- mutations significatives (ex : changement important d’un trait)
- apparition de nouvelles “lignées” (familles de couleur/traits proches)
- extinction de lignées
- pénuries de nourriture
- pics d’agressivité
- migrations (déplacements de groupes vers une zone)
- changements brusques dans la population (explosion ou effondrement)

Chaque entrée comprend :
- cycle
- type d’événement
- informations contextuelles (traits moyens, position, etc.)

### 10.2 Statistiques globales

En parallèle, calcul de statistiques globales sur la population :

- taille de la population
- âge moyen
- énergie moyenne
- distributions des traits (moyenne, min, max)
- diversité génétique (à définir de manière simple)
- répartition des “préférences” (chasse vs cueillette)

### 10.3 Résumé final

À la fin d’une simulation (ou sur demande), génération d’un résumé textuel :

- durée de la simulation (en cycles)
- évolution de la population (début vs fin)
- traits dominants apparus
- stratégies majoritaires (chasse, cueillette, mixte)
- événements marquants (familles dominantes, extinctions, pénuries)
- commentaire textuel prêt à être donné à une IA pour analyse ou narration

---

## 11. Objectifs non fonctionnels

- Code modulaire, lisible, bien commenté.
- Architecture suffisamment claire pour être étendue par la suite.
- Pas de dépendances inutiles.
- Capable de tourner sur une machine standard sans GPU particulier.
- Temps réel raisonnable pour une grille moyenne (ex : 100x100, quelques centaines de créatures).

---

## 12. Scope initial vs évolutions futures

### Scope initial (version 0.1)

- Grille 2D avec ressources et obstacles.
- Créatures avec traits génétiques de base.
- Décision simple par score interne.
- Reproduction + mutations légères.
- Mort par âge ou énergie.
- Affichage minimaliste.
- Log des événements principaux.
- Résumé final simple.

### Évolutions possibles (plus tard)

- Mémoire plus avancée.
- Stratégies de groupe.
- Événements environnementaux (catastrophes, saisons).
- Interface plus riche.
- Contrôles interactifs plus poussés.
- Export et analyse automatique via IA externe.
