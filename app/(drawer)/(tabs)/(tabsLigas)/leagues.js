import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Box, HStack, Text, Icon, VStack, Button } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

const Leagues = () => {
  const leagues = [
    { id: '1', name: 'Liga A' },
    { id: '2', name: 'Liga B' },
    { id: '3', name: 'Liga C' },
  ];

  const handlePress = (league) => {
  };

  return (
    <NativeBaseProvider>
      <VStack  p={4} justifyContent="center" alignItems="center">
        <FlatList
          data={leagues}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <Box
                key={item.id}
                bg="gray.100"
                padding={5}
                backgroundColor= "gray.300"
                borderRadius="md"
                w="100%"
                mb={2} 
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <Icon as={FontAwesome} name="trophy" size={10}  color="black" />
                  <Text>{item.name}</Text>
                </HStack>
              </Box>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 0 }} 
        />
        <Button
          colorScheme="green"
          borderRadius="full"
          startIcon={<Icon as={FontAwesome} name="plus" />}
        >
          
        </Button>
      </VStack>
    </NativeBaseProvider>
  );
}

export default Leagues;
