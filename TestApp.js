import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// A minimal test app that doesn't use expo-router
export default function TestApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SuiteSync Test Screen</Text>
      <Text style={styles.subtitle}>If you can see this, the basic React Native setup is working.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
