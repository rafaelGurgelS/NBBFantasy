import React from 'react';
import { NativeBaseProvider, Box, Button, Text } from 'native-base';
import { Slot } from 'expo-router';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

// Componentes fora do escopo do Navigator
const HomeScreen = () => <Slot />;
const EscalacaoScreen = () => <Slot />;
const TrofeuScreen = () => <Slot />;
const BasqueteScreen = () => <Slot />;

// Tab Navigator
const Tab = createMaterialBottomTabNavigator();

// Drawer Navigator
const Drawer = createDrawerNavigator();

function DrawerContent({ navigation }) {
  return (
    <Box flex={1}>
      <Box backgroundColor="gray.300" padding={3}>
        {/* Informações do usuário */}
        <Text>Nome do Usuário</Text>
        <Text>Nome do Time</Text>
      </Box>
      <Box flex={1} backgroundColor="white">
        {/* Botões do menu */}
        <Button onPress={() => navigation.navigate('/minha-conta')}>
          <MaterialIcons name="person" size={24} />
          Minha Conta
        </Button>
        <Button onPress={() => navigation.navigate('/meu-time')}>
          <FontAwesome name="users" size={24} />
          Meu Time
        </Button>
      </Box>
      {/* Botão de sair */}
      <Button onPress={() => console.log('Sair')}>
        <MaterialIcons name="exit-to-app" size={24} />
        Sair
      </Button>
    </Box>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => <Ionicons name="home-outline" size={24} />,
        }}
      />
      <Tab.Screen
        name="Escalação"
        component={EscalacaoScreen}
        options={{
          tabBarIcon: () => <FontAwesome name="user-plus" size={24} />,
        }}
      />
      <Tab.Screen
        name="Trofeu"
        component={TrofeuScreen}
        options={{
          tabBarIcon: () => <Ionicons name="trophy-outline" size={24} />,
        }}
      />
      <Tab.Screen
        name="Basquete"
        component={BasqueteScreen}
        options={{
          tabBarIcon: () => <MaterialIcons name="sports-basketball" size={24} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppLayout() {
  return (
    <NativeBaseProvider>
      <Drawer.Navigator drawerContent={DrawerContent}>
        <Drawer.Screen name="Tabs" component={TabNavigator} />
      </Drawer.Navigator>
    </NativeBaseProvider>
  );
}
