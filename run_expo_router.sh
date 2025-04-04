#!/bin/bash

# Create necessary asset directories if they don't exist
mkdir -p assets

# Copy public assets to assets directory for Expo
cp -r public/* assets/ 2>/dev/null || :

# Clear metro bundler cache
echo "Clearing Metro bundler cache..."
rm -rf node_modules/.cache

# Create a temporary app.json for Expo Router
cat > app.json.expo <<EOF
{
  "expo": {
    "name": "SuiteSync",
    "slug": "suitesync",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.lovable.suitesync"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.lovable.suitesync"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router"
    ],
    "scheme": "suitesync"
  }
}
EOF

# Backup original app.json and use the temporary one
mv app.json app.json.backup
mv app.json.expo app.json

# Start Expo development server
echo "Starting Expo development server with Expo Router..."
EXPO_ROUTER_APP_ROOT="./app" npx expo start --clear

# Restore original app.json when done
mv app.json.backup app.json
