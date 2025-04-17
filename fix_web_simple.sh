#!/bin/bash

echo "=== Creating Simple Web Version for SuiteSync ==="
echo "This script will create a simplified web version that works with Expo SDK 52"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Create a backup of critical files
echo "Creating backups of critical files..."
mkdir -p .backups/web-simple
cp package.json .backups/web-simple/package.json.bak
cp app.json .backups/web-simple/app.json.bak
cp babel.config.js .backups/web-simple/babel.config.bak

# Clear caches thoroughly
echo "Clearing caches thoroughly..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf web-build

# Create a simplified App.js that works on web
echo "Creating a simplified App.js that works on web..."
cat > App.js << 'EOF'
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

// Simple app that works on web without complex dependencies
export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SuiteSync</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to SuiteSync</Text>
        <Text style={styles.subtitle}>Your service scheduling solution</Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Running on {Platform.OS.charAt(0).toUpperCase() + Platform.OS.slice(1)}
          </Text>
          <Text style={styles.infoText}>
            Simple Web Version
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>SuiteSync © 2025</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#f4511e',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  infoText: {
    fontSize: 16,
    color: '#f4511e',
    marginVertical: 5,
  },
  footer: {
    backgroundColor: '#333',
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
  },
});
EOF

# Create a simplified babel.config.js
echo "Creating a simplified babel.config.js..."
cat > babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [],
  };
};
EOF

# Create a simplified app.json
echo "Creating a simplified app.json..."
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
      "favicon": "./assets/favicon.png"
    }
  }
}
EOF

# Create a web-specific package.json
echo "Creating a web-specific package.json..."
cat > package.json << 'EOF'
{
  "name": "suite-service-scheduler",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-status-bar": "~2.0.1",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-native": "0.76.9",
    "react-native-web": "~0.19.10"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}
EOF

# Install dependencies
echo "Installing dependencies..."
npm install

echo "Simple web version created!"
echo "Now try running: npm run web"
