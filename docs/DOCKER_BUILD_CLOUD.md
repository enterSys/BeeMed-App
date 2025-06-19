# Docker Build Cloud Integration

This document explains how to use Docker Build Cloud with the BeeMed project.

## Overview

Docker Build Cloud provides:
- **Fast builds**: Up to 39x faster builds with cloud infrastructure
- **Multi-architecture support**: Native ARM and AMD builds without emulation
- **Shared cache**: Team members share build cache for faster iterations
- **Parallel builds**: Multiple builds can run simultaneously

## Prerequisites

1. Docker Desktop 4.26.0 or later
2. Docker Build Cloud subscription (or 7-day free trial)
3. Access to the `mahzyarm` organization on Docker Hub

## Quick Start

### 1. Direct Build Command

```bash
# Build for multiple architectures
docker buildx build --builder cloud-mahzyarm-bee \
  --platform linux/amd64,linux/arm64 \
  --tag docker.io/mahzyarm/beemed:latest \
  -f Dockerfile.buildx \
  .
```

### 2. Using Make Commands

```bash
# Build locally (won't push)
make cloud-build

# Build and push to registry
make cloud-push TAG=v1.0.0

# Inspect cloud builder
make cloud-inspect
```

### 3. Using Build Script

```bash
# Make script executable
chmod +x build-cloud.sh

# Build for local use
./build-cloud.sh

# Build and push with custom tag
./build-cloud.sh v1.0.0 linux/amd64,linux/arm64 true
```

## Configuration

### Environment Variables

Update these in `Makefile` or set as environment variables:

```bash
CLOUD_BUILDER=cloud-mahzyarm-bee
REGISTRY=docker.io
NAMESPACE=mahzyarm
IMAGE_NAME=beemed
```

### Builder Setup

If the builder doesn't exist:

```bash
# Create cloud builder
docker buildx create --driver cloud mahzyarm/bee

# Set as default builder
docker buildx use cloud-mahzyarm-bee
```

## Dockerfile Optimization

The `Dockerfile.buildx` is optimized for Docker Build Cloud:

1. **Multi-stage builds**: Reduces final image size
2. **Cache mounts**: Speeds up dependency installation
3. **Multi-architecture support**: Uses `$BUILDPLATFORM` and `$TARGETPLATFORM`
4. **Layer caching**: Optimized COPY order for better cache hits

### Key Features:

```dockerfile
# Cache mount for npm packages
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Cache mount for Next.js build
RUN --mount=type=cache,target=/app/.next/cache \
    npm run build
```

## CI/CD Integration

### GitHub Actions

The workflow `.github/workflows/docker-build-cloud.yml`:
- Builds on push to main/develop
- Creates semantic version tags
- Pushes multi-architecture images
- Uses build cache for faster builds

Required secrets:
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub access token

### GitLab CI

```yaml
build:
  stage: build
  script:
    - docker buildx build --builder cloud-mahzyarm-bee
      --platform linux/amd64,linux/arm64
      --tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
      --push .
```

## Build Cache Strategy

The build uses registry-based caching:

```bash
--cache-from type=registry,ref=docker.io/mahzyarm/beemed:buildcache
--cache-to type=registry,ref=docker.io/mahzyarm/beemed:buildcache,mode=max
```

This allows:
- Persistent cache across builds
- Shared cache between team members
- Faster incremental builds

## Troubleshooting

### Builder Not Found

```bash
# List available builders
docker buildx ls

# Create if missing
docker buildx create --driver cloud mahzyarm/bee
```

### Authentication Issues

```bash
# Login to Docker Hub
docker login

# Verify authentication
docker buildx inspect cloud-mahzyarm-bee
```

### Build Timeouts

Docker Build Cloud has a 90-minute timeout. For large builds:
1. Optimize Dockerfile for better caching
2. Use multi-stage builds
3. Minimize build context with `.dockerignore`

### Platform Issues

For single-platform builds:
```bash
# AMD64 only
docker buildx build --builder cloud-mahzyarm-bee \
  --platform linux/amd64 \
  --load .

# ARM64 only  
docker buildx build --builder cloud-mahzyarm-bee \
  --platform linux/arm64 \
  --load .
```

Note: `--load` doesn't work with multi-platform builds. Use `--push` instead.

## Best Practices

1. **Use specific tags**: Avoid overwriting `:latest` in production
2. **Leverage caching**: Order Dockerfile commands for optimal caching
3. **Minimize context**: Use `.dockerignore` to exclude unnecessary files
4. **Security**: Never include secrets in images, use build secrets instead
5. **Multi-stage builds**: Keep production images small

## Monitoring Builds

### Build Logs
```bash
# View real-time logs during build
docker buildx build --builder cloud-mahzyarm-bee \
  --progress plain \
  .
```

### Build History
Check Docker Hub or your registry for:
- Image sizes
- Build times
- Platform support
- Layer information

## Cost Optimization

To optimize Docker Build Cloud usage:
1. Use build cache effectively
2. Build only changed services
3. Schedule non-critical builds during off-peak
4. Monitor monthly build minutes usage

## Additional Resources

- [Docker Build Cloud Docs](https://docs.docker.com/build-cloud/)
- [Buildx Documentation](https://docs.docker.com/buildx/working-with-buildx/)
- [Multi-platform Builds](https://docs.docker.com/build/building/multi-platform/)
- [Build Optimization](https://docs.docker.com/build/cache/)