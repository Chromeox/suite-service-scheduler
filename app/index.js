import { View, Text, StyleSheet, useColorScheme, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function Home() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: isDark ? '#121212' : '#fff'}]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.main}>
        <Text style={[styles.title, {color: isDark ? '#fff' : '#000'}]}>SuiteSync</Text>
        <Text style={[styles.subtitle, {color: isDark ? '#aaa' : '#666'}]}>
          Your service scheduling solution
        </Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Running on {Platform.OS.charAt(0).toUpperCase() + Platform.OS.slice(1)}
          </Text>
          <Text style={styles.infoText}>
            {isDark ? 'Dark' : 'Light'} mode
          </Text>
        </View>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  infoBox: {
    backgroundColor: '#f4511e20',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#f4511e',
    marginVertical: 5,
  },
});
