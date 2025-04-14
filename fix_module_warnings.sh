#!/bin/bash

echo "=== Fixing Module Compatibility Issues ==="
echo "This script will fix the __esModule validation warning"

# Create a temporary file for babel.config.js
cat > babel.config.temp.js << 'EOF'
module.exports = function(api) {
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

# Create a temporary file for metro.config.js
cat > metro.config.temp.js << 'EOF'
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

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

module.exports = config;
EOF

# Create a temporary package.json without "type": "module"
cp package.json package.json.bak
jq 'del(.type)' package.json > package.json.temp
mv package.json.temp package.json

# Replace the configuration files
mv babel.config.temp.js babel.config.js
mv metro.config.temp.js metro.config.js

echo "Module compatibility issues fixed!"
echo "Now you can run: npx expo start --clear --scheme suitesync"
echo ""
echo "To restore your original configuration after testing, run:"
echo "mv package.json.bak package.json"
