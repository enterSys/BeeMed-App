# BeeMed Docker Setup Guide

## Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- Make (optional, for using Makefile commands)

## Quick Start

### Development Environment
```bash
# Start development environment with hot reload
make dev

# Or without make:
docker-compose -f docker-compose.dev.yml up -d
```

### Production Environment
```bash
# Build and start production environment
make build
make prod

# Or without make:
docker-compose build
docker-compose up -d
```

## Available Services

### Application (Port 3000)
- Next.js 15 application with HeroUI
- Hot reload enabled in development
- Optimized production build

### PostgreSQL Database (Port 5432)
- Version: 16 Alpine
- Default credentials:
  - User: `beemed`
  - Password: `beemed_password`
  - Database: `beemed_db`

### Redis Cache (Port 6379)
- Version: 7 Alpine
- Used for caching and real-time features

### Adminer (Port 8080) - Development Only
- Database management UI
- Access at: http://localhost:8080

## Common Commands

### Using Make
```bash
make dev        # Start development environment
make prod       # Start production environment
make build      # Build Docker images
make up         # Start all services
make down       # Stop all services
make logs       # View container logs
make shell      # Access app container shell
make clean      # Remove volumes and containers
make db-init    # Initialize database with migrations
```

### Using Docker Compose Directly
```bash
# Development
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml logs -f
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose up -d
docker-compose logs -f
docker-compose down

# Access container shell
docker-compose exec app sh

# Run database migrations
docker-compose exec app npx prisma migrate dev
```

## Environment Variables

Create a `.env` file in the project root:
```env
# Database
DATABASE_URL=postgresql://beemed:beemed_password@localhost:5432/beemed_db

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Redis
REDIS_URL=redis://localhost:6379

# Optional
SENTRY_DSN=your-sentry-dsn
```

## Troubleshooting

### Port Conflicts
If ports are already in use:
```bash
# Change ports in docker-compose.yml
# Example: "3001:3000" for app service
```

### Database Connection Issues
```bash
# Check database status
docker-compose ps postgres
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Clean Start
```bash
# Remove all containers and volumes
make clean

# Or:
docker-compose down -v
docker system prune -f
```

## Production Deployment

### Building with Docker Build Cloud
```bash
# Using cloud builder for multi-architecture builds
docker buildx build --builder cloud-mahzyarm-bee \
  --platform linux/amd64,linux/arm64 \
  --tag docker.io/mahzyarm/beemed:latest \
  --push .

# Or using Make commands
make cloud-push TAG=v1.0.0
```

### Building Locally
```bash
# Build optimized image
docker build -t beemed:latest .

# Tag for registry
docker tag beemed:latest your-registry/beemed:latest

# Push to registry
docker push your-registry/beemed:latest
```

### Health Checks
The application includes health check endpoints:
- App: http://localhost:3000/api/health
- Database: Automatic PostgreSQL health check
- Redis: Automatic Redis health check

## Security Notes

1. **Change default passwords** in production
2. **Generate secure NEXTAUTH_SECRET**: 
   ```bash
   openssl rand -base64 32
   ```
3. **Use environment-specific .env files**
4. **Enable HTTPS** in production with a reverse proxy
5. **Restrict database access** to application network only

## Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Resource Usage
```bash
docker stats
```

### Network Inspection
```bash
docker network ls
docker network inspect beemed-network
```