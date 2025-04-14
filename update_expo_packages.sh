#!/bin/bash

# Create a backup of package.json
cp package.json package.json.update.bak
echo "Created backup of package.json as package.json.update.bak"

echo "=== Updating Expo and Related Packages ==="
echo "This script will update all Expo packages to modern versions"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Remove the package-lock.json to ensure clean installs
echo "Removing package-lock.json for clean installs..."
rm -f package-lock.json

# Update core Expo packages
echo "Updating core Expo packages..."
npm install --save expo@latest expo-router@latest expo-constants@latest expo-linking@latest expo-status-bar@latest

# Update Expo development tools
echo "Updating Expo development tools..."
npm install --save-dev @expo/webpack-config@latest @expo/metro-config@latest

# Remove outdated expo-cli
echo "Removing outdated expo-cli..."
npm uninstall expo-cli
npm install --save-dev eas-cli@latest

# Update React Native and related packages
echo "Updating React Native and related packages..."
npm install --save react-native@latest react-native-reanimated@latest react-native-safe-area-context@latest react-native-screens@latest

# Update React and React DOM
echo "Updating React and React DOM..."
npm install --save react@latest react-dom@latest

# Update Babel and Metro
echo "Updating Babel and Metro..."
npm install --save babel-preset-expo@latest
npm install --save metro@latest metro-core@latest metro-runtime@latest metro-source-map@latest

# Update additional Expo packages
echo "Updating additional Expo packages..."
npm install --save expo-dev-client@latest expo-updates@latest

# Update package.json scripts
echo "Updating package.json scripts..."
npx json -I -f package.json -e 'this.scripts["start"] = "expo start"'
npx json -I -f package.json -e 'this.scripts["android"] = "expo start --android"'
npx json -I -f package.json -e 'this.scripts["ios"] = "expo start --ios"'
npx json -I -f package.json -e 'this.scripts["web"] = "expo start --web"'

# Update app.json with modern configuration
echo "Updating app.json with modern configuration..."
cat > app.json << 'EOF'
{
  "expo": {
    "name": "SuiteSync",
    "slug": "suitesync",
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
      "supportsTablet": true,
      "bundleIdentifier": "com.lovable.suitesync"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.lovable.suitesync"
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
      "typedRoutes": true,
      "tsconfigPaths": true
    },
    "extra": {
      "eas": {
        "projectId": "suitesync-app"
      }
    }
  }
}
EOF

# Update babel.config.js for modern Expo
echo "Updating babel.config.js for modern Expo..."
cat > babel.config.js << 'EOF'
export default function(api) {
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

# Update metro.config.js for modern Expo
echo "Updating metro.config.js for modern Expo..."
cat > metro.config.js << 'EOF'
// Learn more https://docs.expo.io/guides/customizing-metro
import { getDefaultConfig } from 'expo/metro-config.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for importing from the app directory
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs'];
config.resolver.assetExts = [...config.resolver.assetExts, 'db'];
config.watchFolders = [...(config.watchFolders || []), './app'];

// Improve Metro configuration for better performance
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

export default config;
EOF

# Create a modern tsconfig.json if it doesn't exist or update it
echo "Updating TypeScript configuration..."
cat > tsconfig.json << 'EOF'
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@app/*": ["./app/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
EOF

# Install additional modern dependencies
echo "Installing additional modern dependencies..."
npm install --save react-native-svg@latest react-native-svg-transformer@latest

# Clean up node_modules and reinstall
echo "Cleaning up node_modules and reinstalling dependencies..."
rm -rf node_modules
npm install

echo "Expo packages update complete!"
echo "To start your modernized Expo app, run: npm start"
