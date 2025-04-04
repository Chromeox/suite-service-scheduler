#!/bin/bash

# Create necessary asset directories if they don't exist
mkdir -p assets

# Copy public assets to assets directory for Expo
cp -r public/* assets/ 2>/dev/null || :

# Install json tool if not available
if ! command -v npx json &> /dev/null; then
  npm install -g json
fi

# Update package.json to include Expo scripts if they don't exist
if ! grep -q "\"expo:start\"" package.json; then
  npx json -I -f package.json -e 'this.scripts["expo:start"] = "expo start"'
  npx json -I -f package.json -e 'this.scripts["expo:ios"] = "expo start --ios"'
  npx json -I -f package.json -e 'this.scripts["expo:android"] = "expo start --android"'
  npx json -I -f package.json -e 'this.scripts["expo:web"] = "expo start --web"'
fi

# Clear metro bundler cache
echo "Clearing Metro bundler cache..."
rm -rf node_modules/.cache

# Start Expo development server
echo "Starting Expo development server..."
EXPO_ROUTER_APP_ROOT="./app" npx expo start --clear
