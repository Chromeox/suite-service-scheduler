#!/bin/bash

echo "=== Launching SuiteSync in Expo Go for iOS Testing ==="
echo "This script will help you test your app on iOS via QR code"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Set environment variables for Expo Go
export EXPO_NO_DEV_CLIENT=true
export EXPO_USE_DEV_SERVER=true

# Get local IP address for QR code
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
echo "Your local IP address is: $LOCAL_IP"
echo "Make sure your iOS device is on the same WiFi network"

# Start Expo in Go mode with explicit scheme and host
echo "Starting Expo Go for iOS testing..."
echo "When Expo starts, you will see a QR code in the terminal"
echo "Scan this QR code with your iOS device's camera app"

# Launch Expo with the correct configuration
npx expo start --clear --scheme suitesync --host $LOCAL_IP

echo "If you don't see the QR code, press 's' to switch to Expo Go mode"
