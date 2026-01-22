# 🌍 Écosystème Opportunistes

Une simulation d'écosystème intelligent où des créatures artificielles évoluent, se reproduisent et s'adaptent dans un environnement dynamique.

## 🎯 Concept

Des créatures autonomes avec des gènes et des traits uniques interagissent dans un monde limité :
- 🦁 **Carnivores** : Chassent pour survivre
- 🐰 **Herbivores** : Collectent des ressources  
- 🦊 **Omnivores** : S'adaptent aux deux stratégies

## 🧬 Caractéristiques

### Génétique
- **Traits héritables** : vitesse, vision, métabolisme, fertilité
- **Couleurs uniques** : identification visuelle des créatures
- **Mutations** : évolution naturelle au fil des générations
- **Reproduction** : asexuée (actuelle) → sexuée (en développement)

### Comportements
- **IA décisionnelle** : chasse, fuite, exploration
- **Mémoire** : zones riches, dangers, succès
- **Énergie** : survie et reproduction
- **Mort** : par faim, âge ou attaque

### Statistiques en temps réel
- 📊 Population par type
- 💀 Causes de mort détaillées  
- 🧬 Moyennes génétiques
- 🎨 Couleurs dominantes

## 🏗️ Architecture

```
src/
├── engine/          # Moteur du monde
├── creatures/       # Créatures et reproduction
├── simulation/      # Boucle principale et stats
├── ui/             # Interface et rendu
└── logging/        # Journalisation
```

## 🚀 Démarrage rapide

### Prérequis
- Node.js 16+
- npm ou yarn

### Installation
```bash
git clone <repository>
cd ecosystem-opportunistes
npm install
```

### Lancer la simulation
```bash
npm start
```

### Tests
```bash
# Lancer tous les tests
npm test

# Voir la couverture de code
npm run test:coverage

# Interface des tests
npm run test:ui
```

## 📊 État actuel

### ✅ Fonctionnalités implémentées
- [x] Moteur du monde complet
- [x] Créatures avec traits génétiques
- [x] Reproduction asexuée avec mutations
- [x] IA comportementale de base
- [x] Statistiques détaillées
- [x] Interface utilisateur
- [x] **100% des tests unitaires passants**

### 🚧 En développement
- [ ] Reproduction sexuée (croisement 50/50)
- [ ] Comportements avancés (meutes, territoires)
- [ ] Écosystèmes complexes (prédateurs/proies)
- [ ] Interface graphique améliorée

### 📈 Couverture de code
- **Global** : 57.49% des lignes
- **Cœur métier** : 85%+ (traits, reproduction, monde)
- **Tests** : 40/100% passants

## 🎮 Utilisation

1. **Lancer** la simulation avec `npm start`
2. **Observer** les créatures évoluer dans le monde
3. **Analyser** les statistiques en temps réel
4. **Expérimenter** avec les paramètres dans `src/simulation/config.js`

## 🔧 Configuration

Les paramètres principaux sont dans `src/simulation/config.js` :
- Taille du monde
- Population initiale
- Taux de mutation
- Coûts énergétiques
- Seuils de reproduction

## 🧪 Tests

Le projet possède une suite de tests robuste :
- **40 tests unitaires** (100% passants)
- **Tests d'intégration** (à venir)
- **Couverture de code** automatique

## 🤝 Contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Committer les changements (`git commit -m 'Add amazing feature'`)
4. Pusher (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour les détails

## 🙏 Auteur

Créé avec passion pour l'exploration de la vie artificielle et des écosystèmes complexes.

---

**🌟 Star le projet si tu trouves cette simulation intéressante !**