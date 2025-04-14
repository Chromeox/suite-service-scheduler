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
