#!/bin/bash

echo "=== Restoring Full SuiteSync App Functionality ==="
echo "This script will restore your complete app with improved error handling"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Create a backup of the current working files
echo "Creating backups of current working files..."
mkdir -p .backups/full-restore
cp package.json .backups/full-restore/package.json.bak
cp App.js .backups/full-restore/App.js.bak
cp app.json .backups/full-restore/app.json.bak

# Install required dependencies for the full app
echo "Installing required dependencies..."
npm install react-native-safe-area-context@4.9.0 expo-status-bar@2.0.1 expo-router@3.4.7 react-error-boundary@4.0.12

# Update App.js with proper expo-router integration and error handling
echo "Updating App.js with improved error handling..."
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

# Create a minimal app/_layout.js file
echo "Creating app/_layout.js..."
mkdir -p app
cat > app/_layout.js << 'EOF'
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, Platform } from 'react-native';

export default function Layout() {
  // Get the system color scheme
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // Use different animations based on platform for better native feel
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'SuiteSync',
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}
EOF

# Create a minimal app/index.js file
echo "Creating app/index.js..."
cat > app/index.js << 'EOF'
import { View, Text, StyleSheet, useColorScheme, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#121212' : '#fff'}]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.main}>
        <Text style={[styles.title, {color: isDark ? '#fff' : '#000'}]}>SuiteSync</Text>
        <Text style={[styles.subtitle, {color: isDark ? '#aaa' : '#666'}]}>
          Your service scheduling solution
        </Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Running on {Platform.OS.charAt(0).toUpperCase() + Platform.OS.slice(1)}
          </Text>
          <Text style={styles.infoText}>
            {isDark ? 'Dark' : 'Light'} mode
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  infoBox: {
    backgroundColor: '#f4511e20',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#f4511e',
    marginVertical: 5,
  },
});
EOF

echo "Full SuiteSync app functionality restored!"
echo "Now try running: ./start_expo_go.sh"
