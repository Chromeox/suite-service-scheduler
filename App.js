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
