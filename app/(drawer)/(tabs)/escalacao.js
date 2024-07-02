import React, { useState } from 'react';
import { NativeBaseProvider, VStack, HStack, Box, Button, Text, Actionsheet, useDisclose, Image } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

export default function EscalacaoScreen() {
  const [userMoney, setUserMoney] = useState(1000); // Estado para o dinheiro do usuário
  const { isOpen, onOpen, onClose } = useDisclose();
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [comprados, setComprados] = useState({
    pos1: null,
    pos2: null,
    pos3: null,
    pos4: null,
    pos5: null
  });
  const [disponiveis, setDisponiveis] = useState([
    { nome: 'Jogador 1', pontuacao: 50, valor: 100, time: 'Time A', posicao: 'Atacante' },
    { nome: 'Jogador 2', pontuacao: 70, valor: 150, time: 'Time B', posicao: 'Meio-campo' },
    { nome: 'Jogador 3', pontuacao: 60, valor: 120, time: 'Time C', posicao: 'Defensor' },
    { nome: 'Jogador 4', pontuacao: 80, valor: 180, time: 'Time D', posicao: 'Atacante' },
    { nome: 'Jogador 5', pontuacao: 90, valor: 200, time: 'Time E', posicao: 'Meio-campo' },
    { nome: 'Jogador 6', pontuacao: 55, valor: 110, time: 'Time F', posicao: 'Defensor' },
  ]);

  const selectPosition = (position) => {
    setSelectedPosition(position);
    onOpen();
  };

  const buyPlayer = (jogador) => {
    if (userMoney >= jogador.valor) {
      const previousPlayer = comprados[selectedPosition];
      let newMoney = userMoney - jogador.valor;

      if (previousPlayer) {
        newMoney += previousPlayer.valor;
        setDisponiveis([...disponiveis, previousPlayer]);
      }

      setUserMoney(newMoney);
      setComprados({ ...comprados, [selectedPosition]: jogador });
      setDisponiveis(disponiveis.filter(j => j.nome !== jogador.nome));
      onClose();
    } else {
      alert('Dinheiro insuficiente para comprar este jogador.');
    }
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
                  startIcon={renderButtonIcon('pos1')}
                  onPress={() => selectPosition('pos1')}
                  mb={2}
                />
                {comprados.pos1 && <Text style={{fontWeight: 'bold', fontSize: 14 }} >
                  {comprados.pos1.nome}</Text>}
              </VStack>
              <VStack alignItems="center">
                <Button
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  startIcon={renderButtonIcon('pos2')}
                  onPress={() => selectPosition('pos2')}
                  mb={2}
                  style={{top: -40}}
                />
                {comprados.pos2 && (
                  <Text textAlign="center" style={{ marginTop: -40, fontWeight: 'bold', fontSize: 14 }}>
                    {comprados.pos2.nome}
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
                  startIcon={renderButtonIcon('pos3')}
                  onPress={() => selectPosition('pos3')}
                  mb={2}
                />
                {comprados.pos3 && <Text style={{fontWeight: 'bold', fontSize: 14 }}>
                  {comprados.pos3.nome}</Text>}
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
                  startIcon={renderButtonIcon('pos4')}
                  onPress={() => selectPosition('pos4')}
                  mb={2}
                />
                {comprados.pos4 && <Text style={{fontWeight: 'bold', fontSize: 14 }}>
                  {comprados.pos4.nome}</Text>}
              </VStack>
              <VStack alignItems="center">
                <Button
                  size="lg"
                  borderRadius="full"
                  backgroundColor="white"
                  width={16}
                  height={16}
                  startIcon={renderButtonIcon('pos5')}
                  onPress={() => selectPosition('pos5')}
                  mb={2}
                />
                {comprados.pos5 && <Text style={{fontWeight: 'bold', fontSize: 14 }}>
                  {comprados.pos5.nome}</Text>}
              </VStack>
            </HStack>
          </VStack>
        </Box>

        {/* Modal com lista de jogadores */}
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Text fontSize="xl" mb={4}>Selecione um jogador</Text>
            {disponiveis.map((jogador, index) => (
              <HStack key={index} justifyContent="space-between" alignItems="center" w="100%" px={4} py={2}>
                <VStack>
                  <Text bold>{jogador.nome}</Text>
                  <Text>Pontuação: {jogador.pontuacao}</Text>
                  <Text>Valor: R${jogador.valor}</Text>
                  <Text>Time: {jogador.time}</Text>
                  <Text>Posição: {jogador.posicao}</Text>
                </VStack>
                <Button onPress={() => buyPlayer(jogador)}>Comprar</Button>
              </HStack>
            ))}
          </Actionsheet.Content>
        </Actionsheet>
      </VStack>
    </NativeBaseProvider>
  );
}
