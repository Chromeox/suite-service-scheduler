#!/bin/bash

# Create a backup of package.json
cp package.json package.json.preview.bak
echo "Created backup of package.json as package.json.preview.bak"

echo "=== Preview Dependencies Fix Script ==="
echo "This script will fix dependencies required for web preview functionality"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*vite" || true
pkill -f "node.*expo" || true

# Install graphql dependencies for Expo CLI
echo "Installing graphql dependencies for Expo CLI..."
npm install --save-dev graphql@15.8.0

# Fix the ws package issues
echo "Fixing ws package issues..."
# Install the latest version as a dev dependency
npm install --save-dev ws@8.16.0

# Add resolutions to enforce consistent versions
echo "Adding resolutions to package.json..."
npx json -I -f package.json -e 'this.resolutions = this.resolutions || {}'
npx json -I -f package.json -e 'this.resolutions["**/ws"] = "8.16.0"'
npx json -I -f package.json -e 'this.resolutions["**/graphql"] = "15.8.0"'

# Fix subscriptions-transport-ws dependency
echo "Fixing subscriptions-transport-ws dependency..."
npm install --save-dev subscriptions-transport-ws@0.11.0

# Patch nested ws dependencies
echo "Patching nested ws dependencies..."
find node_modules -path "*node_modules/ws" -type d | while read -r dir; do
  if [ "$dir" != "node_modules/ws" ]; then
    echo "Patching ws in $dir..."
    rm -rf "$dir"
    mkdir -p "$dir"
    echo "{\"name\":\"ws\",\"version\":\"8.16.0\",\"main\":\"../../../ws/index.js\"}" > "$dir/package.json"
  fi
done

# Create symlinks for graphql modules
echo "Creating symlinks for graphql modules..."
mkdir -p node_modules/graphql/language
if [ ! -f node_modules/graphql/language/printer.js ]; then
  echo "Creating printer.js symlink..."
  # Check if the file exists in the installed graphql package
  if [ -f node_modules/graphql/language/printer.js ]; then
    echo "printer.js already exists, no need to create symlink"
  else
    # Create a simple export that points to the right module
    echo "module.exports = require('graphql').print;" > node_modules/graphql/language/printer.js
  fi
fi

# Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

# Reinstall dependencies to ensure consistency
echo "Reinstalling dependencies..."
npm install

echo "Preview dependency fixes applied."
echo "To start the web preview, run: npm run dev"
echo "If you encounter any issues, you may need to restart your terminal or run 'npm install' again."
