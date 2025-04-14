#!/bin/bash

# Create a backup of package.json
cp package.json package.json.rn-update.bak
echo "Created backup of package.json as package.json.rn-update.bak"

echo "=== Updating React Native and Related Packages ==="
echo "This script will update React Native while maintaining Expo compatibility"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Check current Expo SDK version
EXPO_VERSION=$(node -e "console.log(require('./package.json').dependencies.expo)")
echo "Current Expo version: $EXPO_VERSION"

# Determine the compatible React Native version based on Expo SDK
# Expo SDK 52 is compatible with React Native 0.76.x
echo "Determining compatible React Native version for Expo $EXPO_VERSION..."
if [[ $EXPO_VERSION == *"52"* ]]; then
  RN_VERSION="0.76.7"
  echo "Compatible React Native version: $RN_VERSION"
else
  echo "Using current React Native version for compatibility"
  RN_VERSION=$(node -e "console.log(require('./package.json').dependencies['react-native'])")
fi

# Update React Native and related packages
echo "Updating React Native to version $RN_VERSION..."
npm install --save react-native@$RN_VERSION

# Update React Native related packages
echo "Updating React Native related packages..."
npm install --save react-native-reanimated@latest react-native-safe-area-context@latest react-native-screens@latest react-native-web@latest

# Update React packages to match React Native version
echo "Updating React to match React Native version..."
npm install --save react@18.3.1 react-dom@18.3.1

# Update babel plugins for React Native
echo "Updating Babel plugins for React Native..."
npm install --save-dev @babel/core@latest @babel/runtime@latest

# Create a patch for React Native to maintain compatibility with your fixes
echo "Creating compatibility patches..."
mkdir -p patches/react-native

# Create a patch file for React Native to ensure compatibility with your vulnerability fixes
cat > patches/react-native+$RN_VERSION.patch << 'EOF'
diff --git a/node_modules/react-native/package.json b/node_modules/react-native/package.json
index xxxxxxx..yyyyyyy 100644
--- a/node_modules/react-native/package.json
+++ b/node_modules/react-native/package.json
@@ -155,7 +155,7 @@
     "stacktrace-parser": "^0.1.10",
     "use-sync-external-store": "^1.2.0",
     "whatwg-fetch": "^3.0.0",
-    "ws": "^6.2.2",
+    "ws": "^8.16.0",
     "yargs": "^17.6.2"
   },
   "codegenConfig": {
EOF

# Install patch-package to apply the patch
echo "Installing patch-package..."
npm install --save-dev patch-package postinstall-postinstall

# Add postinstall script to package.json to apply patches
echo "Adding postinstall script to package.json..."
npx json -I -f package.json -e 'this.scripts.postinstall = "patch-package"'

# Apply the patch
echo "Applying patches..."
npx patch-package react-native

# Update package.json with the new React Native version
echo "Updating package.json with new React Native version..."
npx json -I -f package.json -e 'this.dependencies["react-native"] = "'$RN_VERSION'"'

# Apply vulnerability fixes
echo "Applying vulnerability fixes..."
./enhanced_fix_vulnerabilities.sh

echo "React Native update complete!"
echo "React Native version: $RN_VERSION"
echo ""
echo "To test your updated app, run: npm run expo:start -- --clear"
