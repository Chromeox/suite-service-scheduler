#!/bin/bash

echo "Cleaning iOS build..."

# Clean the Xcode build
cd ios/App
xcodebuild clean -workspace App.xcworkspace -scheme App

# Remove derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clean CocoaPods
pod deintegrate
pod setup
pod install

echo "iOS project cleaned. Now rebuilding..."

# Go back to project root
cd ../..

# Rebuild the web app
npm run build

# Sync with Capacitor
npx cap sync

echo "Project rebuilt and synced. Opening Xcode..."

# Open in Xcode
npx cap open ios

echo "iOS project opened in Xcode. Please:"
echo "1. Select a simulator device from the dropdown in the top toolbar"
echo "2. Click the play button to build and run the app"
