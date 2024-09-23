import React, { useState, useEffect, useContext } from 'react';
import { FlatList, TouchableOpacity, Alert } from 'react-native';
import { NativeBaseProvider, Box, HStack, Text, Icon, VStack, Button, Modal, Input, Spacer } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import GlobalContext from '../../globalcontext.js';
import { useRouter } from 'expo-router';

const Leagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { ip, porta, userName } = useContext(GlobalContext);
  const router = useRouter();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [leagueName, setLeagueName] = useState('');
  const [leagueDescription, setLeagueDescription] = useState('');


  const fetchLeagues = async () => {
    try {
      const response = await fetch(`http://${ip}:${porta}/leagues?username=${userName}`);
      const data = await response.json();
      setLeagues(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as ligas.');
    }
  };

  
  useEffect(() => {
    fetchLeagues();
  }, [ip, porta, userName]);

  const searchLeagues = async () => {
    try {
      const response = await fetch(`http://${ip}:${porta}/search_leagues?name=${searchQuery}`);
      const data = await response.json();
      setLeagues(data);
      setSearchModalVisible(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível buscar as ligas.');
    }
  };

// Função para criar uma nova liga
const createLeague = async () => {
  if (!leagueName) {
    Alert.alert('Erro', 'O nome da liga é obrigatório.');
    return;
  }

  try {
    const response = await fetch(`http://${ip}:${porta}/create_league`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: leagueName,
        description: leagueDescription,
        username: userName,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      Alert.alert('Sucesso!', data.message || 'Liga criada com sucesso!');
      setIsModalVisible(false);
      setLeagueName('');
      setLeagueDescription('');
      // Atualiza a lista de ligas
      await fetchLeagues(); 
    } else {
      // Exibe o erro detalhado
      Alert.alert('Erro', data.error || 'Erro desconhecido.');
      console.error('Erro ao criar liga:', data.error || 'Erro desconhecido.');
    }
  } catch (error) {
    // Exibe o erro genérico e detalhado
    Alert.alert('Erro', 'Não foi possível criar a liga.');
    console.error('Erro ao criar liga:', error);
  }
};


  const handlePress = (league) => {
    router.push(`../../leagueDetails/${league.id}`);
  };

  return (
    <NativeBaseProvider>
      <VStack flex={1} p={4} justifyContent="space-between">
        <HStack mb={4} space={2} alignItems="center">
          <Input
            placeholder="Buscar liga..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            flex={1}
            borderColor="#FC9904"
            _focus={{
              borderColor: '#FC9904', // Cor da borda ao focar
            }}
            color="#FC9904"
          />
          <Button onPress={() => setSearchModalVisible(true)} bg="#FC9904" _pressed={{ bg: '#E68A00' }}>
            <Icon as={FontAwesome} name="search" size={5} color="white" />
          </Button>
        </HStack>

        <FlatList
          data={leagues}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handlePress(item)}>
              <Box
                key={item.id}
                bg="gray.100"
                padding={5}
                backgroundColor="gray.300"
                borderRadius="md"
                w="full"
                mb={2}
              >
                <HStack alignItems="center">
                  <Icon as={FontAwesome} name="trophy" size={10} color="black" />
                  <Text ml={100}>{item.name}</Text>
                </HStack>
              </Box>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 16 }}
        />

        <Button
          bg="#FC9904" // Cor de fundo personalizada
          borderRadius="full" // Raio da borda
          startIcon={<Icon as={FontAwesome} name="plus" color="white" />} // Cor do ícone
          color="white" // Cor do texto do botão
          onPress={() => setIsModalVisible(true)} // Ação ao pressionar
          mb={4} // Margem inferior
          _pressed={{ bg: '#E68A00' }} // Cor ao pressionar (opcional, escurecer)
        >
          Criar Liga
        </Button>

        {/* Modal para criação da liga */}
        <Modal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Criar Liga</Modal.Header>
            <Modal.Body>
              <Input
                placeholder="Nome da Liga"
                value={leagueName}
                onChangeText={(text) => setLeagueName(text)}
                mb={4}
              />
              <Input
                placeholder="Descrição (opcional)"
                value={leagueDescription}
                onChangeText={(text) => setLeagueDescription(text)}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="red"
                  onPress={() => setIsModalVisible(false)}
                >
                  Cancelar
                </Button>
                <Button colorScheme="green" onPress={createLeague}>
                  Criar
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>

        {/* Modal de pesquisa */}
        <Modal isOpen={searchModalVisible} onClose={() => setSearchModalVisible(false)}>
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Pesquisar Liga</Modal.Header>
            <Modal.Body>
              <Input
                placeholder="Nome da Liga"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                mb={4}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="red"
                  onPress={() => setSearchModalVisible(false)}
                >
                  Cancelar
                </Button>
                <Button colorScheme="green" onPress={searchLeagues}>
                  Buscar
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </VStack>
    </NativeBaseProvider>
  );
};

export default Leagues;
