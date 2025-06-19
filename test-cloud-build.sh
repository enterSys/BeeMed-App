#!/bin/bash

# Test script for Docker Build Cloud integration
# This script verifies the cloud builder setup without actually building

set -e

CLOUD_BUILDER="cloud-mahzyarm-bee"

echo "==================================="
echo "Docker Build Cloud Test Script"
echo "==================================="
echo ""

# Check Docker
if command -v docker &> /dev/null; then
    echo "✓ Docker is installed"
    docker --version
else
    echo "✗ Docker is not installed"
    echo "  Please install Docker Desktop 4.26.0 or later"
    exit 1
fi

echo ""

# Check Docker Buildx
if docker buildx version &> /dev/null; then
    echo "✓ Docker Buildx is available"
    docker buildx version
else
    echo "✗ Docker Buildx is not available"
    echo "  Please update Docker Desktop"
    exit 1
fi

echo ""

# Check if logged in to Docker
if docker info 2>/dev/null | grep -q "Username"; then
    echo "✓ Logged in to Docker Hub"
else
    echo "⚠ Not logged in to Docker Hub"
    echo "  Run: docker login"
fi

echo ""

# List builders
echo "Available builders:"
docker buildx ls || echo "  Failed to list builders"

echo ""

# Check cloud builder
echo "Checking for cloud builder: ${CLOUD_BUILDER}"
if docker buildx ls | grep -q "${CLOUD_BUILDER}"; then
    echo "✓ Cloud builder exists"
    echo ""
    echo "Builder details:"
    docker buildx inspect ${CLOUD_BUILDER} || echo "  Failed to inspect builder"
else
    echo "✗ Cloud builder not found"
    echo "  To create it, run:"
    echo "  docker buildx create --driver cloud mahzyarm/bee"
    echo "  docker buildx use ${CLOUD_BUILDER}"
fi

echo ""
echo "==================================="
echo "Test Summary"
echo "==================================="
echo ""
echo "To build with Docker Build Cloud, run:"
echo "  docker buildx build --builder ${CLOUD_BUILDER} ."
echo ""
echo "Or use the provided Make commands:"
echo "  make cloud-build    # Build locally"
echo "  make cloud-push     # Build and push"
echo ""