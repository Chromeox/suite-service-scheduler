import 'expo-router/entry';
import { ErrorBoundary } from 'react-error-boundary';
import { Text, View, StyleSheet } from 'react-native';

// Error fallback for when the app fails to load
function ErrorFallback({ error }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong:</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <Text style={styles.errorInstructions}>Please restart the application or contact support if the issue persists.</Text>
    </View>
  );
}

// This component will be shown while expo-router is initializing
function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Loading SuiteSync...</Text>
    </View>
  );
}

// Main app component with proper error handling
export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
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
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  errorMessage: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorInstructions: {
    color: '#555',
    textAlign: 'center',
  },
});
