#!/bin/bash

echo "=== Fixing Web Bundling Issues in SuiteSync ==="
echo "This script will fix web bundling issues and ensure proper web configuration"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Create a backup of critical files
echo "Creating backups of critical files..."
mkdir -p .backups/web-fix
cp package.json .backups/web-fix/package.json.bak
cp app.json .backups/web-fix/app.json.bak
cp babel.config.js .backups/web-fix/babel.config.js.bak

# Clear caches thoroughly
echo "Clearing caches thoroughly..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf web-build

# Install all necessary web dependencies
echo "Installing necessary web dependencies..."
npm install react-dom@18.3.1 react-native-web@~0.19.10 @expo/webpack-config@~19.0.1

# Create a proper webpack config for web
echo "Creating proper webpack configuration..."
mkdir -p webpack
cat > webpack/webpack.config.js << 'EOF'
const createExpoWebpackConfig = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfig(env, argv);
  
  // Add any custom webpack configurations here
  
  return config;
};
EOF

# Update babel.config.js to ensure proper web support
echo "Updating babel.config.js..."
cat > babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
EOF

# Create a proper index.html template for web
echo "Creating index.html template for web..."
mkdir -p web
cat > web/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <title>SuiteSync</title>
    <style>
      html, body, #root {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }
      #root {
        display: flex;
        flex-direction: column;
      }
    </style>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF

# Create a proper App.js that works reliably on web
echo "Creating a reliable App.js for web..."
cat > App.js << 'EOF'
import 'expo-router/entry';
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';

// Error fallback component for when the app fails to load
function ErrorFallback({ error, resetErrorBoundary }) {
  console.log('Error caught by ErrorBoundary:', error);
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <Text style={styles.errorDetails}>Platform: {Platform.OS}</Text>
      <Text style={styles.errorInstructions}>
        Please restart the application or contact support if the issue persists.
      </Text>
    </View>
  );
}

// Loading component shown while expo-router initializes
function LoadingScreen() {
  const [dots, setDots] = useState('.');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f4511e" />
      <Text style={styles.loadingText}>Loading SuiteSync{dots}</Text>
      <Text style={styles.platformInfo}>Platform: {Platform.OS}</Text>
    </View>
  );
}

// Main app component with proper error handling
export default function App() {
  console.log('App component rendering on', Platform.OS);
  
  // This ensures any errors in the app are caught and displayed
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.log('Error caught by ErrorBoundary:', error, info);
      }}
    >
      <LoadingScreen />
      {/* expo-router/entry will take over once initialized */}
    </ErrorBoundary>
  );
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 20,
    color: '#333',
  },
  platformInfo: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#d32f2f',
  },
  errorMessage: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  errorInstructions: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
EOF

# Create a proper metro.config.js
echo "Creating proper metro.config.js..."
cat > metro.config.js << 'EOF'
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for importing from outside the app directory
config.watchFolders = [path.resolve(__dirname, '..')];

// Handle various file extensions
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json', 'cjs', 'mjs'];

// Ensure proper asset handling
config.resolver.assetExts = [...config.resolver.assetExts, 'db', 'sqlite'];

// Enable symlinks
config.resolver.enableSymlinks = true;

module.exports = config;
EOF

# Create a proper app.json with web configuration
echo "Updating app.json with proper web configuration..."
cat > app.json << 'EOF'
{
  "expo": {
    "name": "SuiteSync",
    "slug": "suite-service-scheduler",
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
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router"
    ],
    "scheme": "suitesync"
  }
}
EOF

# Run npm install to ensure all dependencies are properly installed
echo "Running npm install to ensure all dependencies are properly installed..."
npm install

echo "Web bundling issues fixed!"
echo "Now try running: npm run web"
