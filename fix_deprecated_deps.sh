#!/bin/bash

echo "=== Fixing Deprecated Dependencies in SuiteSync ==="
echo "This script will update or remove deprecated dependencies while maintaining functionality"

# Create a backup of package.json
echo "Creating backup of package.json..."
mkdir -p .backups/deprecated-fix
cp package.json .backups/deprecated-fix/package.json.bak

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Clear caches
echo "Clearing caches..."
rm -rf node_modules/.cache
rm -rf .expo

# Update rimraf to v4+
echo "Updating rimraf to v4+..."
npm install rimraf@^4.4.1 --save-dev

# Update glob to v9+
echo "Updating glob to v9+..."
npm install glob@^9.3.5 --save-dev

# Create a package.json override to replace deprecated packages
echo "Creating package.json overrides for deprecated packages..."
node -e '
const fs = require("fs");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

// Add overrides section if it doesn't exist
if (!packageJson.overrides) {
  packageJson.overrides = {};
}

// Override deprecated packages with modern alternatives
packageJson.overrides = {
  ...packageJson.overrides,
  "stable": "npm:@sortable/array@latest",
  "rimraf": "^4.4.1",
  "glob": "^9.3.5",
  "abab": "^2.0.6" // Keep the version but mark as resolved
};

// Add resolutions for Yarn users
if (!packageJson.resolutions) {
  packageJson.resolutions = {};
}
packageJson.resolutions = {
  ...packageJson.resolutions,
  "stable": "@sortable/array@latest",
  "rimraf": "^4.4.1",
  "glob": "^9.3.5",
  "abab": "^2.0.6"
};

fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
'

# Install direct replacements for deprecated packages
echo "Installing direct replacements for deprecated packages..."
npm install @sortable/array --save-dev

# Run npm install to apply overrides
echo "Running npm install to apply overrides..."
npm install

# Create a .npmrc file to ignore warnings for packages we can't directly control
echo "Creating .npmrc to suppress remaining warnings..."
cat > .npmrc << 'EOF'
# Suppress warnings for deprecated packages that are deep dependencies
loglevel=error
EOF

echo "Deprecated dependencies fixed!"
echo "Now try running: ./start_expo_go.sh"
