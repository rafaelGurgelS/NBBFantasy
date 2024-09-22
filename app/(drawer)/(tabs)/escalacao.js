import React, { useState, useEffect,useContext } from 'react';
import { IconButton, FlatList, NativeBaseProvider, VStack, HStack, Box, Button, Text, Actionsheet, useDisclose, Image, Flex } from 'native-base';
import { FontAwesome } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';
import GlobalContext from '../../globalcontext';
import io from 'socket.io-client';

/*Errinho de lógica da rodada - tô passando a pontuação do jogador na fase de compra... isso nao era pra ser exibido nesse momento...
é bom a gente tirar a pontuação e tem q criar 2 estados nessa tela - mercado abero e mercado fechado/ resultado da rodada.
(então s.. td essa junção que eu fiz foi meio inútil, se bem q ja tendo essa info no item.pontuacao facilita pra exibir depois)
Além disso, tava olhando o figma... tem muita tela pra fazer ainda */ 


const EscalacaoScreen = () => {
  const { userName, setuserName, ip, setIP, porta, setPorta, lineupComplete, setLineupComplete } = useContext(GlobalContext);
  const [rodadaAtual, setRodadaAtual] = useState(null);
  const [userMoney, setUserMoney] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [teamName, setTeamName] = useState(null);
  const [error, setError] = useState(null);

  const [comprados, setComprados] = useState({
    'Ala/Armador': null,
    'Armador': null,
    'Pivô': null,
    'Ala/Pivô': null,
    'Ala': null
  });
  const [disponiveis, setDisponiveis] = useState({
    'Ala/Armador': [],
    'Armador': [],
    'Pivô': [],
    'Ala/Pivô': [],
    'Ala': [],
  });

  useEffect(() => {
    const socket = io(`http://${ip}:${porta}`);
    socket.on('update', (data) => {
      setRodadaAtual(data.current_round_id);
      fetchJogadores();
    });

    socket.on('info', (data) => {
      setRodadaAtual(data.current_round_id);
      fetchJogadores();
    });


    return () => {
      socket.disconnect();
    };
  }, [ip, porta]);

  useEffect(() => {
    if (userName) {
      fetchUserInfo();
    }
  }, [userName]);



  const fetchUserInfo = async () => {
    try {
      const response = await fetch(`http://${ip}:${porta}/get_user_info?username=${userName}`);
      if (response.ok) {
        const data = await response.json();
        
        // Atualiza o estado com o dinheiro do usuário e o nome do time
        setUserMoney(data.money);
        setTeamName(data.fantasy_team);
        
        // Povoar o dicionário de comprados com os jogadores retornados
        console.log('Jogadores recebidos:', data.players);

        // Povoar o dicionário de comprados com os jogadores retornados
        // Cria uma cópia do estado atual
      const novosComprados = { ...comprados };

      data.players.forEach((player) => {
        console.log('Processando jogador:', player);

        // Atualiza diretamente com o jogador para a posição correspondente
        novosComprados[player.posicao] = player;
      });

      console.log('comprados NOVO atualizado:', novosComprados);

      // Atualiza o estado
      setComprados(novosComprados);
      console.log('comprados atualizado:', comprados);
        
        //print(comprados)
        
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Erro ao buscar informações do usuário');
      }
    } catch (err) {
      setError('Erro ao se conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };
  

  const fetchJogadores = async () => {
    try {
      const response = await fetch(`http://${ip}:${porta}/jogadores`);
      const data = await response.json();
      setDisponiveis({
        'Ala/Armador': data.filter(jogador => jogador.posicao === 'Ala/Armador'),
        'Armador': data.filter(jogador => jogador.posicao === 'Armador'),
        'Pivô': data.filter(jogador => jogador.posicao === 'Pivô'),
        'Ala/Pivô': data.filter(jogador => jogador.posicao === 'Ala/Pivô'),
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

  const insertLineup = async (team_name, player_id) => {
    try {
      const response = await fetch(`http://${ip}:${porta}/insert_lineup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_name: team_name,
          player_id: player_id,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert(result.message);  // Exibe mensagem de sucesso
      } else {
        alert(result.error);  // Exibe mensagem de erro
      }
    } catch (error) {
      console.error('Erro ao inserir jogador:', error);
      alert('Erro ao conectar ao servidor');
    }
  };
  
  const removeLineup = async (team_name, player_id) => {
    try {
      const response = await fetch(`http://${ip}:${porta}/remove_lineup`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_name: team_name,
          player_id: player_id,
        }),
      });

      console.log(player_id, team_name);
  
      const result = await response.json();
      if (response.ok) {
        alert(result.message);  // Exibe mensagem de sucesso
      } else {
        alert(result.error);  // Exibe mensagem de erro
      }
    } catch (error) {
      console.error('Erro ao remover jogador:', error);
      alert('Erro ao conectar ao servidor');
    }
  };


  const insertMoney = async (username, newMoneyAmount) => {
    try {
      const response = await fetch(`http://${ip}:${porta}/update_user_money`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          new_money: newMoneyAmount,
        }),
      });
  
      const result = await response.json();
      if (response.ok) {
        console.log('Saldo atualizado com sucesso:', result.message);
      } else {
        console.error('Erro ao atualizar o saldo:', result.error);
      }
    } catch (error) {
      console.error('Erro ao conectar ao servidor:', error);
    }
  };


  const buyPlayer = async (jogador) => {
    if (comprados[selectedPosition]?.id === jogador.id) {
      alert('Este jogador já foi comprado.');
      return;
    }

    if (userMoney >= jogador.valor) {
      const previousPlayer = comprados[selectedPosition];
      let newMoney = userMoney - jogador.valor;
      console.log(jogador.valor)
      console.log(newMoney)

      if (previousPlayer) {
        newMoney += previousPlayer.valor;
        await removeLineup(teamName, previousPlayer.id);
      }

      await insertLineup(teamName , jogador.id);

      setUserMoney(newMoney);

      await insertMoney(userName, newMoney); 

      setComprados({ ...comprados, [selectedPosition]: jogador });
      onClose();
    } else {
      alert('Dinheiro insuficiente para comprar este jogador.');
    }
  };

  const cancelPurchase = async (jogador) => {
    const newMoney = userMoney + jogador.valor;
    setUserMoney(newMoney);
    await insertMoney(userName, newMoney);

    setComprados((prevComprados) => {
      const updatedComprados = { ...prevComprados };
      updatedComprados[selectedPosition] = null;
      return updatedComprados;
    });

    removeLineup(teamName, jogador.id)
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


  useEffect(() => {
    setLineupComplete(isComplete);
    console.log("Alterando status da escalação")
  }, [isComplete]);

  function renderItem({ item }) {
    return (
      <HStack key={item.id} justifyContent="space-between" alignItems="center" w="100%" px={4} py={2}>
        <VStack>
          <Text bold>{item.nome}</Text>
          <Text>Valor: R${item.valor}</Text>
          <Text>Time: {item.time}</Text>
          <Text>Posição: {item.posicao}</Text>
        </VStack>
        {comprados[selectedPosition]?.id === item.id ? (
          <HStack key={`comprado-${item.id}`}>
            <Text color="red.500">Comprado </Text>
            <Button colorScheme="red" borderRadius="20px" onPress={() => cancelPurchase(item)}>Cancelar</Button>
          </HStack>
        ) : (
          <Button
            bg="orange.400"
            onPress={() => buyPlayer(item)}
            borderRadius="20px"
            key={`comprar-${item.id}`}
          >
            Comprar
          </Button>
        )}
      </HStack>
    );
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
            <Text color="white" fontWeight="bold">R${(userMoney ?? 0).toFixed(2)}</Text>
          </Flex>
          <Flex flex={1} alignItems="center">
            {/* Verifica se a rodadaAtual está definida antes de exibir */}
            <Text color="white" fontWeight="bold">
              Rodada: {rodadaAtual !== null ? rodadaAtual : '-'}
            </Text>
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
                  icon={renderButtonIcon('Ala/Armador')}
                  onPress={() => selectPosition('Ala/Armador')}
                  mb={2}
                />
                {comprados['Ala/Armador'] && <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                  {comprados['Ala/Armador'].nome}</Text>}
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
                  icon={renderButtonIcon('Ala/Pivô')}
                  onPress={() => selectPosition('Ala/Pivô')}
                  mb={2}
                />
                {comprados['Ala/Pivô'] && <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
                  {comprados['Ala/Pivô'].nome}</Text>}
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
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={renderItem}
                ListFooterComponent={!loading ? <ActivityIndicator size="large" color="#FC9904" /> : null}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}s
              />
            )}
          </Actionsheet.Content>
        </Actionsheet>
      </VStack>
    </NativeBaseProvider>
  );
};

export default EscalacaoScreen;
