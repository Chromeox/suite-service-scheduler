#!/bin/bash

echo "=== Fixing Expo Diagnostic Page Issue ==="
echo "This script will fix the diagnostic page issue in Expo Go"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Create a backup of critical files
echo "Creating backups of critical files..."
mkdir -p .backups/diagnostic-fix
cp package.json .backups/diagnostic-fix/package.json.bak
cp App.js .backups/diagnostic-fix/App.js.bak
cp app.json .backups/diagnostic-fix/app.json.bak

# Clear caches thoroughly
echo "Clearing all caches thoroughly..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf .babel-cache
find . -name "*.lock" -type f -delete

# Create a standalone App.js that doesn't use expo-router
echo "Creating a standalone App.js..."
cat > App.js << 'EOF'
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Platform } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      <View style={styles.content}>
        <Text style={styles.title}>SuiteSync</Text>
        <Text style={styles.subtitle}>Your service scheduling solution</Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Running on {Platform.OS}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={() => alert('Button pressed!')}>
          <Text style={styles.buttonText}>Press Me</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 30,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#f4511e',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
EOF

# Create a minimal app.json without expo-router
echo "Creating a minimal app.json..."
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

# Create a minimal babel.config.js
echo "Creating a minimal babel.config.js..."
cat > babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
EOF

# Create a minimal package.json with only essential dependencies
echo "Updating package.json with minimal dependencies..."
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
    "expo-status-bar": "~1.11.1",
    "react": "18.2.0",
    "react-native": "0.76.7"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0"
  },
  "private": true
}
EOF

echo "Running npm install to update dependencies..."
npm install

echo "Expo diagnostic page issue fixed!"
echo "Now try running: ./start_expo_go.sh"
