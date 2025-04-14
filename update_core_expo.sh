#!/bin/bash

# Create a backup of package.json
cp package.json package.json.core-update.bak
echo "Created backup of package.json as package.json.core-update.bak"

echo "=== Updating Core Expo Packages ==="
echo "This script will update essential Expo packages while preserving compatibility"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Update specific core Expo packages
echo "Updating core Expo packages..."
npm install --save expo@^52.0.0 expo-constants@^17.0.0 expo-linking@^7.0.0 expo-status-bar@^2.0.0 expo-router@^4.0.0

# Install modern development tools
echo "Installing modern Expo development tools..."
npm install --save-dev expo-dev-client@^3.3.0

# Update app.json with modern configuration
echo "Updating app.json with modern configuration..."
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
    "sdkVersion": "52.0.0"
  }
}
EOF

# Update metro.config.js for better compatibility
echo "Updating metro.config.js for better compatibility..."
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

echo "Core Expo packages update complete!"
echo "To start your updated Expo app, run: npm run expo:start -- --clear"
