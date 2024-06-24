import React, { useState, useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { useNavigationState } from '@react-navigation/native';

const routeTitles = {
  home: 'Home',
  escalacao: 'Escalação',
  ranking: 'Ranking',
  partidas: 'Partidas',
  premium: 'Premium',
  conta: 'Minha Conta',
  time: 'Meu Time',
  '(tabs)': 'Home', // Define o título inicial para as tabs
};

export default function DrawerLayout() {
  const [headerTitle, setHeaderTitle] = useState('Home'); // Define "Home" como título inicial
  const state = useNavigationState((state) => state);

  useEffect(() => {
    const findActiveRoute = (state) => {
      if (!state || !state.routes) return '(tabs)';
      const route = state.routes[state.index];
      if (route.state) {
        return findActiveRoute(route.state);
      }
      return route.name;
    };

    const activeRoute = findActiveRoute(state);

    // Verifique se o título atual é '(drawer)' e ajuste para o título inicial correto
    if (activeRoute === '(drawer)' || activeRoute === '(tabs)') {
      setHeaderTitle('Home');
    } else {
      setHeaderTitle(routeTitles[activeRoute] || activeRoute);
    }
  }, [state]);

  return (
    <Drawer
      screenOptions={{
        headerTitle: headerTitle,
        headerTitleAlign: 'center',
        headerStyle: {
          borderBottomWidth: 2,
          borderBottomColor: '#FC9904',
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerItemStyle: { display: 'none' },
          drawerLabel: 'Tabs',
          drawerActiveBackgroundColor: '#FC9904',
        }}
      />
      <Drawer.Screen
        name="conta"
        options={{
          drawerLabel: 'Minha Conta',
          drawerActiveBackgroundColor: '#FC9904',
        }}
      />
      <Drawer.Screen
        name="time"
        options={{
          drawerLabel: 'Meu Time',
          drawerActiveBackgroundColor: '#FC9904',
        }}
      />
    </Drawer>
  );
}
