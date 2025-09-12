# 🚀 Démarrage Rapide avec Docker

## Installation en 3 commandes

```bash
git clone https://github.com/elbachir67/usain4nieup.git
cd usain4nieup
./quickstart.sh
```

C'est tout ! L'application sera accessible sur http://localhost 🎉

## Prérequis

- **Docker Desktop** installé ([Télécharger ici](https://docker.com))
- 8 GB de RAM disponible
- 10 GB d'espace disque

## Options d'installation

### Option 1 : Installation automatique (Recommandé)

```bash
./quickstart.sh
```

Le script vous guidera pour :

- Choisir MongoDB local ou cloud
- Configurer automatiquement l'environnement
- Démarrer tous les services

### Option 2 : Installation manuelle

```bash
# 1. Copier la configuration
cp .env.docker .env

# 2. Éditer .env si nécessaire
nano .env

# 3. Démarrer
./deploy-simple.sh start
```

### Option 3 : Windows

```cmd
# Double-cliquez sur :
quickstart.bat
```

## Commandes utiles

| Commande                   | Description            |
| -------------------------- | ---------------------- |
| `./deploy-simple.sh start` | Démarrer l'application |
| `./deploy-simple.sh stop`  | Arrêter l'application  |
| `./deploy-simple.sh logs`  | Voir les logs          |
| `docker compose ps`        | Voir le statut         |

## Résolution des problèmes

### "Docker not found"

→ Installez Docker Desktop depuis https://docker.com

### "Port already in use"

→ Arrêtez les services utilisant les ports 80, 5000, 11434

### "Cannot connect to MongoDB"

→ Choisissez l'option MongoDB local lors de l'installation

### Page blanche sur http://localhost

→ Attendez 30-60 secondes, puis rafraîchissez

## Architecture

```
http://localhost
       ↓
   [Frontend React]
       ↓
   [API Backend]
       ↓
   [MongoDB]  [Ollama IA]
```

## Support

- 📧 Email : elbachir.toure@gmail.com
- 📚 Documentation : [Wiki](https://github.com/elbachir67/usain4nieup/wiki)
- 🐛 Issues : [GitHub Issues](https://github.com/elbachir67/usain4nieup/issues)
