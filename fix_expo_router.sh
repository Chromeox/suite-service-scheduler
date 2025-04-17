#!/bin/bash

echo "=== Fixing Expo Router Configuration ==="
echo "This script will reinstall and configure expo-router properly"

# Create a backup of package.json
cp package.json package.json.router.bak
echo "Created backup of package.json as package.json.router.bak"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Clear the cache
echo "Clearing cache..."
rm -rf node_modules/.cache
rm -rf .expo

# Reinstall expo-router
echo "Reinstalling expo-router..."
npm uninstall expo-router
npm install expo-router@latest

# Create a minimal app.js file that uses expo-router
echo "Creating a minimal App.js file..."
cat > App.js << 'EOF'
import 'expo-router/entry';
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// Simple loading screen component
function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Loading SuiteSync...</Text>
    </View>
  );
}

// Main app component
export default function App() {
  console.log('App component rendering');
  return <LoadingScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    color: '#333',
  },
});
EOF

# Create a minimal index.js file in the app directory
echo "Creating a minimal app/index.js file..."
mkdir -p app
cat > app/index.js << 'EOF'
import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SuiteSync</Text>
      <Text style={styles.subtitle}>Your service scheduling solution</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
});
EOF

echo "Expo Router configuration fixed!"
echo "Now try running: ./start_expo_go.sh"
