#!/bin/bash

# Create a backup of package.json
cp package.json package.json.cross-platform.bak
echo "Created backup of package.json as package.json.cross-platform.bak"

echo "=== Cross-Platform Compatibility Setup ==="
echo "This script will set up your project for React & Expo Go compatibility on Web & Mobile"

# Stop any running servers
echo "Stopping any running servers..."
pkill -f "node.*vite" || true
pkill -f "node.*expo" || true

# Install necessary dependencies for cross-platform compatibility
echo "Installing React Native Web dependencies..."
npm install --save react-native-web@0.19.10 react-native-safe-area-context@4.12.0

echo "Installing Expo web support..."
npm install --save @expo/webpack-config@19.0.0

echo "Installing development dependencies for cross-platform support..."
npm install --save-dev @swc/plugin-react-native@0.3.9

# Update package.json to include web-specific configurations
echo "Updating package.json with web-specific configurations..."
npx json -I -f package.json -e 'this.resolutions = this.resolutions || {}'
npx json -I -f package.json -e 'this.resolutions["**/react-native-web"] = "0.19.10"'

# Create platform-specific entry points if they don't exist
echo "Setting up platform-specific entry points..."
mkdir -p public

# Create a proper index.html for web if it doesn't exist or needs updating
if [ -f index.html ]; then
  echo "Updating existing index.html..."
else
  echo "Creating index.html for web..."
  cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/assets/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#f4511e" />
    <title>SuiteSync</title>
    <style>
      html, body, #root {
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      /* Ensure proper viewport handling on mobile devices */
      @supports (padding: max(0px)) {
        body {
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.js"></script>
  </body>
</html>
EOF
fi

# Create a .web.js version of App.js for web-specific logic
echo "Creating web-specific App version..."
cat > App.web.js << 'EOF'
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
EOF

# Create a web-specific babel.config.js
echo "Creating web-specific babel configuration..."
cat > babel.config.web.js << 'EOF'
export default function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
    ],
  };
};
EOF

echo "Setting up cross-platform environment variables..."
if [ ! -f .env ]; then
  echo "Creating .env file..."
  cat > .env << 'EOF'
# Cross-platform environment variables
EXPO_PUBLIC_APP_VARIANT=development
EXPO_PUBLIC_IS_WEB=false
EOF
fi

echo "Creating platform detection utility..."
mkdir -p src/utils
cat > src/utils/platform-detect.js << 'EOF'
/**
 * Enhanced platform detection utilities
 */
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Basic platform detection
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isMobile = isIOS || isAndroid;

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Expo environment detection
export const isExpo = Constants?.executionEnvironment === 'storeClient' || 
                      Constants?.executionEnvironment === 'standalone';
export const isExpoGo = Constants?.executionEnvironment === 'storeClient';
export const isExpoWeb = isWeb && (typeof Constants !== 'undefined');

// Detailed environment reporting
export const getEnvironmentInfo = () => {
  return {
    platform: Platform.OS,
    version: Platform.Version,
    isExpo,
    isExpoGo,
    isExpoWeb,
    isDevelopment,
    isProduction,
    constants: Constants,
  };
};

export default {
  isWeb,
  isIOS,
  isAndroid,
  isMobile,
  isDevelopment,
  isProduction,
  isExpo,
  isExpoGo,
  isExpoWeb,
  getEnvironmentInfo,
};
EOF

echo "Cross-platform setup complete!"
echo "To run the web version: npm run dev"
echo "To run the Expo Go version: npm run expo:start"
echo "If you encounter any issues, try running the fix_preview_dependencies.sh script"
