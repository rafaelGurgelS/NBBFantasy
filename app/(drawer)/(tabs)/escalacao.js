import React, { useState } from 'react';
import { NativeBaseProvider, VStack, HStack, Heading, Box, Button, Text, Actionsheet, useDisclose } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';

export default function EscalacaoScreen() {
  const userMoney = 1000; // Exemplo de valor de dinheiro do usuário
  const { isOpen, onOpen, onClose } = useDisclose();

  const jogadores = [
    { nome: 'Jogador 1', pontuacao: 50, valor: 100, time: 'Time A', posicao: 'Atacante' },
    { nome: 'Jogador 2', pontuacao: 70, valor: 150, time: 'Time B', posicao: 'Meio-campo' },
    { nome: 'Jogador 3', pontuacao: 60, valor: 120, time: 'Time C', posicao: 'Defensor' },
    // Adicione mais jogadores conforme necessário
  ];

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
          <Text color="white" fontWeight="bold"> R${userMoney}</Text>
        </Box>
        
        {/* Bloco laranja com bordas arredondadas */}
        <Box
          mt={-10}
          backgroundColor="#FFA500" // Cor laranja
          borderRadius={10} // Borda arredondada
          opacity={0.9}
          width="75%" // Largura ajustável
          height="50%" // Altura ajustável
          justifyContent="center"
          alignItems="center"
        >
          {/* Container para os botões */}
          <VStack flex={1} alignItems="center" py={4}>
            {/* Linha superior */}
            <HStack space={6}>
              <Button
                size="lg"
                borderRadius="full"
                backgroundColor="white"
                width={16}
                height={16}
                startIcon={<FontAwesome name="user-circle" size={40} color="black" />}
                onPress={onOpen}
              />
              <Button
                size="lg"
                borderRadius="full"
                backgroundColor="white"
                width={16}
                height={16}
                startIcon={<FontAwesome name="user-circle" size={40} color="black" />}
                onPress={onOpen}
              />
              <Button
                size="lg"
                borderRadius="full"
                backgroundColor="white"
                width={16}
                height={16}
                startIcon={<FontAwesome name="user-circle" size={40} color="black" />}
                onPress={onOpen}
              />
            </HStack>

            {/* Linha inferior */}
            <HStack space={10} mt={6}>
              <Button
                size="lg"
                borderRadius="full"
                backgroundColor="white"
                width={16}
                height={16}
                startIcon={<FontAwesome name="user-circle" size={40} color="black" />}
                onPress={onOpen}
              />
              <Button
                size="lg"
                borderRadius="full"
                backgroundColor="white"
                width={16}
                height={16}
                startIcon={<FontAwesome name="user-circle" size={40} color="black" />}
                onPress={onOpen}
              />
            </HStack>
          </VStack>
        </Box>

        {/* Modal com lista de jogadores */}
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Text fontSize="xl" mb={4}>Posição</Text>
            {jogadores.map((jogador, index) => (
              <HStack key={index} justifyContent="space-between" alignItems="center" w="100%" px={4} py={2}>
                <VStack>
                  <Text bold>{jogador.nome}</Text>
                  <Text>Pontuação: {jogador.pontuacao}</Text>
                  <Text>Valor: R${jogador.valor}</Text>
                  <Text>Time: {jogador.time}</Text>
                  <Text>Posição: {jogador.posicao}</Text>
                </VStack>
                <Button onPress={() => alert(`Comprado: ${jogador.nome}`)}>Comprar</Button>
              </HStack>
            ))}
          </Actionsheet.Content>
        </Actionsheet>
      </VStack>
    </NativeBaseProvider>
  );
}
