import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, Platform } from 'react-native';

export default function Layout() {
  // Get the system color scheme
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // Use different animations based on platform for better native feel
          animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'SuiteSync',
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}
