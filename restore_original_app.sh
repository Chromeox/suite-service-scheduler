#!/bin/bash

echo "=== Restoring Original SuiteSync App ==="
echo "This script will restore your original app files"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Restore original package.json if backup exists
if [ -f "package.json.router.bak" ]; then
  echo "Restoring original package.json..."
  cp package.json.router.bak package.json
fi

# Restore original App.js with proper expo-router integration
echo "Restoring original App.js..."
cat > App.js << 'EOF'
import 'expo-router/entry';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// Error fallback component for when the app fails to load
function ErrorFallback({ error, resetErrorBoundary }) {
  console.log('Error caught by ErrorBoundary:', error);
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <Text style={styles.errorInstructions}>
        Please restart the application or contact support if the issue persists.
      </Text>
    </View>
  );
}

// Loading component shown while expo-router initializes
function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f4511e" />
      <Text style={styles.loadingText}>Loading SuiteSync...</Text>
    </View>
  );
}

// Main app component with proper error handling
export default function App() {
  console.log('App component rendering');
  
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
  },
  loadingText: {
    fontSize: 18,
    marginTop: 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorInstructions: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
EOF

# Restore original app/index.js with full functionality
echo "Restoring original app/index.js..."
cat > app/index.js << 'EOF'
import { View, Text, StyleSheet, useColorScheme, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';

// Import our cross-platform utilities and components
import CrossPlatformButton from '../src/components/CrossPlatformButton';
import { isWeb, isExpoGo } from '../src/utils/platform';

export default function Home() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  // Create theme-aware styles
  const themedStyles = useMemo(() => {
    const isDark = colorScheme === 'dark';
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#fff',
      },
      title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        color: isDark ? '#ffffff' : '#000000',
        textAlign: 'center',
      },
      subtitle: {
        fontSize: 18,
        color: isDark ? '#aaaaaa' : '#666666',
        textAlign: 'center',
        marginBottom: 40,
      },
    });
  }, [colorScheme]);
  
  return (
    <SafeAreaView style={[styles.container, themedStyles.container]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <View style={styles.main}>
        <Text style={[styles.title, themedStyles.title]}>SuiteSync</Text>
        <Text style={[styles.subtitle, themedStyles.subtitle]}>Your service scheduling solution</Text>
        
        {isExpoGo() && (
          <View style={styles.infoBox}>
            <Text style={[styles.infoText, { color: colorScheme === 'dark' ? '#ffcc00' : '#664500' }]}>
              Running in Expo Go development mode
            </Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <CrossPlatformButton 
            title="About"
            onPress={() => router.push('/about')}
            variant="primary"
            style={styles.buttonSpacing}
          />
          
          <CrossPlatformButton 
            title="Settings"
            onPress={() => router.push('/settings')}
            variant="outline"
            style={styles.buttonSpacing}
          />
        </View>
        
        {/* Platform-specific message */}
        <Text style={[styles.platformInfo, { color: colorScheme === 'dark' ? '#aaaaaa' : '#666666' }]}>
          Running on {Platform.OS.charAt(0).toUpperCase() + Platform.OS.slice(1)}
        </Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 500,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  buttonSpacing: {
    margin: 10,
    minWidth: 120,
  },
  infoBox: {
    backgroundColor: '#fffbea',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffe58f',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
  },
  platformInfo: {
    marginTop: 40,
    fontSize: 12,
    opacity: 0.7,
  },
});
EOF

# Restore original app/_layout.js
echo "Restoring original app/_layout.js..."
cat > app/_layout.js << 'EOF'
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

// Define theme colors for both light and dark mode
const themes = {
  light: {
    primary: '#f4511e',
    background: '#ffffff',
    text: '#000000',
    headerText: '#ffffff',
  },
  dark: {
    primary: '#d84315',
    background: '#121212',
    text: '#ffffff',
    headerText: '#ffffff',
  }
};

export default function Layout() {
  // Get the system color scheme
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(themes.light);
  
  // Update theme when system color scheme changes
  useEffect(() => {
    setTheme(colorScheme === 'dark' ? themes.dark : themes.light);
  }, [colorScheme]);

  return (
    <SafeAreaProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.primary,
          },
          headerTintColor: theme.headerText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.background,
          },
          // Use different animations based on platform for better native feel
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
          // Improve web accessibility
          ...(Platform.OS === 'web' && {
            headerShown: true,
            headerTitleAlign: 'center',
          }),
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'SuiteSync',
          }} 
        />
        <Stack.Screen 
          name="about" 
          options={{
            title: 'About',
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{
            title: 'Settings',
            // Add animation for settings screen
            animation: 'slide_from_bottom',
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}
EOF

# Create placeholder about and settings pages
echo "Creating placeholder about and settings pages..."
cat > app/about.js << 'EOF'
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function About() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#121212' : '#fff'}]}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: isDark ? '#fff' : '#000'}]}>About SuiteSync</Text>
        <Text style={[styles.text, {color: isDark ? '#ddd' : '#333'}]}>
          SuiteSync is a service scheduling application built with React Native and Expo.
        </Text>
        <Text style={[styles.text, {color: isDark ? '#ddd' : '#333'}]}>
          Version: 1.0.0
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});
EOF

cat > app/settings.js << 'EOF'
import { View, Text, StyleSheet, useColorScheme, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function Settings() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#121212' : '#fff'}]}>
      <View style={styles.content}>
        <Text style={[styles.title, {color: isDark ? '#fff' : '#000'}]}>Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={[styles.settingText, {color: isDark ? '#ddd' : '#333'}]}>
            Enable Notifications
          </Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#f4511e' }}
            thumbColor={notificationsEnabled ? '#f4511e' : '#f4f3f4'}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingText: {
    fontSize: 16,
  },
});
EOF

# Clear the cache and node_modules
echo "Clearing cache..."
rm -rf node_modules/.cache
rm -rf .expo

echo "Original SuiteSync app restored!"
echo "Now try running: ./start_expo_go.sh"
