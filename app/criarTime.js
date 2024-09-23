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
  Image,
} from 'native-base';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import GlobalContext from './globalcontext.js'; // Importe o contexto global


// Dados dos emblemas
const emblemData = [
  { id: '1', name: 'Emblema 1', image: require('../assets/images/emblems/icon_1.png') },
  { id: '2', name: 'Emblema 2', image: require('../assets/images/emblems/icon_2.png') },
  { id: '3', name: 'Emblema 3', image: require('../assets/images/emblems/icon_3.png') },
  { id: '4', name: 'Emblema 4', image: require('../assets/images/emblems/icon_4.png') },
  { id: '5', name: 'Emblema 5', image: require('../assets/images/emblems/icon_5.png') },
  { id: '6', name: 'Emblema 6', image: require('../assets/images/emblems/icon_6.png') },
  { id: '7', name: 'Emblema 7', image: require('../assets/images/emblems/icon_7.png') },
  { id: '8', name: 'Emblema 8', image: require('../assets/images/emblems/icon_8.png') },
  { id: '9', name: 'Emblema 9', image: require('../assets/images/emblems/icon_9.png') },
];


export default function TeamCreationScreen() {
  const router = useRouter();
  const toast = useToast();

  const { userName, setuserName, ip, setIP, porta, setPorta} =  useContext(GlobalContext);
  
  const [localTeamName, setLocalTeamName] = useState('');
  const [localSelectedEmblem, setLocalSelectedEmblem] = useState(null);

  const handleEmblemSelect = (id) => {
    setLocalSelectedEmblem(id); // Muda a seleção localmente
  };

  const handleComplete = async () => {
    if (!localTeamName || !localSelectedEmblem) {
      // Exibe um aviso se os campos obrigatórios não estiverem preenchidos
      toast.show({
        title: 'Erro',
        description: 'Preencha o nome do time e escolha um emblema.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    } else {
      
      // Enviando o POST request
      try {
        const response = await fetch(`http://${ip}:${porta}/insert_time`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome_time: localTeamName,
            username: userName, // Pegando o username do contexto
            emblema: localSelectedEmblem,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Sucesso na criação do time, navega para a tela Home
          toast.show({
            title: 'Sucesso',
            description: data.message || 'Time criado com sucesso!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          router.push('/(drawer)/(tabs)/home');
        } else {
          // Erro na criação do time
          toast.show({
            title: 'Erro',
            description: data.error || 'Erro ao criar o time.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        // Erro na requisição
        toast.show({
          title: 'Erro',
          description: 'Erro ao se conectar ao servidor.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
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
                alignItems="center"
              >
                <Image
                  source={item.image}
                  alt={item.name}
                  size="lg" // Defina um tamanho adequado para o emblema
                  borderRadius="full"
                />
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
