import React, { useState, useEffect } from 'react';
import {View, IconButton,Modal,FlatList, ScrollView, NativeBaseProvider, VStack, HStack, Box, Button, Text, Actionsheet, useDisclose, Image } from 'native-base';
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
      const response = await fetch('http://192.168.1.193:5000/jogadores');
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
    
    onOpen();
   
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
          <FontAwesome name="user-circle" size={40} color="black" />
          <FontAwesome name="check-circle" size={20} color="green" style={{ position: 'absolute', top: -8, right: -8 }} />
        </HStack>
      );
    } else {
      return (
        <FontAwesome name="user-circle" size={40} color="black" />
      );
    }
  };

  const isComplete = Object.values(comprados).every(jogador => jogador !== null);

  function renderItem({item}) {
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
            <Button colorScheme="red" onPress={() => cancelPurchase(item)}>Cancelar</Button>
          </HStack>
        ) : (
          <Button onPress={() => buyPlayer(item)}>Comprar</Button>
        )}
      </HStack>
    )
  }

  const [loading, setLoading] = useState(false);

  const handleEndReached = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000); 
  };


  return (
    <NativeBaseProvider>
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Box
          position="absolute"
          top={4}
          left={4}
          backgroundColor="green.500"
          borderRadius={10}
          p={2}
        >
          <Text color="white" fontWeight="bold">R${userMoney}</Text>
        </Box>

        <Box
          position="absolute"
          top={4}
          right={4}
          backgroundColor={isComplete ? "green.500" : "red.500"}
          borderRadius={10}
          p={2}
        >
          <HStack alignItems="center">
            <FontAwesome name={isComplete ? "check-circle" : "times-circle"} size={24} color="white" />
            <Text color="white" fontWeight="bold" ml={2}>
              {isComplete ? "Completa" : "Incompleta"}
            </Text>
          </HStack>
        </Box>

        <Box
          mt={-10}
          borderRadius={10}
          opacity={0.9}
          width="75%"
          height="50%"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          <Image
            source={require('../../../assets/images/quadra.jpg')}
            alt="Quadra de basquete"
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />

          <VStack flex={1} alignItems="center" py={4} position="relative">
            <HStack space={6} position="absolute" top="20%">
              <VStack alignItems="center">
                <Button
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  startIcon={renderButtonIcon('Ala armador')}
                  onPress={() => selectPosition('Ala armador')}
                  mb={2}
                />
                {comprados['Ala armador'] && <Text style={{fontWeight: 'bold', fontSize: 14 }} >
                  {comprados['Ala armador'].nome}</Text>}
              </VStack>
              <VStack alignItems="center">
                <Button
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  startIcon={renderButtonIcon('Armador')}
                  onPress={() => selectPosition('Armador')}
                  mb={2}
                  style={{top: -40}}
                />
                {comprados['Armador'] && (
                  <Text textAlign="center" style={{ marginTop: -40, fontWeight: 'bold', fontSize: 14 }}>
                    {comprados['Armador'].nome}
                  </Text>
                )}
              </VStack>
              <VStack alignItems="center">
                <Button
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  startIcon={renderButtonIcon('Pivô')}
                  onPress={() => selectPosition('Pivô')}
                  mb={2}
                />
                {comprados['Pivô'] && <Text style={{fontWeight: 'bold', fontSize: 14 }}>
                  {comprados['Pivô'].nome}</Text>}
              </VStack>
            </HStack>

            <HStack space={10} position="absolute" bottom="15%">
              <VStack alignItems="center">
                <Button
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  startIcon={renderButtonIcon('Ala pivô')}
                  onPress={() => selectPosition('Ala pivô')}
                  mb={2}
                />
                {comprados['Ala pivô'] && <Text style={{fontWeight: 'bold', fontSize: 14 }}>
                  {comprados['Ala pivô'].nome}</Text>}
              </VStack>
              <VStack alignItems="center">
                <Button
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  startIcon={renderButtonIcon('Ala')}
                  onPress={() => selectPosition('Ala')}
                  mb={2}
                />
                {comprados['Ala'] && <Text style={{fontWeight: 'bold', fontSize: 14 }}>
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
            <FlatList
              data={selectedPosition ? disponiveis[selectedPosition] : []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              ListFooterComponent={!loading ? <ActivityIndicator size="large" color="#FC9904" /> : null}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0}
            />
          </Actionsheet.Content>
        </Actionsheet>

      </VStack>
    </NativeBaseProvider>
  );
};

export default EscalacaoScreen;
