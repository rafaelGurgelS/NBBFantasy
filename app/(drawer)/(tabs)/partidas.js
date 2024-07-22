import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text, Button, VStack, HStack, ScrollView, Center, Box, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons'; 

const PartidasScreen = () => {
  const [partidas, setPartidas] = useState([]);
  const [rodadaAtual, setRodadaAtual] = useState(null);
  const [rodadas, setRodadas] = useState([]);
  const [loading, setLoading] = useState(true);

  const ItemSeparator = () => (
    <View style={{ height: 1, backgroundColor: 'gray' }} />
  );



  useEffect(() => {
    fetchPartidas();
  }, []);

  const fetchPartidas = async () => {
    try {
      const response = await fetch('http://192.168.1.193:5000/partidas');
      const data = await response.json();
      setPartidas(data);

      // Obter todas as rodadas disponíveis
      const uniqueRodadas = [...new Set(data.map(partida => partida.rodada))];
      setRodadas(uniqueRodadas);

      // Definir a rodada atual como a primeira rodada disponível
      if (uniqueRodadas.length > 0) {
        setRodadaAtual(uniqueRodadas[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar partidas:', error);
    } finally {
      setLoading(false);
    }
  };

  const partidasPorRodada = partidas.filter(partida => partida.rodada === rodadaAtual);

  const handleNextPage = () => {
    const currentIndex = rodadas.indexOf(rodadaAtual);
    if (currentIndex < rodadas.length - 1) {
      setRodadaAtual(rodadas[currentIndex + 1]);
    }
  };

  const handlePreviousPage = () => {
    const currentIndex = rodadas.indexOf(rodadaAtual);
    if (currentIndex > 0) {
      setRodadaAtual(rodadas[currentIndex - 1]);
    }
  };

  if (loading) {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#FC9904" />
      </VStack>
    );
  }

  return (
    <VStack flex={1} justifyContent="center" alignItems="center" space={4} px={4}>
      <Box width="100%" bg="#E78E8E" p={4} rounded="md" alignItems="center" mt={4}>
        <HStack alignItems="center" space={2}>
          <Icon as={MaterialIcons} name="access-time" color="white" size="sm" />
          <Text color="white" fontSize="md">Tempo para próxima rodada: 00:00:00</Text>
        </HStack>
      </Box>
      {rodadaAtual !== null && (
        <>
          <HStack space={4} alignItems="center" mt={4}>
            <Button onPress={handlePreviousPage} bg="orange.400">&lt;</Button>
            <Text fontSize="xl" fontWeight="bold">Rodada {rodadaAtual}</Text>
            <Button onPress={handleNextPage} bg="orange.400">&gt;</Button>
          </HStack>
          <Box bg="gray.200" flex={1} rounded="md"  >
            <ScrollView width="100%">
            {partidasPorRodada.map((partida, index) => (
              <View key={index}>
                <HStack justifyContent="space-between" alignItems="center" w="100%" px={4} py={2}>
                  <Text flex={1} textAlign="right">{partida.time_casa}</Text>
                  <Text flex={1} textAlign="center">{partida.placar_casa} x {partida.placar_visitante}</Text>
                  <Text flex={1} textAlign="left">{partida.time_visitante}</Text>
                </HStack>
                {index < partidasPorRodada.length - 1 && (
                  <View style={{ height: 1, backgroundColor: 'gray', marginHorizontal: 16 }} />
                )}
              </View>
              ))}
            </ScrollView>
          </Box>
          <Center mb={4}>
            <Button bg="orange.400" _text={{ color: 'white' }}>Rodada Atual</Button>
          </Center>
        </>
      )}
    </VStack>
  );
};

export default PartidasScreen;
