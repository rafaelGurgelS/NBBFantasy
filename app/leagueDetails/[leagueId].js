import React, { useState, useEffect, useContext } from 'react';
import { View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Box, Text, VStack, HStack, Button, Avatar, IconButton, Icon } from 'native-base';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'; // Expo ícones para a seta
import GlobalContext from '../globalcontext';

const LeagueDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { leagueId } = route.params;
  const { ip, porta, userName } = useContext(GlobalContext); // Supondo que você tenha o userId no contexto
  const [league, setLeague] = useState(null);
  const [isMember, setIsMember] = useState(false); // Para controlar se o usuário está na liga ou não


  const fetchLeagueDetails = async () => {
    try {
      const response = await fetch(`http://${ip}:${porta}/leagueInfo?league_id=${leagueId}`);
      const data = await response.json();
      console.log("League Details:", data);
      setLeague(data);

      // Verifica se o usuário está na liga
      const member = data.members.find(member => member.username === userName);
      setIsMember(!!member); // Define como true se o usuário está na liga
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da liga.');
    }
  };


  useEffect(() => {
    fetchLeagueDetails();
  }, [leagueId, ip, porta, userName]);

  // Função para sair da liga
  const leaveLeague = async () => {
    try {
      const response = await fetch(`http://${ip}:${porta}/leaveLeague`, {
        method: 'POST', // Ou 'DELETE', dependendo da sua API
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          league_id: leagueId,
          user_id: userName, // Supondo que o userId está no contexto global
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Você saiu da liga com sucesso.');
        setIsMember(false); // Atualiza para mostrar a opção de entrar na liga
        fetchLeagueDetails();
      } else {
        Alert.alert('Erro', 'Não foi possível sair da liga.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar sair da liga.');
    }
  };

  // Função para entrar na liga
  const joinLeague = async () => {
    try {
      const response = await fetch(`http://${ip}:${porta}/joinLeague`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          league_id: leagueId,
          user_id: userName, // Supondo que o userId está no contexto global
        }),
      });
  
      const data = await response.json(); // Recebe a mensagem do backend
  
      if (response.ok) {
        Alert.alert('Sucesso', data.message || 'Você entrou na liga com sucesso.');
        setIsMember(true); // Atualiza para mostrar a opção de sair da liga
        fetchLeagueDetails();
      } else {
        Alert.alert('Erro', data.error || 'Não foi possível entrar na liga.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao tentar entrar na liga.');
    }
  };
  

  // Função de confirmação antes de sair da liga
  const confirmLeaveLeague = () => {
    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja sair da liga?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sim', onPress: leaveLeague },
      ],
      { cancelable: true }
    );
  };

  if (!league) {
    return (
      <NativeBaseProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider>
      <View style={{ flex: 1, padding: 16, paddingTop: 40 }}>
        <VStack space={4}>
          {/* Cabeçalho com seta de retorno e nome da liga */}
          <HStack alignItems="center">
            <IconButton
              icon={
                <Icon
                  as={MaterialIcons}
                  name="arrow-back"
                  size="xl"
                  color="black" // Define a cor do ícone como preto
                />
              }
              onPress={() => navigation.goBack()} // Voltar à tela anterior
            />
            <Box flex={1} alignItems="center">
              <Text fontSize="2xl" bold>{league.name}</Text>
            </Box>
          </HStack>

          {/* Linha divisória usando a cor padrão */}
          <Box
            borderBottomWidth={2}
            borderBottomColor="#FC9904" // Cor padrão do seu app
            mt={4} // Margem superior para espaçar do cabeçalho
          />

          {/* Lista de membros em estilo tabela */}
          <Box bg="coolGray.100" p={5} rounded="md" shadow={2}>
            {league.members && league.members.length > 0 ? (
              league.members.map((member, index) => (
                <HStack
                  key={member.username || index}
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottomWidth={1}
                  borderBottomColor="coolGray.300"
                  py={2}
                >
                  <HStack alignItems="center" space={3}>
                    <Avatar bg="gray.500" size="sm" />
                    <Text>{member.username === userName ? 'Você' : member.username}</Text>
                  </HStack>
                  <Text>{member.score || 'N/A'} pts</Text>
                  <Text>{index + 1}º</Text>
                </HStack>
              ))
            ) : (
              <Text>Nenhum membro encontrado.</Text>
            )}
          </Box>

          {/* Botão de entrar ou sair da liga */}
          <Box alignItems="center" mt={4}>
            {isMember ? (
              <Button 
                colorScheme="red" 
                borderRadius={20} 
                px={6}
                onPress={confirmLeaveLeague} // Botão para sair da liga
              >
                Sair da liga
              </Button>
            ) : (
              <Button 
                colorScheme="green" 
                borderRadius={20} 
                px={6}
                onPress={joinLeague} // Botão para entrar na liga
              >
                Entrar na liga
              </Button>
            )}
          </Box>
        </VStack>
      </View>
    </NativeBaseProvider>
  );
};

export default LeagueDetails;
