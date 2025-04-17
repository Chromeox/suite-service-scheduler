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
