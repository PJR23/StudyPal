import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Button } from 'react-native';
import {
  getNotificationPermissionStatus,
  requestNotificationPermissions,
  scheduleNotification,
} from '../../services/NotificationService';

export default function Settings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    checkNotificationPermissionStatus();
  }, []);

  const checkNotificationPermissionStatus = async () => {
    const status = await getNotificationPermissionStatus();
    setNotificationsEnabled(status === 'granted');
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const status = await requestNotificationPermissions();
      setNotificationsEnabled(status === 'granted');
    } else {
      setNotificationsEnabled(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      <View style={styles.setting}>
        <Text style={styles.settingText}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
        />
      </View>
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 24,
    marginBottom: 0,
  },
});
