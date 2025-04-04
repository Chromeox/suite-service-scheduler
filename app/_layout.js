import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#fff',
          },
          animation: 'slide_from_right',
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
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}
