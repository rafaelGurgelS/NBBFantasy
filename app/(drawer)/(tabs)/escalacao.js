import React, { useState } from 'react';
import { ScrollView, NativeBaseProvider, VStack, HStack, Box, Button, Text, Actionsheet, useDisclose, Image } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
//bug: uma vez que a escalaçao fica completa, e se eu cancelar, ele nao consegue 
//ver q ta incompleta


export default function EscalacaoScreen() {
  const [userMoney, setUserMoney] = useState(1000); // Estado para o dinheiro do usuário
  const { isOpen, onOpen, onClose } = useDisclose();
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [comprados, setComprados] = useState({
    ala_armador: null,
    armador: null,
    pivo: null,
    ala_pivo: null,
    ala: null
  });

  const [disponiveis, setDisponiveis] = useState({
    'ala_armador': [
      { nome: 'Jogador 1', pontuacao: 50, valor: 100, time: 'Time A', posicao: 'Ala armador' },
      { nome: 'Jogador 2', pontuacao: 55, valor: 110, time: 'Time B', posicao: 'Ala armador' },
      { nome: 'Jogador 3', pontuacao: 60, valor: 120, time: 'Time C', posicao: 'Ala armador' },
      { nome: 'Jogador 4', pontuacao: 65, valor: 130, time: 'Time D', posicao: 'Ala armador' },
      { nome: 'Jogador 5', pontuacao: 70, valor: 140, time: 'Time E', posicao: 'Ala armador' },
    ],
    'armador': [
      { nome: 'Jogador 6', pontuacao: 50, valor: 100, time: 'Time F', posicao: 'Armador' },
      { nome: 'Jogador 7', pontuacao: 55, valor: 110, time: 'Time G', posicao: 'Armador' },
      { nome: 'Jogador 8', pontuacao: 60, valor: 120, time: 'Time H', posicao: 'Armador' },
      { nome: 'Jogador 9', pontuacao: 65, valor: 130, time: 'Time I', posicao: 'Armador' },
      { nome: 'Jogador 10', pontuacao: 70, valor: 140, time: 'Time J', posicao: 'Armador' },
    ],
    'pivo': [
      { nome: 'Jogador 11', pontuacao: 50, valor: 100, time: 'Time K', posicao: 'Pivô' },
      { nome: 'Jogador 12', pontuacao: 55, valor: 110, time: 'Time L', posicao: 'Pivô' },
      { nome: 'Jogador 13', pontuacao: 60, valor: 120, time: 'Time M', posicao: 'Pivô' },
      { nome: 'Jogador 14', pontuacao: 65, valor: 130, time: 'Time N', posicao: 'Pivô' },
      { nome: 'Jogador 15', pontuacao: 70, valor: 140, time: 'Time O', posicao: 'Pivô' },
    ],
    'ala_pivo': [
      { nome: 'Jogador 16', pontuacao: 50, valor: 100, time: 'Time P', posicao: 'Ala-pivô' },
      { nome: 'Jogador 17', pontuacao: 55, valor: 110, time: 'Time Q', posicao: 'Ala-pivô' },
      { nome: 'Jogador 18', pontuacao: 60, valor: 120, time: 'Time R', posicao: 'Ala-pivô' },
      { nome: 'Jogador 19', pontuacao: 65, valor: 130, time: 'Time S', posicao: 'Ala-pivô' },
      { nome: 'Jogador 20', pontuacao: 70, valor: 140, time: 'Time T', posicao: 'Ala-pivô' },
    ],
    'ala': [
      { nome: 'Jogador 21', pontuacao: 50, valor: 100, time: 'Time U', posicao: 'Ala' },
      { nome: 'Jogador 22', pontuacao: 55, valor: 110, time: 'Time V', posicao: 'Ala' },
      { nome: 'Jogador 23', pontuacao: 60, valor: 120, time: 'Time W', posicao: 'Ala' },
      { nome: 'Jogador 24', pontuacao: 65, valor: 130, time: 'Time X', posicao: 'Ala' },
      { nome: 'Jogador 25', pontuacao: 70, valor: 140, time: 'Time Y', posicao: 'Ala' },
    ],
  }
  );

  const selectPosition = (position) => {
    setSelectedPosition(position);
    onOpen();
  };

  const buyPlayer = (jogador) => {
  if (comprados[selectedPosition]?.nome === jogador.nome) {
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
    
  } else {
    alert('Dinheiro insuficiente para comprar este jogador.');
  }
};

const cancelPurchase = (jogador) => {
  const newMoney = userMoney + jogador.valor;
  setUserMoney(newMoney);

  setComprados((prevComprados) => {
    const updatedComprados = { ...prevComprados };
    updatedComprados[selectedPosition] = null; // Define como null ao invés de deletar
    return updatedComprados;
  });



  //setComprados(jogador);
  
 
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

  return (
    <NativeBaseProvider>
      <VStack flex={1} justifyContent="center" alignItems="center">
        {/* Caixa verde no canto superior esquerdo */}
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

        {/* Status da Escalação */}
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

        {/* Imagem de fundo da quadra de basquete */}
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

          {/* Container para os botões */}
          <VStack flex={1} alignItems="center" py={4} position="relative">
            {/* Linha superior */}
            <HStack space={6} position="absolute" top="20%">
              <VStack alignItems="center">
                <Button
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  startIcon={renderButtonIcon('ala_armador')}
                  onPress={() => selectPosition('ala_armador')}
                  mb={2}
                />
                {comprados.ala_armador && <Text style={{fontWeight: 'bold', fontSize: 14 }} >
                  {comprados.ala_armador.nome}</Text>}
              </VStack>
              <VStack alignItems="center">
                <Button
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  startIcon={renderButtonIcon('armador')}
                  onPress={() => selectPosition('armador')}
                  mb={2}
                  style={{top: -40}}
                />
                {comprados.armador && (
                  <Text textAlign="center" style={{ marginTop: -40, fontWeight: 'bold', fontSize: 14 }}>
                    {comprados.armador.nome}
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
                  startIcon={renderButtonIcon('pivo')}
                  onPress={() => selectPosition('pivo')}
                  mb={2}
                />
                {comprados.pivo && <Text style={{fontWeight: 'bold', fontSize: 14 }}>
                  {comprados.pivo.nome}</Text>}
              </VStack>
            </HStack>

            {/* Linha inferior */}
            <HStack space={10} position="absolute" bottom="10%">
              <VStack alignItems="center">
                <Button
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  startIcon={renderButtonIcon('ala_pivo')}
                  onPress={() => selectPosition('ala_pivo')}
                  mb={2}
                />
                {comprados.ala_pivo && <Text style={{fontWeight: 'bold', fontSize: 14 }}>
                  {comprados.ala_pivo.nome}</Text>}
              </VStack>
              <VStack alignItems="center">
                <Button
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  startIcon={renderButtonIcon('ala')}
                  onPress={() => selectPosition('ala')}
                  mb={2}
                />
                {comprados.ala && <Text style={{fontWeight: 'bold', fontSize: 14 }}>
                  {comprados.ala.nome}</Text>}
              </VStack>
            </HStack>
          </VStack>
        </Box>

        {/* Modal com lista de jogadores */}
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Text fontSize="xl" mb={4}>Posição: {selectedPosition}</Text>
            <ScrollView w="100%">
              {selectedPosition && disponiveis[selectedPosition]?.map((jogador, index) => (
                <HStack key={index} justifyContent="space-between" alignItems="center" w="100%" px={4} py={2}>
                  <VStack>
                    <Text bold>{jogador.nome}</Text>
                    <Text>Pontuação: {jogador.pontuacao}</Text>
                    <Text>Valor: R${jogador.valor}</Text>
                    <Text>Time: {jogador.time}</Text>
                    <Text>Posição: {jogador.posicao}</Text>
                  </VStack>
                  {comprados[selectedPosition]?.nome === jogador.nome ? (
                    <HStack>
                      <Text color="red.500">Comprado </Text>
                      <Button colorScheme="red" onPress={() => cancelPurchase(jogador)}>Cancelar</Button>
                    </HStack>
                  ) : (
                    <Button onPress={() => buyPlayer(jogador)}>Comprar</Button>
                  )}
                </HStack>
              ))}
            </ScrollView>
          </Actionsheet.Content>
        </Actionsheet>

      </VStack>
    </NativeBaseProvider>
  );
}
