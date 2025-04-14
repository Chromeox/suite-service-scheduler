/**
 * Cross-platform entry point for SuiteSync
 * This file serves as the main entry point for the web version of the app
 * while App.js serves as the entry point for the Expo/mobile version
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Platform } from 'react-native';
import 'expo-router/entry';

// Polyfill for React Native Web
if (Platform.OS === 'web') {
  // Apply any web-specific polyfills or configurations here
  // This helps bridge the gap between React Native and web
  
  // Initialize the web app when running in browser environment
  const container = document.getElementById('root');
  if (container) {
    const root = createRoot(container);
    
    // We don't need to render anything here because expo-router/entry
    // will handle the rendering through the App.js entry point
    root.render(
      <React.StrictMode>
        {/* expo-router/entry handles the actual rendering */}
      </React.StrictMode>
    );
  }
}

// For non-web platforms, this file is not used directly
// Instead, App.js is the entry point for Expo/React Native
