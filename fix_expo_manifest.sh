#!/bin/bash

echo "=== Fixing Expo Manifest Parsing Issue ==="
echo "This script will fix the 'Failed to parse manifest JSON' error"

# Create a backup of app.json
cp app.json app.json.manifest.bak
echo "Created backup of app.json as app.json.manifest.bak"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Fix app.json configuration
echo "Updating app.json with correct configuration..."
cat > app.json << 'EOF'
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
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router"
    ],
    "scheme": "suitesync",
    "extra": {
      "eas": {
        "projectId": "suitesync-app"
      }
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/suitesync-app",
      "enabled": false
    },
    "sdkVersion": "52.0.0"
  }
}
EOF

# Create or update the metro.config.js file
echo "Updating metro.config.js..."
cat > metro.config.js << 'EOF'
// Learn more https://docs.expo.io/guides/customizing-metro
import { getDefaultConfig } from 'expo/metro-config.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for importing from the app directory
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];
config.resolver.assetExts = [...config.resolver.assetExts, 'db'];
config.watchFolders = [...(config.watchFolders || []), './app'];

// Fix for manifest parsing issue
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Add CORS headers to allow Expo Go to access the manifest
      res.setHeader('Access-Control-Allow-Origin', '*');
      return middleware(req, res, next);
    };
  },
};

export default config;
EOF

# Update the babel.config.js file
echo "Updating babel.config.js..."
cat > babel.config.js << 'EOF'
export default function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      'react-native-reanimated/plugin',
    ],
  };
};
EOF

# Install required dependencies
echo "Installing required dependencies..."
npm install --save expo-dev-client

# Clear Expo cache
echo "Clearing Expo cache..."
rm -rf node_modules/.cache/expo
rm -rf ~/.expo

# Create an .expo folder if it doesn't exist
mkdir -p .expo

# Create a proper settings.json file for Expo
echo "Creating Expo settings file..."
cat > .expo/settings.json << 'EOF'
{
  "hostType": "lan",
  "lanType": "ip",
  "dev": true,
  "minify": false,
  "https": false
}
EOF

echo "Manifest fix applied. Now run the app with:"
echo "npm run expo:start --clear"
echo "Then scan the QR code with your iOS device's camera."
