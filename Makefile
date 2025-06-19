.PHONY: help build up down logs shell clean dev prod cloud-build cloud-push cloud-inspect

# Configuration
CLOUD_BUILDER = cloud-mahzyarm-bee
IMAGE_NAME = beemed
REGISTRY = docker.io
NAMESPACE = mahzyarm
TAG ?= latest

# Default target
help:
	@echo "BeeMed Docker Commands:"
	@echo "  make dev         - Start development environment"
	@echo "  make prod        - Start production environment"
	@echo "  make build       - Build Docker images locally"
	@echo "  make up          - Start all services"
	@echo "  make down        - Stop all services"
	@echo "  make logs        - View container logs"
	@echo "  make shell       - Access app container shell"
	@echo "  make clean       - Remove volumes and containers"
	@echo "  make db-init     - Initialize database with migrations"
	@echo ""
	@echo "Docker Build Cloud Commands:"
	@echo "  make cloud-build - Build using Docker Build Cloud"
	@echo "  make cloud-push  - Build and push to registry"
	@echo "  make cloud-inspect - Inspect cloud builder"

# Development environment
dev:
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Development environment started at http://localhost:3000"

# Production environment
prod:
	docker-compose up -d
	@echo "Production environment started at http://localhost:3000"

# Build images
build:
	docker-compose build

# Start services
up:
	docker-compose up -d

# Stop services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Access shell
shell:
	docker-compose exec app sh

# Clean everything
clean:
	docker-compose down -v
	docker system prune -f

# Initialize database
db-init:
	docker-compose exec app npx prisma migrate dev
	docker-compose exec app npx prisma db seed

# Docker Build Cloud commands
cloud-build:
	@echo "Building with Docker Build Cloud..."
	docker buildx build --builder $(CLOUD_BUILDER) \
		--platform linux/amd64,linux/arm64 \
		--tag $(REGISTRY)/$(NAMESPACE)/$(IMAGE_NAME):$(TAG) \
		-f Dockerfile.buildx \
		--cache-from type=registry,ref=$(REGISTRY)/$(NAMESPACE)/$(IMAGE_NAME):buildcache \
		--cache-to type=registry,ref=$(REGISTRY)/$(NAMESPACE)/$(IMAGE_NAME):buildcache,mode=max \
		--load \
		.

cloud-push:
	@echo "Building and pushing with Docker Build Cloud..."
	docker buildx build --builder $(CLOUD_BUILDER) \
		--platform linux/amd64,linux/arm64 \
		--tag $(REGISTRY)/$(NAMESPACE)/$(IMAGE_NAME):$(TAG) \
		-f Dockerfile.buildx \
		--cache-from type=registry,ref=$(REGISTRY)/$(NAMESPACE)/$(IMAGE_NAME):buildcache \
		--cache-to type=registry,ref=$(REGISTRY)/$(NAMESPACE)/$(IMAGE_NAME):buildcache,mode=max \
		--push \
		.

cloud-inspect:
	@echo "Inspecting Docker Build Cloud builder..."
	docker buildx inspect $(CLOUD_BUILDER)

# Setup cloud builder
cloud-setup:
	@echo "Setting up Docker Build Cloud builder..."
	docker buildx create --driver cloud mahzyarm/bee || true
	docker buildx use $(CLOUD_BUILDER)