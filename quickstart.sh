#!/bin/bash

# NIEUP - Script de démarrage rapide
# Usage: ./quickstart.sh

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}   NIEUP - Installation Rapide${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# 1. Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker n'est pas installé !${NC}"
    echo "Installez Docker Desktop depuis : https://docker.com"
    exit 1
fi
echo -e "${GREEN}✓ Docker détecté${NC}"

# 2. Configuration environnement
if [ ! -f .env ]; then
    echo -e "${YELLOW}Configuration de l'environnement...${NC}"
    
    # Choix du mode MongoDB
    echo ""
    echo "Choisissez votre mode MongoDB :"
    echo "1) MongoDB Local (Docker) - Recommandé pour tester"
    echo "2) MongoDB Atlas (Cloud) - Nécessite un compte"
    echo "3) Utiliser mes propres credentials MongoDB"
    read -p "Votre choix (1/2/3) : " mongo_choice
    
    case $mongo_choice in
        1)
            # MongoDB Local
            cat > .env << 'EOF'
NODE_ENV=development
MONGODB_URI=mongodb://admin:admin123456@mongodb:27017/ucad_ia?authSource=admin
PORT=5000
JWT_SECRET=ucad_ia_dev_secret_key_2025
VITE_API_URL=http://localhost
OLLAMA_URL=http://ollama:11434
OLLAMA_DEFAULT_MODEL=mistral
EOF
            USE_LOCAL_MONGO=true
            echo -e "${GREEN}✓ Configuration MongoDB locale${NC}"
            ;;
        2)
            # MongoDB Atlas
            echo "Créez un compte gratuit sur : https://www.mongodb.com/cloud/atlas"
            read -p "Entrez votre MongoDB URI : " mongo_uri
            cat > .env << EOF
NODE_ENV=development
MONGODB_URI=$mongo_uri
PORT=5000
JWT_SECRET=ucad_ia_dev_secret_key_2025
VITE_API_URL=http://localhost
OLLAMA_URL=http://ollama:11434
OLLAMA_DEFAULT_MODEL=mistral
EOF
            USE_LOCAL_MONGO=false
            echo -e "${GREEN}✓ Configuration MongoDB Atlas${NC}"
            ;;
        3)
            # Custom
            read -p "MongoDB URI : " mongo_uri
            read -p "JWT Secret (ou Entrée pour générer) : " jwt_secret
            jwt_secret=${jwt_secret:-$(openssl rand -base64 32)}
            cat > .env << EOF
NODE_ENV=development
MONGODB_URI=$mongo_uri
PORT=5000
JWT_SECRET=$jwt_secret
VITE_API_URL=http://localhost
OLLAMA_URL=http://ollama:11434
OLLAMA_DEFAULT_MODEL=mistral
EOF
            USE_LOCAL_MONGO=false
            echo -e "${GREEN}✓ Configuration personnalisée${NC}"
            ;;
        *)
            echo -e "${RED}Choix invalide${NC}"
            exit 1
            ;;
    esac
else
    echo -e "${GREEN}✓ Fichier .env existant${NC}"
    # Détecter si MongoDB local
    if grep -q "mongodb://.*@mongodb:" .env; then
        USE_LOCAL_MONGO=true
    else
        USE_LOCAL_MONGO=false
    fi
fi

# 3. Rendre les scripts exécutables
chmod +x deploy-simple.sh 2>/dev/null || true
chmod +x start.bat 2>/dev/null || true

# 4. Créer les dossiers nécessaires
mkdir -p server/uploads
touch server/combined.log server/error.log

# 5. Démarrer l'application
echo ""
echo -e "${BLUE}Démarrage de l'application...${NC}"

if [ "$USE_LOCAL_MONGO" = true ]; then
    # Avec MongoDB local
    docker compose --profile local-db up -d
else
    # Sans MongoDB local (Atlas ou externe)
    docker compose up -d ollama backend frontend
fi

# 6. Attendre que les services démarrent
echo -e "${YELLOW}Initialisation des services...${NC}"
sleep 5

# 7. Télécharger le modèle Ollama
echo -e "${YELLOW}Téléchargement du modèle IA (peut prendre quelques minutes)...${NC}"
docker compose exec -T ollama ollama pull mistral 2>/dev/null || echo "Modèle IA sera téléchargé en arrière-plan"

# 8. Vérifier le statut
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}    ✅ Installation Terminée !${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "📱 Accès à l'application :"
echo "   → Frontend : http://localhost"
echo "   → Backend  : http://localhost:5000/health"
echo "   → Ollama   : http://localhost:11434"
echo ""
echo "📝 Commandes utiles :"
echo "   → Logs     : docker compose logs -f"
echo "   → Arrêter  : docker compose down"
echo "   → Status   : docker compose ps"
echo ""

# 9. Optionnel : Ouvrir le navigateur
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost 2>/dev/null &
elif command -v open &> /dev/null; then
    open http://localhost 2>/dev/null &
elif command -v start &> /dev/null; then
    start http://localhost 2>/dev/null &
fi

echo -e "${BLUE}L'application devrait s'ouvrir dans votre navigateur...${NC}"
echo -e "${YELLOW}Note : Le premier chargement peut prendre 30-60 secondes${NC}"