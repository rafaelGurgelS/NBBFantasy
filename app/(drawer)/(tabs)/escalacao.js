import React, { useState, useEffect } from 'react';
import { IconButton, FlatList, NativeBaseProvider, VStack, HStack, Box, Button, Text, Actionsheet, useDisclose, Image, Flex } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';

const EscalacaoScreen = () => {
  const [userMoney, setUserMoney] = useState(1000);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [selectedPosition, setSelectedPosition] = useState(null);

  const [comprados, setComprados] = useState({
    'Ala armador': null,
    'Armador': null,
    'Pivô': null,
    'Ala pivô': null,
    'Ala': null
  });
  const [disponiveis, setDisponiveis] = useState({
    'Ala armador': [],
    'Armador': [],
    'Pivô': [],
    'Ala pivô': [],
    'Ala': [],
  });

  useEffect(() => {
    fetchJogadores();
  }, []);

  const fetchJogadores = async () => {
    try {
      const response = await fetch('http://192.168.243.4:5000/jogadores');
      const data = await response.json();
      setDisponiveis({
        'Ala armador': data.filter(jogador => jogador.posicao === 'Ala/Armador'),
        'Armador': data.filter(jogador => jogador.posicao === 'Armador'),
        'Pivô': data.filter(jogador => jogador.posicao === 'Pivô'),
        'Ala pivô': data.filter(jogador => jogador.posicao === 'Ala/Pivô'),
        'Ala': data.filter(jogador => jogador.posicao === 'Ala'),
      });
    } catch (error) {
      console.error('Erro ao buscar jogadores:', error);
    }
  };

  const selectPosition = (position) => {
    setSelectedPosition(position);
    setListLoading(true);
    onOpen();
    setTimeout(() => {
      setListLoading(false);
    }, 1000);
  };

  const buyPlayer = (jogador) => {
    if (comprados[selectedPosition]?.key === jogador.key) {
      alert('Este jogador já foi comprado.');
      return;
    }

    if (userMoney >= jogador.valor) {
      const previousPlayer = comprados[selectedPosition];
      let newMoney = userMoney - jogador.valor;

      if (previousPlayer) {
        newMoney += previousPlayer.valor;
      }

      setUserMoney(newMoney);
      setComprados({ ...comprados, [selectedPosition]: jogador });
      onClose();
    } else {
      alert('Dinheiro insuficiente para comprar este jogador.');
    }
  };

  const cancelPurchase = (jogador) => {
    const newMoney = userMoney + jogador.valor;
    setUserMoney(newMoney);

    setComprados((prevComprados) => {
      const updatedComprados = { ...prevComprados };
      updatedComprados[selectedPosition] = null;
      return updatedComprados;
    });
  };

  const renderButtonIcon = (position) => {
    const player = comprados[position];
    if (player) {
      return (
        <HStack position="relative">
          <FontAwesome name="user-circle" size={35} color="black" />
          <FontAwesome name="check-circle" size={20} color="green" style={{ position: 'absolute', top: -8, right: -8 }} />
        </HStack>
      );
    } else {
      return (
        <FontAwesome name="user-circle" size={35} color="black" />
      );
    }
  };

  const isComplete = Object.values(comprados).every(jogador => jogador !== null);

  function renderItem({ item }) {
    return (
      <HStack justifyContent="space-between" alignItems="center" w="100%" px={4} py={2}>
        <VStack>
          <Text bold>{item.nome}</Text>
          <Text>Pontuação: {item.pontuacao}</Text>
          <Text>Valor: R${item.valor}</Text>
          <Text>Time: {item.time}</Text>
          <Text>Posição: {item.posicao}</Text>
        </VStack>
        {comprados[selectedPosition]?.key === item.key ? (
          <HStack>
            <Text color="red.500">Comprado </Text>
            <Button colorScheme="red" borderRadius="20px" onPress={() => cancelPurchase(item)}>Cancelar</Button>
          </HStack>
        ) : (
          <Button
            bg="orange.400"
            onPress={() => buyPlayer(item)}
            borderRadius="20px"
          >
          Comprar
          </Button>
        )}
      </HStack>
    )
  }

  const [listLoading, setListLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEndReached = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <NativeBaseProvider>
      <VStack flex={1} justifyContent="flex-start" alignItems="center">
        
        <HStack w="100%" py={4} bg="warmGray.400" justifyContent="space-between" alignItems="center" px={4}>
          <Flex flex={1} alignItems="center">
            <Text color="white" fontWeight="bold">R${userMoney.toFixed(2)}</Text>
          </Flex>
          <Flex flex={1} alignItems="center">
            <Text color="white" fontWeight="bold">Rodada: 1</Text>
          </Flex>
          <Flex flex={1} alignItems="center" flexDirection="row" justifyContent="center">
            <FontAwesome name={isComplete ? "check-circle" : "times-circle"} size={24} color="white" />
            <Text color="white" fontWeight="bold" ml={2}>
              {isComplete ? "Completa" : "Incompleta"}
            </Text>
          </Flex>
        </HStack>


        <Box flex={1} w="100%">
          <Image
            source={require('../../../assets/images/quadra_nova.jpg')}
            alt="Quadra de basquete"
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />

          <VStack flex={1} alignItems="center" py={4} position="relative">
            <HStack space={6} position="absolute" top="20%">
              <VStack alignItems="center">
                <IconButton
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  borderColor="orange.400"
                  borderWidth={2}
                  icon={renderButtonIcon('Ala armador')}
                  onPress={() => selectPosition('Ala armador')}
                  mb={2}
                />
                {comprados['Ala armador'] && <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                  {comprados['Ala armador'].nome}</Text>}
              </VStack>
              <VStack alignItems="center">
                <IconButton
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  borderColor="orange.400"
                  borderWidth={2}
                  icon={renderButtonIcon('Armador')}
                  onPress={() => selectPosition('Armador')}
                  mb={2}
                  style={{ top: -40 }}
                />
                {comprados['Armador'] && (
                  <Text textAlign="center" style={{ marginTop: -40, fontWeight: 'bold', fontSize: 14 }}>
                    {comprados['Armador'].nome}
                  </Text>
                )}
              </VStack>
              <VStack alignItems="center">
                <IconButton
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  borderColor="orange.400"
                  borderWidth={2}
                  icon={renderButtonIcon('Pivô')}
                  onPress={() => selectPosition('Pivô')}
                  mb={2}
                />
                {comprados['Pivô'] && <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                  {comprados['Pivô'].nome}</Text>}
              </VStack>
            </HStack>

            <HStack space={10} position="absolute" bottom="15%">
              <VStack alignItems="center">
                <IconButton
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  borderColor="orange.400"
                  borderWidth={2}
                  icon={renderButtonIcon('Ala pivô')}
                  onPress={() => selectPosition('Ala pivô')}
                  mb={2}
                />
                {comprados['Ala pivô'] && <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                  {comprados['Ala pivô'].nome}</Text>}
              </VStack>
              <VStack alignItems="center">
                <IconButton
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  borderColor="orange.400"
                  borderWidth={2}
                  icon={renderButtonIcon('Ala')}
                  onPress={() => selectPosition('Ala')}
                  mb={2}
                />
                {comprados['Ala'] && <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                  {comprados['Ala'].nome}</Text>}
              </VStack>
            </HStack>
          </VStack>
        </Box>

        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <IconButton
              icon={<FontAwesome name="times" size={24} color="black" />}
              variant="unstyled"
              alignSelf="flex-end"
              onPress={onClose}
            />
            <Text fontSize="xl" mb={4}>Posição: {selectedPosition}</Text>
            {listLoading ? (
              <ActivityIndicator size="large" color="#FC9904" />
            ) : (
              <FlatList
                data={selectedPosition ? disponiveis[selectedPosition] : []}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                ListFooterComponent={!loading ? <ActivityIndicator size="large" color="#FC9904" /> : null}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
              />
            )}
          </Actionsheet.Content>
        </Actionsheet>
      </VStack>
    </NativeBaseProvider>
  );
};

export default EscalacaoScreen;
