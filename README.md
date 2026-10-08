# Dashboard Réclamations — Tunisie Télécom

Application web de gestion et de visualisation des réclamations clients, développée dans le cadre d'un stage chez Tunisie Télécom. Le dashboard permet de centraliser, suivre et analyser les réclamations clients à travers une interface graphique interactive connectée à une API REST et une base de données PostgreSQL.

## Fonctionnalités

### Gestion des réclamations
- Affichage des réclamations sous forme de tableau (ID, client, type, description, statut, priorité, date)
- Ajout, modification et suppression d'une réclamation
- Filtres par statut, type, priorité et plage de dates
- Recherche textuelle dans les descriptions

### Statistiques et visualisation
- Cartes de synthèse : total, réclamations ouvertes, résolues, urgentes
- Répartition des réclamations par statut (graphique en anneau)
- Répartition par type de réclamation (graphique en barres)
- Répartition par priorité (graphique en barres horizontales)
- Évolution mensuelle des réclamations (courbe)

### Export
- Export des réclamations au format CSV

### Authentification
- Connexion administrateur sécurisée par jeton JWT
- Toutes les routes de l'API sont protégées par un middleware d'authentification
- Mot de passe stocké sous forme hachée (bcrypt), jamais en clair

### Suggestion assistée par IA
- Analyse automatique de la description d'une réclamation pour suggérer son type et sa priorité
- Approche par mots-clés/règles (sans dépendance à une API externe)
- La suggestion reste toujours modifiable manuellement par l'utilisateur avant validation

## Technologies utilisées

**Backend**
- Node.js / Express
- PostgreSQL (via `pg`)
- JWT (`jsonwebtoken`) et hachage de mot de passe (`bcryptjs`)
- `dotenv` pour la configuration des variables d'environnement

**Frontend**
- HTML / CSS / JavaScript (vanilla, sans framework)
- Chart.js pour les graphiques
- `fetch()` pour la communication avec l'API REST

**Base de données**
- PostgreSQL, 6 tables reliées : `regions`, `agences`, `techniciens`, `clients`, `reclamations`, `interventions`

## Architecture du projet

```
Dashboard tt/
├── backend/
│   ├── controllers/
│   │   ├── reclamationsController.js
│   │   ├── statsController.js
│   │   ├── authController.js
│   │   └── iaController.js
│   ├── routes/
│   │   ├── reclamations.js
│   │   ├── stats.js
│   │   ├── auth.js
│   │   └── ia.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── db.js
│   ├── server.js
│   └── .env
└── frontend/
    ├── index.html
    ├── login.html
    ├── css/
    │   └── style.css
    └── js/
        ├── app.js
        └── login.js
```

## Installation et mise en route

### Prérequis
- Node.js installé
- PostgreSQL installé, avec une base de données créée (ex. `tt_reclamations`)

### 1. Configuration de la base de données
Créer les tables et insérer les données de test via pgAdmin ou `psql`, à partir des scripts SQL du projet.

### 2. Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` à la racine de `backend/` avec le contenu suivant (à adapter) :

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=tt_reclamations
DB_PASSWORD=votre_mot_de_passe
DB_PORT=5432
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=hash_bcrypt_du_mot_de_passe
JWT_SECRET=une_chaine_secrete_longue_et_aleatoire
```

Démarrer le serveur :

```bash
node server.js
```

Le serveur démarre sur `http://localhost:3000`.

### 3. Frontend

Ouvrir `frontend/login.html` dans le navigateur (idéalement via une extension de type "Live Server" pour éviter les soucis de chemins relatifs).

## Principales routes de l'API

| Méthode | Route | Description | Protégée |
|---|---|---|---|
| POST | `/api/auth/login` | Connexion administrateur | Non |
| GET | `/api/reclamations` | Liste des réclamations (filtres via query params) | Oui |
| GET | `/api/reclamations/export` | Export CSV | Oui |
| POST | `/api/reclamations` | Créer une réclamation | Oui |
| PUT | `/api/reclamations/:id` | Modifier une réclamation | Oui |
| DELETE | `/api/reclamations/:id` | Supprimer une réclamation | Oui |
| GET | `/api/stats/par-region` | Statistiques par région | Oui |
| GET | `/api/stats/par-statut` | Statistiques par statut | Oui |
| GET | `/api/stats/par-type` | Statistiques par type | Oui |
| GET | `/api/stats/par-priorite` | Statistiques par priorité | Oui |
| GET | `/api/stats/temps-moyen` | Temps moyen de résolution par agence | Oui |
| GET | `/api/stats/taux-reussite` | Taux de réussite par technicien | Oui |
| GET | `/api/stats/evolution` | Évolution mensuelle des réclamations | Oui |
| POST | `/api/ia/analyser` | Suggestion de type/priorité à partir d'une description | Oui |

## Sécurité

- Toutes les requêtes SQL utilisent des requêtes paramétrées (protection contre les injections SQL)
- Les mots de passe ne sont jamais stockés en clair
- Les informations sensibles (identifiants base de données, secret JWT) sont externalisées dans un fichier `.env`, exclu du contrôle de version
- Les jetons JWT ont une durée de validité limitée (8 heures)

## Auteur

Mnassri Rim— Stage, Tunisie Télécom
Élève ingénieure en informatique appliquée, École Nationale d'Ingénieurs de Sousse (ENISo)