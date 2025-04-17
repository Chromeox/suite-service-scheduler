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
