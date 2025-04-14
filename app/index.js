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
