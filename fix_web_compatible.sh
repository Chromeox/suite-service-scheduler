#!/bin/bash

echo "=== Fixing Web Compatibility for SuiteSync with Expo SDK 52 ==="
echo "This script will fix web bundling issues with compatible dependencies"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Create a backup of critical files
echo "Creating backups of critical files..."
mkdir -p .backups/web-fix-compatible
cp package.json .backups/web-fix-compatible/package.json.bak
cp app.json .backups/web-fix-compatible/app.json.bak
cp babel.config.js .backups/web-fix-compatible/babel.config.bak

# Clear caches thoroughly
echo "Clearing caches thoroughly..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf web-build

# Create a proper app.json with web configuration
echo "Updating app.json with proper web configuration..."
cat > app.json << 'EOF'
{
  "expo": {
    "name": "SuiteSync",
    "slug": "suite-service-scheduler",
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
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router"
    ],
    "scheme": "suitesync",
    "experiments": {
      "tsconfigPaths": true
    }
  }
}
EOF

# Update babel.config.js
echo "Updating babel.config.js..."
cat > babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
EOF

# Create a proper metro.config.js
echo "Creating proper metro.config.js..."
cat > metro.config.js << 'EOF'
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for importing from outside the app directory
config.watchFolders = [path.resolve(__dirname, '..')];

// Handle various file extensions
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json', 'cjs', 'mjs'];

// Ensure proper asset handling
config.resolver.assetExts = [...config.resolver.assetExts, 'db', 'sqlite'];

module.exports = config;
EOF

# Create a package.json with compatible web dependencies
echo "Updating package.json with compatible web dependencies..."
node -e '
const fs = require("fs");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

// Update dependencies for web compatibility
packageJson.dependencies = {
  ...packageJson.dependencies,
  "react-dom": "18.3.1",
  "react-native-web": "~0.19.10"
};

// Add web script
packageJson.scripts = {
  ...packageJson.scripts,
  "web": "expo start --web"
};

fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
'

# Create a standalone web entry point
echo "Creating a standalone web entry point..."
mkdir -p web
cat > web/index.js << 'EOF'
import { AppRegistry } from 'react-native';
import App from '../App';

AppRegistry.registerComponent('main', () => App);

if (module.hot) {
  module.hot.accept();
}

AppRegistry.runApplication('main', {
  rootTag: document.getElementById('root')
});
EOF

# Create a minimal HTML template
echo "Creating a minimal HTML template..."
cat > web/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>SuiteSync</title>
    <style>
      html, body, #root {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }
      #root {
        display: flex;
        flex-direction: column;
      }
    </style>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# Install dependencies with --legacy-peer-deps to avoid conflicts
echo "Installing dependencies with --legacy-peer-deps to avoid conflicts..."
npm install --legacy-peer-deps

echo "Web compatibility fixed for Expo SDK 52!"
echo "Now try running: npm run web"
