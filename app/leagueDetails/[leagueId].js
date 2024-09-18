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
  const { ip, porta } = useContext(GlobalContext);
  const [league, setLeague] = useState(null);

  useEffect(() => {
    const fetchLeagueDetails = async () => {
      try {
        const response = await fetch(`http://${ip}:${porta}/leagueInfo?league_id=${leagueId}`);
        const data = await response.json();
        console.log("League Details:", data);
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
                    <Text>{member.username === 'Você' ? 'Você' : member.username}</Text>
                  </HStack>
                  <Text>{member.score || 'N/A'} pts</Text>
                  <Text>{index + 1}º</Text>
                </HStack>
              ))
            ) : (
              <Text>Nenhum membro encontrado.</Text>
            )}
          </Box>

          {/* Botão de sair da liga */}
          <Box alignItems="center" mt={4}>
            <TouchableOpacity onPress={() => Alert.alert('Sair da liga', 'Você saiu da liga!')}>
              <Button colorScheme="red" borderRadius={20} px={6}>
                Sair da liga
              </Button>
            </TouchableOpacity>
          </Box>
        </VStack>
      </View>
    </NativeBaseProvider>
  );
};

export default LeagueDetails;
