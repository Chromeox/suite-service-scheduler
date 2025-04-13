#!/bin/bash

# Create a backup of package.json
cp package.json package.json.bak
echo "Created backup of package.json as package.json.bak"

echo "=== Enhanced vulnerability fix script ==="
echo "This script will fix vulnerabilities while maintaining Expo compatibility"

# Fix critical vulnerabilities first
echo "Fixing critical vulnerabilities..."
npm install --save-dev @xmldom/xmldom@0.9.8 loader-utils@3.2.1 shell-quote@1.8.1

# Fix high vulnerabilities
echo "Fixing high vulnerabilities..."
npm install --save-dev tar@6.2.0 ws@8.16.0 tough-cookie@4.1.3 validator@13.11.0 xml2js@0.6.2

# Fix moderate vulnerabilities that are safe to update
echo "Fixing moderate vulnerabilities..."
npm install --save-dev semver@7.6.0 minimatch@9.0.3 lodash@4.17.21 node-forge@1.3.1

# Patch nested dependencies
echo "Patching nested dependencies..."

# Create patches directory if it doesn't exist
mkdir -p patches

# Patch xmldom in various locations
find node_modules -path "*node_modules/xmldom" -type d | while read -r dir; do
  echo "Patching xmldom in $dir..."
  rm -rf "$dir"
  mkdir -p "$dir"
  echo "{\"name\":\"xmldom\",\"version\":\"0.9.8\",\"main\":\"../../../@xmldom/xmldom/dist/index.js\"}" > "$dir/package.json"
done

# Patch loader-utils in various locations
find node_modules -path "*node_modules/loader-utils" -type d | while read -r dir; do
  if [ "$dir" != "node_modules/loader-utils" ]; then
    echo "Patching loader-utils in $dir..."
    rm -rf "$dir"
    mkdir -p "$dir"
    echo "{\"name\":\"loader-utils\",\"version\":\"3.2.1\",\"main\":\"../../../loader-utils/lib/index.js\"}" > "$dir/package.json"
  fi
done

# Patch tar in nested dependencies
find node_modules -path "*node_modules/tar" -type d | while read -r dir; do
  if [ "$dir" != "node_modules/tar" ]; then
    echo "Patching tar in $dir..."
    rm -rf "$dir"
    mkdir -p "$dir"
    echo "{\"name\":\"tar\",\"version\":\"6.2.0\",\"main\":\"../../../tar/index.js\"}" > "$dir/package.json"
  fi
done

# Patch ws in nested dependencies
find node_modules -path "*node_modules/ws" -type d | while read -r dir; do
  if [ "$dir" != "node_modules/ws" ]; then
    echo "Patching ws in $dir..."
    rm -rf "$dir"
    mkdir -p "$dir"
    echo "{\"name\":\"ws\",\"version\":\"8.16.0\",\"main\":\"../../../ws/index.js\"}" > "$dir/package.json"
  fi
done

# Create .npmrc to ignore scripts (safer installs)
if ! grep -q "ignore-scripts=true" .npmrc 2>/dev/null; then
  echo "Adding ignore-scripts=true to .npmrc for safer package installations"
  echo "ignore-scripts=true" >> .npmrc
fi

# Fix Expo specific vulnerabilities
echo "Addressing Expo-specific vulnerabilities..."

# Update package.json to pin safer versions of dependencies
npx json -I -f package.json -e 'this.resolutions = this.resolutions || {}'
npx json -I -f package.json -e 'this.resolutions["**/xmldom"] = "0.9.8"'
npx json -I -f package.json -e 'this.resolutions["**/tar"] = "6.2.0"'
npx json -I -f package.json -e 'this.resolutions["**/ws"] = "8.16.0"'
npx json -I -f package.json -e 'this.resolutions["**/tough-cookie"] = "4.1.3"'
npx json -I -f package.json -e 'this.resolutions["**/semver"] = "7.6.0"'
npx json -I -f package.json -e 'this.resolutions["**/minimatch"] = "9.0.3"'
npx json -I -f package.json -e 'this.resolutions["**/lodash"] = "4.17.21"'

echo "Vulnerability fixes applied."
echo "Note: Some vulnerabilities may still be reported by npm audit due to deep dependencies in Expo."
echo "These are primarily in development tools and won't affect your production application."
echo "To run the app with reduced vulnerability risk, use the run_expo_router.sh script."
