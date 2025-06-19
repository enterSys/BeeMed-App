#!/bin/bash

# Docker Build Cloud Setup Verification Script
# This script checks if the cloud builder is properly configured

set -e

CLOUD_BUILDER="cloud-mahzyarm-bee"
TEST_REPO="https://github.com/dockersamples/buildme.git"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}Docker Build Cloud Setup Verification${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Step 1: Check if Docker is installed
echo -e "${YELLOW}Step 1: Checking Docker installation...${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker is installed${NC}"
    docker --version
else
    echo -e "${RED}✗ Docker is not installed${NC}"
    echo "Please install Docker Desktop first"
    exit 1
fi
echo ""

# Step 2: Check Docker Buildx
echo -e "${YELLOW}Step 2: Checking Docker Buildx...${NC}"
if docker buildx version &> /dev/null; then
    echo -e "${GREEN}✓ Docker Buildx is available${NC}"
    docker buildx version
else
    echo -e "${RED}✗ Docker Buildx is not available${NC}"
    exit 1
fi
echo ""

# Step 3: List current builders
echo -e "${YELLOW}Step 3: Current builders:${NC}"
docker buildx ls
echo ""

# Step 4: Check if cloud builder exists
echo -e "${YELLOW}Step 4: Checking for cloud builder '${CLOUD_BUILDER}'...${NC}"
if docker buildx ls | grep -q "${CLOUD_BUILDER}"; then
    echo -e "${GREEN}✓ Cloud builder '${CLOUD_BUILDER}' exists${NC}"
    
    # Check if it's the default
    if docker buildx ls | grep "${CLOUD_BUILDER}" | grep -q "*"; then
        echo -e "${GREEN}✓ Cloud builder is set as default${NC}"
    else
        echo -e "${YELLOW}⚠ Cloud builder exists but is not default${NC}"
        echo "Setting as default..."
        docker buildx use ${CLOUD_BUILDER} --global
        echo -e "${GREEN}✓ Cloud builder is now default${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Cloud builder not found. Creating it...${NC}"
    
    # Create the cloud builder
    echo "Running: docker buildx create --driver cloud mahzyarm/bee"
    if docker buildx create --driver cloud mahzyarm/bee; then
        echo -e "${GREEN}✓ Cloud builder created successfully${NC}"
        
        # Set as default
        echo "Setting as default builder..."
        docker buildx use ${CLOUD_BUILDER} --global
        echo -e "${GREEN}✓ Cloud builder is now default${NC}"
    else
        echo -e "${RED}✗ Failed to create cloud builder${NC}"
        echo "Make sure you have access to Docker Build Cloud"
        exit 1
    fi
fi
echo ""

# Step 5: Inspect the cloud builder
echo -e "${YELLOW}Step 5: Inspecting cloud builder...${NC}"
docker buildx inspect ${CLOUD_BUILDER}
echo ""

# Step 6: Test build with sample repository
echo -e "${YELLOW}Step 6: Testing build with sample repository...${NC}"
echo "Building from: ${TEST_REPO}"
echo -e "${BLUE}This will test if the cloud builder is working correctly${NC}"
echo ""
read -p "Do you want to run a test build? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running test build..."
    if docker buildx build ${TEST_REPO} --builder ${CLOUD_BUILDER}; then
        echo -e "${GREEN}✓ Test build completed successfully${NC}"
    else
        echo -e "${RED}✗ Test build failed${NC}"
        echo "Check your Docker Build Cloud access and quota"
    fi
else
    echo "Skipping test build"
fi
echo ""

# Step 7: Build BeeMed project
echo -e "${YELLOW}Step 7: Ready to build BeeMed project${NC}"
echo "To build the BeeMed project, run:"
echo -e "${BLUE}docker buildx build --builder ${CLOUD_BUILDER} .${NC}"
echo ""
echo "Or use the Make commands:"
echo -e "${BLUE}make cloud-build${NC} - Build locally"
echo -e "${BLUE}make cloud-push${NC} - Build and push to registry"
echo ""

# Summary
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Setup Summary${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

# Check final status
if docker buildx ls | grep "${CLOUD_BUILDER}" | grep -q "*"; then
    echo -e "${GREEN}✓ Docker Build Cloud is properly configured${NC}"
    echo -e "${GREEN}✓ Cloud builder '${CLOUD_BUILDER}' is active and default${NC}"
    echo ""
    echo "You can now use Docker Build Cloud for all your builds!"
    echo "The cloud builder will be used by default for all 'docker buildx build' commands."
else
    echo -e "${RED}✗ Setup incomplete${NC}"
    echo "Please check the errors above"
fi