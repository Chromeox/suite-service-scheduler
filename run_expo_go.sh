#!/bin/bash

echo "=== Running SuiteSync in Expo Go ==="
echo "This script will start your app in Expo Go mode"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Set environment variables to force Expo Go mode
export EXPO_NO_DEV_CLIENT=true
export EXPO_USE_DEV_SERVER=true

# Clear the cache and start in Expo Go mode
echo "Starting Expo in Go mode..."
npx expo start --clear

echo "When Expo starts, press 's' to switch to Expo Go mode"
echo "Then scan the QR code with your iOS device to open in Expo Go"
