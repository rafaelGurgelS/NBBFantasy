import React, { useState, useEffect, useContext } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { NativeBaseProvider, Box, Text, VStack, HStack } from 'native-base';
import { useRoute } from '@react-navigation/native';
import GlobalContext from '../globalcontext';

const LeagueDetails = () => {
  const route = useRoute();
  const { leagueId } = route.params; // Obtendo o leagueId passado na navegação
  const { ip, porta } = useContext(GlobalContext);
  const [league, setLeague] = useState(null);

  useEffect(() => {
    const fetchLeagueDetails = async () => {
      try {
        const response = await fetch(`http://${ip}:${porta}/leagueInfo?league_id=${leagueId}`);
        const data = await response.json();
        console.log("League Details:", data); // Verifique o formato dos dados recebidos
        setLeague(data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os detalhes da liga.');
      }
    };

    fetchLeagueDetails();
  }, [leagueId, ip, porta]);

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
      <View style={{ flex: 1, padding: 16 }}>
        <VStack space={4}>
          {/* Cabeçalho com o nome da liga */}
          <Box bg="coolGray.200" p={5} rounded="md" shadow={2} mb={4}>
            <Text fontSize="2xl" bold mb={1}>{league.name}</Text>
            <Text fontSize="md" color="coolGray.600">{league.description}</Text>
          </Box>

          {/* Lista de membros */}
          <Box bg="coolGray.100" p={5} rounded="md" shadow={2}>
            <Text fontSize="lg" bold mb={2}>Ranking dos Membros</Text>
            {league.members && league.members.length > 0 ? (
              league.members.map((member, index) => (
                <HStack key={member.username || index} justifyContent="space-between" mb={2} p={2} borderBottomWidth={1} borderBottomColor="coolGray.300">
                  <Text>{member.username}</Text>
                  {/* Exiba o valor adequado para o score se disponível */}
                  <Text bold>{member.score || 'N/A'}</Text>
                </HStack>
              ))
            ) : (
              <Text>Nenhum membro encontrado.</Text>
            )}
          </Box>
        </VStack>
      </View>
    </NativeBaseProvider>
  );
};

export default LeagueDetails;
