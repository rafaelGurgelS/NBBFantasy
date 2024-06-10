import React from 'react';
import { NativeBaseProvider, Box } from 'native-base';
import { Tabs } from 'expo-router';
import { FontAwesome, Ionicons, MaterialIcons ,MaterialCommunityIcons} from '@expo/vector-icons';

// Tab Layout usando Expo Router
export default function TabLayout() {
  return (
    <NativeBaseProvider>
      <Tabs
        screenOptions={{ tabBarActiveTintColor: '#FC9904', 
        headerTitleAlign: 'center',
        headerStyle: {
          borderBottomWidth: 2, // Espessura da linha
          borderBottomColor: '#FC9904', // Cor laranja para a linha
        },
       }}
        initialRouteName="(drawer)"
      >
        <Tabs.Screen
          name="(drawer)"
          options={{
            headerShown: false,
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
            title: 'Ranking',
            tabBarIcon: ({ color }) => <Ionicons name="trophy-outline" color={color} size={24} />,
          }}
        />
        <Tabs.Screen
          name="partidas"
          options={{
            title: 'Partidas',
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="sports-basketball" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="premium"
          options={{
            title: 'Premium',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="crown" size={24} color={color} />
            ),
          }}
        />

      </Tabs>
    </NativeBaseProvider>
  );
}
