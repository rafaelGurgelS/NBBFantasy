import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { Tabs } from 'expo-router';
import { FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <NativeBaseProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FC9904',
          headerShown: false, // Remover o cabeçalho das Tabs
        }}
        initialRouteName="home"
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home-outline" color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="escalacao"
          options={{
            title: 'Escalação', 
            tabBarIcon: ({ color }) => <FontAwesome name="user-plus" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="ranking"
          options={{
            title: 'Ligas',
            tabBarIcon: ({ color }) => <Ionicons name="trophy-outline" color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="partidas"
          options={{
            title: 'Partidas',
            tabBarIcon: ({ color }) => <MaterialIcons name="sports-basketball" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="premium"
          options={{
            title: 'Premium',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="crown" size={24} color={color} />,
          }}
        />
      </Tabs>
    </NativeBaseProvider>
  );
}
