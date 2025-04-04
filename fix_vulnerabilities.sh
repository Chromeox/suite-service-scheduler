#!/bin/bash

# Create a backup of package.json
cp package.json package.json.backup

echo "Fixing critical vulnerabilities..."

# Install specific versions of packages with critical vulnerabilities
npm install --save-dev immer@10.0.3 loader-utils@3.2.1 shell-quote@1.8.1 @xmldom/xmldom@0.9.0

# Install specific versions of packages with high vulnerabilities
npm install --save-dev tar@6.2.0 ws@8.16.0 tough-cookie@4.1.3 validator@13.11.0 xml2js@0.6.2

# Update nested dependencies with vulnerabilities
echo "Patching nested dependencies..."

# Create patches directory if it doesn't exist
mkdir -p patches

# Create patch for xmldom in @expo/plist
if [ -d "node_modules/@expo/xdl/node_modules/@expo/plist/node_modules/xmldom" ]; then
  echo "Patching @expo/plist xmldom..."
  rm -rf node_modules/@expo/xdl/node_modules/@expo/plist/node_modules/xmldom
  mkdir -p node_modules/@expo/xdl/node_modules/@expo/plist/node_modules/xmldom
  echo "{\"name\":\"xmldom\",\"version\":\"0.9.0\",\"main\":\"../../../../../@xmldom/xmldom/dist/index.js\"}" > node_modules/@expo/xdl/node_modules/@expo/plist/node_modules/xmldom/package.json
fi

# Create patch for loader-utils in react-dev-utils
if [ -d "node_modules/react-dev-utils/node_modules/loader-utils" ]; then
  echo "Patching react-dev-utils loader-utils..."
  rm -rf node_modules/react-dev-utils/node_modules/loader-utils
  mkdir -p node_modules/react-dev-utils/node_modules/loader-utils
  echo "{\"name\":\"loader-utils\",\"version\":\"3.2.1\",\"main\":\"../../../loader-utils/lib/index.js\"}" > node_modules/react-dev-utils/node_modules/loader-utils/package.json
fi

# Create patch for shell-quote
if [ -d "node_modules/shell-quote" ]; then
  echo "Patching shell-quote..."
  npm install --save-dev shell-quote@1.8.1
fi

echo "Vulnerability fixes applied. Some vulnerabilities may still be reported by npm audit due to deep dependencies."
echo "To run the app with reduced vulnerability risk, use the run_expo_router.sh script."
