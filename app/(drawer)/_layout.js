import React, { useState, useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { useNavigationState } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font'; // Import para carregar a fonte
import AppLoading from 'expo-app-loading'; // Para tela de carregamento enquanto a fonte é carregada

const routeTitles = {
  home: 'Home',
  escalacao: 'Escalação',
  '(tabsLigas)': 'Minhas ligas',
  partidas: 'Partidas',
  premium: 'Premium',
  conta: 'Minha Conta',
  time: 'Meu Time',
  '(tabs)': 'Home', // Define o título inicial para as tabs
};

export default function DrawerLayout() {
  const [headerTitle, setHeaderTitle] = useState('Home'); // Define "Home" como título inicial
  const state = useNavigationState((state) => state);

  // Carregar a fonte Lacquer
  const [fontsLoaded] = useFonts({
    //   ../../../assets/images/quadra_nova.jpg
    //  C:\Users\clien\Documents\comp_movel_projetos\NBBFantasy\assets\fonts\Lacquer-Regular.ttf
    'Lacquer-Regular': require('../../assets/fonts/Lacquer-Regular.ttf'),
  });

  // Verificar se as fontes estão carregadas, se não, mostrar tela de carregamento
  /*if (!fontsLoaded) {
    return <AppLoading />;
  }*/

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
        // Aplicar a fonte Lacquer ao headerTitle
        headerTitleStyle: {
          fontFamily: 'Lacquer-Regular', // Aplica a fonte Lacquer
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
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="time"
        options={{
          drawerLabel: 'Meu Time',
          drawerActiveBackgroundColor: '#FC9904',
          headerShown: false
        }}
      />
    </Drawer>
  );
}
