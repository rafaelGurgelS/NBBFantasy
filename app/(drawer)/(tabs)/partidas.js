import React, { useState, useEffect, useContext } from 'react';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Button, VStack, HStack, ScrollView, Center, Pressable, Box, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GlobalContext from '../../globalcontext';
import io from 'socket.io-client';

//o que está sendo chamado de rodada atual na verdade é a rodada "hoje" kk

const PartidasScreen = () => {
  const { userName, setuserName, ip, setIP, porta, setPorta } = useContext(GlobalContext);
  const [partidas, setPartidas] = useState([]);
  const [rodadaAtual, setRodadaAtual] = useState(null);
  const [rodadaHoje, setRodadaHoje] = useState(null);
  const [rodadas, setRodadas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Conectar ao servidor Socket.IO
  useEffect(() => {
    const socket = io(`http://${ip}:${porta}`);

    socket.on('update', (data) => {
      console.log('Atualização recebida:', data);
  
      fetchPartidas().then(() => {
        // Após fetchPartidas, garantir que rodadaAtual seja atualizado com base no valor recebido
        if (data.current_round_id && rodadaAtual !== data.current_round_id) {
          setRodadaAtual(data.current_round_id);
        }
      });
    });

    socket.on('info', (data) => {
      console.log('Atualização recebida:', data);
  
      fetchPartidas().then(() => {
        // Após fetchPartidas, garantir que rodadaAtual seja atualizado com base no valor recebido
        if (data.current_round_id && rodadaAtual !== data.current_round_id) {
          setRodadaAtual(data.current_round_id-1);
        }
      });
    });
    
    // Limpar a conexão quando o componente for desmontado
    return () => {
      socket.disconnect();
    };
  }, [ip, porta, rodadaAtual]);

  const fetchPartidas = async () => {
    try {
      const response = await fetch(`http://${ip}:${porta}/partidas`);
      const data = await response.json();
      setPartidas(data);
  
      // Obter todas as rodadas disponíveis
      const uniqueRodadas = [...new Set(data.map(partida => partida.rodada))];
      setRodadas(uniqueRodadas);
  
      // Definir a rodada "hoje" como a última rodada disponível
      if (uniqueRodadas.length > 0) {
        setRodadaHoje(uniqueRodadas[uniqueRodadas.length - 1]);
        
        // Definir a rodada atual apenas se não estiver definida ou não for válida
        if (rodadaAtual === null || !uniqueRodadas.includes(rodadaAtual)) {
          setRodadaAtual(uniqueRodadas[0]);
        }
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

  const handleRodadaHoje = () => {
    const currentIndex = rodadas.indexOf(rodadaHoje);
    setRodadaAtual(rodadas[currentIndex]);
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    circleButton: {
      backgroundColor: 'rgba(192,192,192,0.5)',
      borderRadius: 50,
      padding: 10,
      margin: 5,
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
    },
  });

  if (loading) {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color="#FC9904" />
      </VStack>
    );
  }

  return (
    <VStack flex={1} justifyContent="center" alignItems="center" space={4} px={4}>
      
     
      {rodadaAtual !== null && (
        <>
          <HStack space={4} alignItems="center" mt={4}>
            <Pressable onPress={handlePreviousPage}>
              {({ isPressed }) => (
                <Center
                  p={2}
                  bg={isPressed ? 'rgba(192,192,192,0.5)' : 'transparent'}
                  borderRadius="full"
                >
                  <FontAwesome name="chevron-left" size={35} color="orange" />
                </Center>
              )}
            </Pressable>

            <Text fontSize="xl" fontWeight="bold">Rodada {rodadaAtual}</Text>

            <Pressable onPress={handleNextPage}>
              {({ isPressed }) => (
                <Center
                  p={2}
                  bg={isPressed ? 'rgba(192,192,192,0.5)' : 'transparent'}
                  borderRadius='full'
                >
                  <FontAwesome name="chevron-right" size={35} color="orange" />
                </Center>
              )}
            </Pressable>
          </HStack>
          <Box bg="white" flex={1} rounded="md">
            <ScrollView width="100%">
              {partidasPorRodada.map((partida, index) => (
                <View key={index}>
                  <HStack justifyContent="space-between" alignItems="center" w="100%" px={4} py={2}>
                    <Text flex={1} textAlign="right">{partida.time_casa}</Text>
                    <Text flex={1} textAlign="center">
                      {rodadaAtual === rodadaHoje ? " x " : `${partida.placar_casa} x ${partida.placar_visitante}`}
                    </Text>
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
            <Button onPress={handleRodadaHoje} bg="orange.400" _text={{ color: 'white' }} borderRadius="20px">Rodada atual</Button>
          </Center>
        </>
      )}
    </VStack>
  );
};

export default PartidasScreen;
