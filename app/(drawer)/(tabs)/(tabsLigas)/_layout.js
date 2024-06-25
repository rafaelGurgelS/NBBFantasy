import React from 'react';
import { NativeBaseProvider } from 'native-base';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Friends from './friends';
import Leagues from './leagues';

const Tab = createMaterialTopTabNavigator();

export default function TabLayout() {
  return (
    <NativeBaseProvider>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#FC9904',
          tabBarIndicatorStyle: { backgroundColor: '#FC9904' },
          tabBarStyle: { backgroundColor: 'white' },
        }}
      >
        <Tab.Screen
          name="MinhasLigas"
          component={Leagues}
          options={{ title: 'Minhas Ligas' }}
        />
        <Tab.Screen
          name="MeusAmigos"
          component={Friends}
          options={{ title: 'Meus Amigos' }}
        />
      </Tab.Navigator>
    </NativeBaseProvider>
  );
}
