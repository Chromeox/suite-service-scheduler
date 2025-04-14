#!/bin/bash

# Create a backup of package.json
cp package.json package.json.expo.bak
echo "Created backup of package.json as package.json.expo.bak"

echo "=== Expo Web Preview Fix Script ==="
echo "This script will fix dependencies and configuration for Expo web preview"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*vite" || true
pkill -f "node.*expo" || true

# Fix metro configuration
echo "Fixing metro configuration..."
if grep -q "metro-config';" metro.config.js; then
  echo "Updating import path in metro.config.js..."
  sed -i '' "s/metro-config';/metro-config.js';/" metro.config.js
fi

# Install required dependencies for Expo web
echo "Installing required dependencies for Expo web..."
npm install --save-dev graphql@15.8.0 subscriptions-transport-ws@0.11.0

# Fix version conflicts with specific resolutions
echo "Adding resolutions to package.json..."
npx json -I -f package.json -e 'this.resolutions = this.resolutions || {}'
npx json -I -f package.json -e 'this.resolutions["**/ws"] = "8.16.0"'
npx json -I -f package.json -e 'this.resolutions["**/graphql"] = "15.8.0"'
npx json -I -f package.json -e 'this.resolutions["**/subscriptions-transport-ws"] = "0.11.0"'

# Create necessary symlinks for graphql modules
echo "Creating symlinks for graphql modules..."
mkdir -p node_modules/graphql/language
if [ ! -f node_modules/graphql/language/printer.js ]; then
  echo "Creating printer.js symlink..."
  echo "module.exports = require('graphql').print;" > node_modules/graphql/language/printer.js
fi

# Fix Expo CLI compatibility
echo "Fixing Expo CLI compatibility..."
# Create a compatibility layer for subscriptions-transport-ws
mkdir -p node_modules/subscriptions-transport-ws/dist
if [ ! -d node_modules/subscriptions-transport-ws/dist/client.js ]; then
  echo "Creating compatibility layer for subscriptions-transport-ws..."
  cat > node_modules/subscriptions-transport-ws/dist/client.js << 'EOF'
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql = require("graphql");
// Simple compatibility layer
exports.print = graphql.print;
exports.default = {
  print: graphql.print
};
EOF
fi

# Fix potential issues with the app.json configuration
echo "Checking app.json configuration..."
if [ -f app.json ]; then
  # Ensure web configuration is present
  npx json -I -f app.json -e 'this.expo = this.expo || {}; this.expo.web = this.expo.web || {}'
  npx json -I -f app.json -e 'this.expo.web.bundler = "metro"'
fi

# Clean npm cache and reinstall dependencies
echo "Cleaning npm cache and reinstalling dependencies..."
npm cache clean --force
npm install

echo "Expo web preview fixes applied."
echo "To start the Expo web preview, run: npm run expo:web"
echo "If you encounter any issues, try running 'npx expo start --web' directly."
