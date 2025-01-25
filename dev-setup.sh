#!/bin/bash

# AfterCare Development Setup Script
# This script provides easy commands for different deployment options

set -e

echo "🏥 AfterCare Development Setup"
echo "=============================="

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker Desktop first."
        exit 1
    fi
}

# Function to check if Homebrew is available
check_homebrew() {
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew is not installed. Please install Homebrew first."
        exit 1
    fi
}

# Option 1: MVP Mode (no database/cache)
run_mvp() {
    echo "🚀 Starting in MVP mode (no database/cache)..."
    cd server
    npm start
}

# Option 2: Install MongoDB and Redis locally
install_local() {
    echo "📦 Installing MongoDB and Redis locally..."
    check_homebrew
    
    echo "Installing MongoDB..."
    brew tap mongodb/brew
    brew install mongodb-community
    
    echo "Installing Redis..."
    brew install redis
    
    echo "Starting services..."
    brew services start mongodb/brew/mongodb-community
    brew services start redis
    
    echo "✅ MongoDB and Redis installed and started!"
    echo "🚀 Now you can run: cd server && npm start"
}

# Option 3: Run with Docker
run_docker() {
    echo "🐳 Starting with Docker..."
    check_docker
    
    echo "Building and starting services..."
    docker-compose up --build -d
    
    echo "✅ Services started!"
    echo "📋 Backend: http://localhost:3000"
    echo "📊 MongoDB: localhost:27017"
    echo "🔄 Redis: localhost:6379"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
}

# Option 4: Stop Docker services
stop_docker() {
    echo "🛑 Stopping Docker services..."
    docker-compose down
    echo "✅ Services stopped!"
}

# Option 5: View logs
view_logs() {
    echo "📋 Viewing logs..."
    docker-compose logs -f
}

# Main menu
case "${1:-}" in
    "mvp")
        run_mvp
        ;;
    "install")
        install_local
        ;;
    "docker")
        run_docker
        ;;
    "stop")
        stop_docker
        ;;
    "logs")
        view_logs
        ;;
    *)
        echo "Usage: $0 {mvp|install|docker|stop|logs}"
        echo ""
        echo "Options:"
        echo "  mvp     - Run in MVP mode (no database/cache)"
        echo "  install - Install MongoDB and Redis locally"
        echo "  docker  - Run with Docker (recommended)"
        echo "  stop    - Stop Docker services"
        echo "  logs    - View Docker logs"
        echo ""
        echo "Current status:"
        echo "  MongoDB: $(brew services list | grep mongodb | awk '{print $2}' || echo 'Not installed')"
        echo "  Redis:   $(brew services list | grep redis | awk '{print $2}' || echo 'Not installed')"
        echo "  Docker:  $(docker info > /dev/null 2>&1 && echo 'Running' || echo 'Not running')"
        ;;
esac 