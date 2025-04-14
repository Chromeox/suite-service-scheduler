#!/bin/bash

echo "=== Fixing WebSocket Module Issue ==="
echo "This script will fix the missing @react-native/ws module issue"

# Create the necessary directory structure
echo "Creating directory structure for @react-native/ws..."
mkdir -p node_modules/@react-native/ws

# Create a package.json file that points to the ws module
echo "Creating package.json for @react-native/ws..."
cat > node_modules/@react-native/ws/package.json << 'EOF'
{
  "name": "@react-native/ws",
  "version": "1.0.0",
  "main": "../../ws/index.js"
}
EOF

# Create an index.js file that re-exports the ws module
echo "Creating index.js for @react-native/ws..."
cat > node_modules/@react-native/ws/index.js << 'EOF'
module.exports = require('ws');
EOF

echo "WebSocket module fix applied!"
echo "Now you can run: npm run expo:start -- --clear"
