import React from 'react';
import { FlatList, Pressable } from 'react-native';
import { NativeBaseProvider, Box, HStack, Text, Icon, VStack, Button } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

const Leagues = () => {
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
  );
}

export default Leagues;
