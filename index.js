import { registerRootComponent } from 'expo';
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

// Minimal diagnostic component
function DiagnosticApp() {
  console.log('DiagnosticApp rendering');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SuiteSync Diagnostic</Text>
      <Text style={styles.subtitle}>This is a minimal test screen.</Text>
      <Text style={styles.info}>If you can see this, the basic React Native setup is working.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});

// Register the diagnostic component as the root component
registerRootComponent(DiagnosticApp);
