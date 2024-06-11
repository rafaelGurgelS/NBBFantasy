import React, { useState, useContext } from 'react';
import {
  VStack, 
  Center, 
  Heading, 
  Input, 
  Button, 
  Text, 
  Divider, 
  FlatList, 
  Box, 
  useToast,
} from 'native-base';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import GlobalContext from './globalcontext.js'; // Importe o contexto global

export default function TeamCreationScreen() {
  const router = useRouter();
  const toast = useToast();
  const { setTeamName, setSelectedEmblem } = useContext(GlobalContext); // Acesse as funções do contexto

  const [localTeamName, setLocalTeamName] = useState('');
  const [localSelectedEmblem, setLocalSelectedEmblem] = useState(null);

  const emblemData = [
    { id: '1', name: 'Emblema 1' },
    { id: '2', name: 'Emblema 2' },
    { id: '3', name: 'Emblema 3' },
    { id: '4', name: 'Emblema 4' },
    { id: '5', name: 'Emblema 5' },
    { id: '6', name: 'Emblema 6' },
    { id: '7', name: 'Emblema 7' },
    { id: '8', name: 'Emblema 8' },
    { id: '9', name: 'Emblema 9' },
    { id: '10', name: 'Emblema 10' },
  ];

  const handleEmblemSelect = (id) => {
    setLocalSelectedEmblem(id); // Muda a seleção localmente
  };

  const handleComplete = () => {
    if (!localTeamName || !localSelectedEmblem) {
      toast.show({
        title: 'Erro',
        description: 'Preencha o nome do time e escolha um emblema.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Atualiza os valores no contexto
      setTeamName(localTeamName);
      setSelectedEmblem(localSelectedEmblem);

      // Navega para a tela Home
      router.push('/(drawer)/(tabs)/home');
    }
  };

  return (
    <Center flex={1}>
      <VStack width="90%" space={5} alignItems="center" mt={-50}>
        <Heading size="xl" mb={10} textAlign="center">
          CRIE A SUA EQUIPE DE BASQUETE!
        </Heading>

        

        <Text fontSize={20} textAlign="center" mt={10}>
          Escolha um emblema:
        </Text>

        <Divider borderWidth={1} borderColor="#FC9904" width="100%" mt={1} />

        <FlatList
          horizontal
          data={emblemData}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEmblemSelect(item.id)}>
              <Box
                padding={5}
                borderColor={localSelectedEmblem === item.id ? '#FC9904' : '#D9D9D9'}
                borderWidth={1}
                borderRadius='full'
                m={2}
              >
                <Text>{item.name}</Text>
              </Box>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />

        <Input
          placeholder="Nome do time"
          variant="filled"
          width="100%"
          backgroundColor="#D9D9D9"
          borderRadius="full"
          height={60}
          fontSize={16}
          value={localTeamName}
          onChangeText={setLocalTeamName}
        />



        <Button
          width="100%"
          backgroundColor="#FC9904"
          borderRadius="full"
          height={60}
          size="lg"
          onPress={handleComplete}
        >
          <Text color="#55776D" fontSize={16}>Concluído</Text>
        </Button>
      </VStack>
    </Center>
  );
}
