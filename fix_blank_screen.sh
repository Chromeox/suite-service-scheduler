#!/bin/bash

echo "=== SuiteSync Blank Screen Fix ==="
echo "This script will diagnose and fix the blank screen issue in Expo Go"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*expo" || true
pkill -f "node.*vite" || true

# Create a backup of critical files
echo "Creating backups of critical files..."
mkdir -p .backups
cp package.json .backups/package.json.bak
cp App.js .backups/App.js.bak
cp app.json .backups/app.json.bak
cp babel.config.js .backups/babel.config.js.bak
cp metro.config.js .backups/metro.config.js.bak

# Clear caches
echo "Clearing all caches..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf .babel-cache

# Fix App.js to use a minimal configuration
echo "Creating a minimal App.js with visible UI..."
cat > App.js << 'EOF'
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';

// Simple app that doesn't rely on expo-router initially
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log('App mounted');
    
    // Simulate loading process
    setTimeout(() => {
      try {
        // Try to load expo-router
        require('expo-router');
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading expo-router:', err);
        setError(err.message);
      }
    }, 1000);
  }, []);
  
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Error Loading SuiteSync</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.platformInfo}>Platform: {Platform.OS}</Text>
      </View>
    );
  }
  
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={styles.loadingText}>Loading SuiteSync...</Text>
        <Text style={styles.platformInfo}>Platform: {Platform.OS}</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SuiteSync</Text>
      <Text style={styles.subtitle}>Your service scheduling solution</Text>
      <Text style={styles.platformInfo}>Platform: {Platform.OS}</Text>
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
  loadingText: {
    fontSize: 18,
    marginTop: 20,
    color: '#333',
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
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#d32f2f',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 20,
    textAlign: 'center',
  },
  platformInfo: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
});
EOF

# Fix babel.config.js
echo "Updating babel.config.js..."
cat > babel.config.js << 'EOF'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
EOF

# Fix metro.config.js
echo "Updating metro.config.js..."
cat > metro.config.js << 'EOF'
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for importing from outside the app directory
config.watchFolders = [path.resolve(__dirname, '..')];

// Handle various file extensions
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json', 'cjs', 'mjs'];

module.exports = config;
EOF

# Update app.json to ensure it's properly configured
echo "Updating app.json configuration..."
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
      "supportsTablet": true,
      "bundleIdentifier": "com.suitesync.scheduler"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.suitesync.scheduler"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router"
    ],
    "scheme": "suitesync",
    "experiments": {
      "typedRoutes": true
    },
    "runtimeVersion": {
      "policy": "appVersion"
    },
    "updates": {
      "url": "https://u.expo.dev/your-project-id"
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
EOF

# Create a simple entry point for expo-router
echo "Creating a minimal expo-router setup..."
mkdir -p app
cat > app/index.js << 'EOF'
import { View, Text, StyleSheet, Platform } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SuiteSync</Text>
      <Text style={styles.subtitle}>Your service scheduling solution</Text>
      <Text style={styles.platformInfo}>Platform: {Platform.OS}</Text>
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
  platformInfo: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
});
EOF

# Create a minimal _layout.js file
cat > app/_layout.js << 'EOF'
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'SuiteSync',
        }} 
      />
    </Stack>
  );
}
EOF

# Create a platform utility file
echo "Creating platform utility file..."
mkdir -p src/utils
cat > src/utils/platform.js << 'EOF'
import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

export const isExpoGo = () => {
  return (
    !isWeb && 
    process.env.NODE_ENV !== 'production' && 
    !process.env.EXPO_PUBLIC_IS_PRODUCTION
  );
};

export default {
  isWeb,
  isIOS,
  isAndroid,
  isMobile,
  isExpoGo,
};
EOF

# Create a minimal CrossPlatformButton component
echo "Creating CrossPlatformButton component..."
mkdir -p src/components
cat > src/components/CrossPlatformButton.jsx << 'EOF'
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

export default function CrossPlatformButton({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  disabled = false,
}) {
  // Get styles based on variant
  const buttonStyle = variant === 'primary' ? styles.primaryButton : styles.secondaryButton;
  const buttonTextStyle = variant === 'primary' ? styles.primaryText : styles.secondaryText;

  return (
    <TouchableOpacity
      onPress={disabled ? null : onPress}
      style={[
        styles.button,
        buttonStyle,
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled}
    >
      <Text style={[styles.text, buttonTextStyle, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// Styles
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Primary button styles
  primaryButton: {
    backgroundColor: '#f4511e',
  },
  primaryText: {
    color: '#ffffff',
  },
  // Secondary button styles
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#f4511e',
  },
  secondaryText: {
    color: '#f4511e',
  },
});
EOF

echo "Blank screen fix applied!"
echo "Now try running: ./start_expo_go.sh"
