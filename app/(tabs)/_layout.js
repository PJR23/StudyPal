import { Tabs } from 'expo-router';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Layout() {
  return (
    <Tabs 
    screenOptions={{
                    tabBarHideOnKeyboard: true
                }}
     >
   
    <Tabs.Screen 
      name="index" 
      options={{ 
        title: 'Home', 
        tabBarIcon: ({color}) => (
          <Ionicons 
            name="home" 
            size={32} 
            color={color}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 15,
        },
        tabBarStyle: {
          height: 60,
        },
        headerShown: false, 
      }} 
    />
    <Tabs.Screen 
      name="createSet" 
      options={{ 
        title: 'Create', 
        tabBarIcon: ({color}) => (
          <Ionicons 
            name="add-circle" 
            size={32} 
            color={color}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 15,
        },
        tabBarStyle: {
          height: 60,
        },
        headerShown: false, 
      }} 
    />
    <Tabs.Screen 
      name="settings" 
      options={{  
        title: 'Settings', 
        tabBarIcon: ({ color }) => (
          <Ionicons
            size={32}
            style={{ marginBottom: -3 }}
            name="settings"
            color={color}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 15,
        },
        tabBarStyle: {
          height: 60,
        },
        headerShown: false, 
      }} 
    />
    <Tabs.Screen 
      name="learnMode" 
      options={{  
        href: null,
        tabBarStyle: {
            height: 60,
          },
          headerShown: false
      }} 
    />
    <Tabs.Screen 
      name="createCard" 
      options={{  
        href: null,
        tabBarStyle: {
            height: 60,
          },
          headerShown: false
      }} 
    />
    </Tabs>
  );
}
