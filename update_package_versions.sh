#!/bin/bash

echo "=== Updating Package Versions for Expo Compatibility ==="
echo "This script will update packages to their expected versions"

# Create a backup of package.json
cp package.json package.json.version.bak
echo "Created backup of package.json as package.json.version.bak"

# Update core packages
echo "Updating core packages to expected versions..."
npm install --save \
  expo@52.0.46 \
  react-native@0.76.9 \
  react-native-reanimated@3.16.1 \
  react-native-safe-area-context@4.12.0 \
  react-native-screens@4.4.0 \
  react-native-svg@15.8.0 \
  react-native-web@0.19.13

# Update development packages
echo "Updating development packages to expected versions..."
npm install --save-dev \
  @types/react@18.3.12 \
  @types/react-dom@18.3.1

# Update expo-dev-client separately (it's a special case)
echo "Updating expo-dev-client..."
npm install --save expo-dev-client@5.0.20

# Update metro separately (it's a special case)
echo "Updating metro..."
npm install --save-dev metro@0.81.0

echo "Package versions updated successfully!"
echo "Now try running: ./start_expo_go.sh"
