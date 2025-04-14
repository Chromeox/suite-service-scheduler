#!/bin/bash

echo "=== Starting SuiteSync in Expo Go Mode ==="

# Stop any running Expo processes
echo "Stopping any running Expo processes..."
pkill -f "node.*expo" || true

# Clear any Metro bundler cache
echo "Clearing Metro bundler cache..."
rm -rf node_modules/.cache

# Start Expo directly in Go mode
echo "Starting Expo in Go mode..."
EXPO_NO_DEV_CLIENT=1 npx expo start --go --clear --scheme suitesync

echo "Scan the QR code with your iOS device's camera app to open in Expo Go"
