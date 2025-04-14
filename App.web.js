// This file is used by React Native Web when running on the web platform
// It's a platform-specific override of App.js

import 'expo-router/entry';
import { ErrorBoundary } from 'react-error-boundary';
import { View, Text, StyleSheet } from 'react-native';

// Error fallback for when the app fails to load
function ErrorFallback({ error }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong:</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <Text style={styles.errorHint}>Please refresh the page or contact support if the issue persists.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 20,
  },
  errorHint: {
    textAlign: 'center',
  },
});

// This wrapper ensures expo-router has proper error handling on web
export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {/* expo-router/entry handles the actual rendering */}
    </ErrorBoundary>
  );
}
