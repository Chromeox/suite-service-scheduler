#!/bin/bash

echo "=== Updating Remaining Packages for SuiteSync ==="
echo "This script will update packages to their expected versions for Expo SDK 52"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Create a backup of package.json
echo "Creating backup of package.json..."
cp package.json .backups/package.json.before_update

# Update packages to their expected versions
echo "Updating packages to their expected versions..."

# Update expo-router
echo "Updating expo-router to ~4.0.20..."
npm install expo-router@~4.0.20

# Update metro
echo "Updating metro to ^0.81.0..."
npm install metro@^0.81.0

# Update react
echo "Updating react to 18.3.1..."
npm install react@18.3.1

# Update react-native
echo "Updating react-native to 0.76.9..."
npm install react-native@0.76.9

# Update react-native-safe-area-context
echo "Updating react-native-safe-area-context to 4.12.0..."
npm install react-native-safe-area-context@4.12.0

# Fix any peer dependency issues
echo "Running npm install to resolve any dependency issues..."
npm install

# Clear caches
echo "Clearing caches..."
rm -rf node_modules/.cache
rm -rf .expo

echo "Package updates completed!"
echo "Now try running: ./start_expo_go.sh"
