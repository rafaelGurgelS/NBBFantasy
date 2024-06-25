import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable,NativeBaseProvider,FlatList, Box, HStack, Text, IconButton, Icon, VStack, Button } from 'native-base';


// Suas telas de exemplo
function Leagues() {

  const leagues = [
    { id: '1', name: 'Liga A' },
    { id: '2', name: 'Liga B' },
    { id: '3', name: 'Liga C' },
  ];

  const handlePress = (league) => {
    console.log(`Clicked on ${league.name}`);
    // Aqui você pode adicionar a lógica para navegar ou realizar qualquer ação
  };



  return (
    <NativeBaseProvider>
        <VStack flex={1} p={4} justifyContent="center" alignItems="center">
        <FlatList
          data={leagues}
          renderItem={({ item }) => (
            <Pressable onPress={() => handlePress(item)}>
              <Box
                key={item.id}
                py={2}
                px={4}
                my={2}
                bg="gray.100"
                borderRadius="md"
                w="90%"
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <Text>{item.name}</Text>
                  <Icon as={FontAwesome} name="trophy" size="sm" color="black" />
                </HStack>
              </Box>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
        <Button
          mt={4}
          colorScheme="green"
          borderRadius="full"
          startIcon={<Icon as={FontAwesome} name="plus" />}
        >
          Add League
        </Button>
      </VStack>
    </NativeBaseProvider>




  ); // substitua pelo conteúdo da tela Home
}

function Friends() {
  return(
    <NativeBaseProvider>
      
    </NativeBaseProvider>




  ); // substitua pelo conteúdo da tela Home
}
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
          initialRouteName="Leagues"
        >
          <Tab.Screen
            name="Minhas ligas"
            component={Leagues}
            options={{
              title: 'Minhas ligas',
              //tabBarIcon: ({ color }) => <Ionicons name="home-outline" color={color} size={24} />,
            }}
          />
          <Tab.Screen
            name="Meus amigos"
            component={Friends}
            options={{
              title: 'Meus amigos',
              //tabBarIcon: ({ color }) => <FontAwesome name="user-plus" size={24} color={color} />,
            }}
          />
          
         
          
        </Tab.Navigator>
    
    </NativeBaseProvider>
  );
}
