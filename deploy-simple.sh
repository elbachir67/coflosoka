#!/bin/bash

# Script de déploiement Docker simplifié pour NIEUP
# Usage: ./deploy-simple.sh [start|stop|restart|logs|status]

set -e

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Fonction d'affichage
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${YELLOW}➜ $1${NC}"; }

# Vérifier Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker n'est pas installé. Installez Docker Desktop depuis https://docker.com"
        exit 1
    fi
    
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose n'est pas installé"
        exit 1
    fi
}

# Configuration initiale
setup() {
    print_info "Configuration initiale..."
    
    # Créer .env si nécessaire
    if [ ! -f .env ]; then
        cp .env.docker .env
        print_success "Fichier .env créé"
    fi
    
    # Créer les dossiers nécessaires
    mkdir -p server/uploads
    touch server/combined.log server/error.log
    
    print_success "Configuration terminée"
}

# Démarrer l'application
start() {
    print_info "Démarrage de l'application NIEUP..."
    
    setup
    
    # Pull Ollama model
    print_info "Téléchargement du modèle Mistral pour l'IA..."
    docker compose up -d ollama
    sleep 5
    docker compose exec ollama ollama pull mistral || true
    
    # Démarrer tous les services
    docker compose up -d
    
    print_success "Application démarrée avec succès!"
    echo ""
    echo "📱 Accès à l'application :"
    echo "   → Frontend : http://localhost"
    echo "   → Backend API : http://localhost:5000"
    echo "   → Ollama AI : http://localhost:11434"
    echo ""
    echo "📝 Pour voir les logs : ./deploy-simple.sh logs"
}

# Arrêter l'application
stop() {
    print_info "Arrêt de l'application..."
    docker compose down
    print_success "Application arrêtée"
}

# Redémarrer
restart() {
    stop
    start
}

# Voir les logs
logs() {
    docker compose logs -f --tail=100
}

# Statut
status() {
    echo "📊 Statut des conteneurs :"
    docker compose ps
}

# Menu principal
case "$1" in
    start)
        check_docker
        start
        ;;
    stop)
        stop
        ;;
    restart)
        check_docker
        restart
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    *)
        echo "🚀 Script de déploiement NIEUP"
        echo ""
        echo "Usage: $0 {start|stop|restart|logs|status}"
        echo ""
        echo "  start   - Démarrer l'application"
        echo "  stop    - Arrêter l'application"
        echo "  restart - Redémarrer l'application"
        echo "  logs    - Voir les logs"
        echo "  status  - Voir le statut"
        exit 1
        ;;
esac