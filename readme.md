# AI4Nieup - Plateforme d'Apprentissage en IA

## Présentation du Projet

AI4Nieup est une plateforme d'apprentissage adaptative et personnalisée pour maîtriser l'intelligence artificielle, de la théorie à la pratique. Ce projet fait partie de l'initiative AI Skilling du DiCentre de l'UCAD (Université Cheikh Anta Diop de Dakar).

### Fonctionnalités Principales

1. **Évaluation Personnalisée**

   - Évaluation initiale des compétences en mathématiques, programmation et domaines spécifiques de l'IA
   - Recommandations personnalisées basées sur les résultats

2. **Parcours d'Apprentissage Adaptatifs**

   - Génération de parcours personnalisés selon le profil de l'apprenant
   - Adaptation dynamique du contenu en fonction de la progression
   - Modules structurés avec ressources variées (articles, vidéos, cours, etc.)

3. **Système de Gamification**

   - Points d'expérience (XP) et niveaux
   - Achievements et badges
   - Classement des apprenants

4. **Collaboration et Communauté**

   - Groupes d'étude
   - Forum de discussion
   - Partage de ressources
   - Revue par les pairs

5. **Suivi de Progression**

   - Tableau de bord analytique
   - Visualisation des performances
   - Prédictions de performance par IA

6. **Intégration d'APIs Externes**

   - IA Générative
   - Explorateur de datasets
   - Actualités IA
   - Données météo (exemple d'API)

7. **Administration**
   - Gestion des objectifs d'apprentissage
   - Gestion des utilisateurs
   - Tableau de bord administratif

## Prérequis

- Node.js >= 18.0.0
- MongoDB >= 6.0.0
- npm ou yarn

## Installation

1. Cloner le projet et installer les dépendances frontend :

```bash
npm install
```

2. Installer les dépendances backend :

```bash
cd server && npm install
```

## Configuration

1. Créer un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:5000
MONGODB_URI=mongodb://localhost:27017/ucad_ia
JWT_SECRET=ucad_ia_super_secret_key_2025
PORT=5000
```

## Peuplement de la base de données

1. Assurez-vous que MongoDB est en cours d'exécution sur votre machine

2. Exécutez le script de peuplement :

```bash
cd server
node src/scripts/populateInitialData.js
```

Ce script va créer :

- Des utilisateurs de test (student@ucad.edu.sn / Student123!, admin@ucad.edu.sn / Admin123!)
- Des objectifs d'apprentissage
- Des évaluations
- Des quiz
- Un parcours exemple

3. Pour ajouter des données de gamification :

```bash
cd server
node src/scripts/populateAchievements.js
```

4. Pour ajouter des fonctionnalités collaboratives :

```bash
cd server
node src/scripts/populateCollaborativeData.js
```

## Lancement des serveurs

1. Démarrer le serveur backend (depuis le dossier racine) :

```bash
npm run server
```

2. Dans un nouveau terminal, démarrer le serveur frontend :

```bash
npm run dev
```

## Accès à l'application

- Frontend : http://localhost:5173
- Backend API : http://localhost:5000

## Comptes de test

1. Compte étudiant :

   - Email : student@ucad.edu.sn
   - Mot de passe : Student123!

2. Compte administrateur :
   - Email : admin@ucad.edu.sn
   - Mot de passe : Admin123!

## Structure du projet

```
.
├── src/                  # Code source frontend (React)
│   ├── components/       # Composants React réutilisables
│   ├── contexts/         # Contextes React (Auth, Gamification)
│   ├── hooks/            # Hooks personnalisés
│   ├── pages/            # Pages de l'application
│   ├── services/         # Services pour les appels API
│   ├── types/            # Définitions TypeScript
│   └── utils/            # Fonctions utilitaires
├── server/               # Code source backend (Node.js)
│   ├── src/
│   │   ├── config/       # Configuration (DB, JWT)
│   │   ├── data/         # Données statiques
│   │   ├── middleware/   # Middleware Express
│   │   ├── models/       # Modèles MongoDB
│   │   ├── routes/       # Routes API
│   │   ├── scripts/      # Scripts utilitaires
│   │   ├── services/     # Services métier
│   │   └── utils/        # Utilitaires
│   └── index.js          # Point d'entrée du serveur
└── package.json          # Configuration du projet
```

## Fonctionnalités Détaillées

### Évaluation Personnalisée

L'évaluation initiale permet de déterminer le niveau de l'apprenant dans différents domaines (mathématiques, programmation, etc.) et de recommander des parcours adaptés à son profil.

### Parcours d'Apprentissage

Chaque parcours est composé de modules, eux-mêmes contenant des ressources variées (articles, vidéos, etc.) et un quiz de validation. La progression est suivie et le parcours s'adapte en fonction des performances.

### Gamification

Le système de gamification encourage l'engagement des apprenants en récompensant diverses actions (complétion de ressources, quiz, etc.) avec des points d'expérience et des achievements.

### Collaboration

Les fonctionnalités collaboratives permettent aux apprenants d'interagir, de partager des ressources et de s'entraider, créant ainsi une communauté d'apprentissage.

### Intelligence Artificielle

L'IA est utilisée pour générer des recommandations personnalisées, prédire les performances et adapter le contenu en fonction du profil et de la progression de l'apprenant.

## Déploiement

Le projet peut être déployé sur diverses plateformes :

- Frontend : Netlify, Vercel
- Backend : Render, Railway, Heroku

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à soumettre des pull requests ou à ouvrir des issues pour améliorer le projet.

## Licence

Ce projet est sous licence MIT.
