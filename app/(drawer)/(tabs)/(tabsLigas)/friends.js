import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Box, HStack, Text, Icon, VStack, Button } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

const Friends = () => {
  const leagues = [
    { id: '1', name: 'Joao balblaandsdjeioew' },
    { id: '2', name: 'Maria' },
    { id: '3', name: 'Jose' },
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
                backgroundColor= "gray.300"
                padding={5}
                borderRadius="md"
                w="100%"
                mb={2} 
              >
                <HStack space={3}  alignItems="center">
                  <Icon as={FontAwesome} name="user-circle" size={10} color="black" />
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

export default Friends;
