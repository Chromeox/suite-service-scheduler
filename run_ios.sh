#!/bin/bash

echo "=== SuiteSync iOS Build Process =="
echo "Building the consolidated SuiteSync app for iOS..."

# Build the web app
echo "Step 1: Building the web application..."
npm run build
if [ $? -ne 0 ]; then
  echo "Error: Build failed!"
  exit 1
fi
echo "✅ Build completed successfully."

# Sync the web app with Capacitor
echo "Step 2: Syncing with Capacitor..."
npx cap sync
if [ $? -ne 0 ]; then
  echo "Error: Capacitor sync failed!"
  exit 1
fi
echo "✅ Capacitor sync completed successfully."

# Open the iOS project in Xcode
echo "Step 3: Opening iOS project in Xcode..."
npx cap open ios

echo ""
echo "=== iOS project opened in Xcode =="
echo "To run the app, please:"
echo "1. Select a simulator device from the dropdown in the top toolbar"
echo "2. Click the play button to build and run the app"
echo ""
echo "To access the mobile version of the app, navigate to /mobile in the app"
echo ""
