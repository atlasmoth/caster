# Makefile for managing Docker Compose services

# Variables
DC = docker-compose
COMPOSE_FILE = docker_compose.yml

# Default target
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make up              - Start all services"
	@echo "  make down            - Stop and remove all services"
	@echo "  make restart         - Restart all services"
	@echo "  make logs            - View logs of all services"
	@echo "  make ps              - List running services"
	@echo "  make build           - Build or rebuild services"
	@echo "  make clean           - Remove all containers, networks, and volumes"
	@echo "  make kratos-migrate  - Run Kratos migrations"

# Start all services
.PHONY: up
up:
	$(DC) -f $(COMPOSE_FILE) up -d

# Stop and remove all services
.PHONY: down
down:
	$(DC) -f $(COMPOSE_FILE) down

# Restart all services
.PHONY: restart
restart:
	$(DC) -f $(COMPOSE_FILE) restart

# View logs of all services
.PHONY: logs
logs:
	$(DC) -f $(COMPOSE_FILE) logs -f

# List running services
.PHONY: ps
ps:
	$(DC) -f $(COMPOSE_FILE) ps

# Build or rebuild services
.PHONY: build
build:
	$(DC) -f $(COMPOSE_FILE) build

# Remove all containers, networks, and volumes
.PHONY: clean
clean:
	$(DC) -f $(COMPOSE_FILE) down -v --remove-orphans

# Run Kratos migrations
.PHONY: kratos-migrate
kratos-migrate:
	$(DC) -f $(COMPOSE_FILE) run --rm kratos-migrate