#!/bin/bash

# BeeMed Docker Build Cloud Script
# This script builds and pushes Docker images using Docker Build Cloud

set -e

# Configuration
CLOUD_BUILDER="cloud-mahzyarm-bee"
IMAGE_NAME="beemed"
REGISTRY="docker.io"  # Change to your registry
NAMESPACE="mahzyarm"  # Change to your Docker Hub namespace

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_info "Docker is installed"
}

# Check if buildx is available
check_buildx() {
    if ! docker buildx version &> /dev/null; then
        print_error "Docker Buildx is not available. Please update Docker."
        exit 1
    fi
    print_info "Docker Buildx is available"
}

# Create or use cloud builder
setup_builder() {
    print_info "Setting up Docker Build Cloud builder: ${CLOUD_BUILDER}"
    
    # Check if builder exists
    if docker buildx ls | grep -q "${CLOUD_BUILDER}"; then
        print_info "Builder ${CLOUD_BUILDER} already exists"
    else
        print_info "Creating cloud builder ${CLOUD_BUILDER}"
        docker buildx create --driver cloud ${NAMESPACE}/${CLOUD_BUILDER##cloud-*-} || {
            print_error "Failed to create cloud builder. Make sure you have access to Docker Build Cloud."
            exit 1
        }
    fi
    
    # Set as current builder
    docker buildx use ${CLOUD_BUILDER}
    print_info "Using builder: ${CLOUD_BUILDER}"
}

# Build image
build_image() {
    local tag=$1
    local platforms=$2
    local push=$3
    
    print_info "Building image: ${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${tag}"
    print_info "Platforms: ${platforms}"
    print_info "Push: ${push}"
    
    local build_args=(
        "--builder" "${CLOUD_BUILDER}"
        "--platform" "${platforms}"
        "--tag" "${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${tag}"
        "-f" "Dockerfile.buildx"
        "--cache-from" "type=registry,ref=${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:buildcache"
        "--cache-to" "type=registry,ref=${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:buildcache,mode=max"
    )
    
    if [ "${push}" == "true" ]; then
        build_args+=("--push")
    else
        build_args+=("--load")
    fi
    
    # Add build arguments
    build_args+=(
        "--build-arg" "NODE_ENV=production"
        "."
    )
    
    print_info "Running build command..."
    docker buildx build "${build_args[@]}"
}

# Main execution
main() {
    print_info "BeeMed Docker Build Cloud Builder"
    print_info "================================"
    
    # Parse arguments
    TAG="${1:-latest}"
    PLATFORMS="${2:-linux/amd64,linux/arm64}"
    PUSH="${3:-false}"
    
    # Checks
    check_docker
    check_buildx
    
    # Setup builder
    setup_builder
    
    # Inspect builder
    print_info "Inspecting builder..."
    docker buildx inspect ${CLOUD_BUILDER}
    
    # Build image
    build_image "${TAG}" "${PLATFORMS}" "${PUSH}"
    
    print_info "Build completed successfully!"
    
    if [ "${PUSH}" == "true" ]; then
        print_info "Image pushed to: ${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${TAG}"
    else
        print_info "Image loaded locally as: ${REGISTRY}/${NAMESPACE}/${IMAGE_NAME}:${TAG}"
    fi
}

# Show usage
usage() {
    echo "Usage: $0 [TAG] [PLATFORMS] [PUSH]"
    echo ""
    echo "Arguments:"
    echo "  TAG        - Docker image tag (default: latest)"
    echo "  PLATFORMS  - Target platforms (default: linux/amd64,linux/arm64)"
    echo "  PUSH       - Push to registry: true/false (default: false)"
    echo ""
    echo "Examples:"
    echo "  $0                    # Build for local use"
    echo "  $0 latest             # Build with 'latest' tag"
    echo "  $0 v1.0.0 linux/amd64 # Build for amd64 only"
    echo "  $0 latest linux/amd64,linux/arm64 true  # Build and push multi-arch"
}

# Check for help flag
if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
    usage
    exit 0
fi

# Run main function
main "$@"