import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { initializeDatabase } from './src/services/db';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import CreateCard from './app/(tabs)/createCard';
import LearnMode from './app/(tabs)/learnMode';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="CreateCard" component={CreateCard} />
        <Tab.Screen name="LearnMode" component={LearnMode} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
