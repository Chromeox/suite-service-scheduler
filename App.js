import 'expo-router/entry';
import { ErrorBoundary } from 'react-error-boundary';
import { Text, View } from 'react-native';

// This file is the entry point for Expo
// The actual app is loaded through expo-router

// Error fallback for when the app fails to load
function ErrorFallback({ error }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Something went wrong:</Text>
      <Text style={{ color: 'red', marginBottom: 20 }}>{error.message}</Text>
      <Text>Please restart the application or contact support if the issue persists.</Text>
    </View>
  );
}

// This wrapper isn't directly used but ensures expo-router has proper error handling
export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {/* expo-router/entry handles the actual rendering */}
    </ErrorBoundary>
  );
}
