import React, { useContext, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native'; 
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  Button,
  Divider,
  Image, 
  Spinner
} from "native-base";
import GlobalContext from '../../globalcontext';

const backgroundImage = require("../../../assets/images/nbb-brasil.png");

// Dados dos emblemas
const emblemData = [
  { id: '1', name: 'Emblema 1', image: require('../../../assets/images/emblems/icon_1.png') },
  { id: '2', name: 'Emblema 2', image: require('../../../assets/images/emblems/icon_2.png') },
  { id: '3', name: 'Emblema 3', image: require('../../../assets/images/emblems/icon_3.png') },
  { id: '4', name: 'Emblema 4', image: require('../../../assets/images/emblems/icon_4.png') },
  { id: '5', name: 'Emblema 5', image: require('../../../assets/images/emblems/icon_5.png') },
  { id: '6', name: 'Emblema 6', image: require('../../../assets/images/emblems/icon_6.png') },
  { id: '7', name: 'Emblema 7', image: require('../../../assets/images/emblems/icon_7.png') },
  { id: '8', name: 'Emblema 8', image: require('../../../assets/images/emblems/icon_8.png') },
  { id: '9', name: 'Emblema 9', image: require('../../../assets/images/emblems/icon_9.png') },
];

export default function HomeScreen() {
  const { userName, ip, porta } = useContext(GlobalContext);
  
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserInfo = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://${ip}:${porta}/get_user_info?username=${userName}`);
          if (response.ok) {
            const data = await response.json();
            setUserInfo(data);
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

      if (userName && ip && porta) {
        fetchUserInfo();
      } else {
        setError('Parâmetros de configuração ausentes.');
        setLoading(false);
      }
    }, [userName, ip, porta]) // Dependências para atualizar o fetch
  );

  if (loading) {
    return (
      <NativeBaseProvider>
        <Box flex={1} justifyContent="center" alignItems="center">
          <Spinner size="lg" />
        </Box>
      </NativeBaseProvider>
    );
  }

  if (error) {
    return (
      <NativeBaseProvider>
        <Box flex={1} justifyContent="center" alignItems="center">
          <Text color="red.500">{error}</Text>
        </Box>
      </NativeBaseProvider>
    );
  }

  // Encontrar o emblema com base no ID
  const emblem = emblemData.find(e => e.id === userInfo.emblema);

  return (
    <NativeBaseProvider>
      <Box flex={1} justifyContent="center" alignItems="center">
        <Image
          source={backgroundImage}
          position="absolute"
          height="100%"
          width="100%"
          resizeMode="cover"
          alt="Background de NBB Brasil"
        />
        <Box
          mt={-10}
          backgroundColor='orange.400'
          borderRadius={10}
          opacity={0.9}
          width="75%"
          height="50%"
        >
          <Box flexDirection="row" alignItems="center" ml={5} mt={5}>
            {/* Renderizar a imagem do emblema sem o quadrado cinza */}
            {emblem && (
              <Image
                source={emblem.image}
                alt={emblem.name}
                width={24}
                height={24}
                resizeMode="contain"
              />
            )}
            <Box ml={10}>
              <Heading size="sm">Time: {userInfo.fantasy_team}</Heading>
            </Box>
          </Box>
          <Box mt={-13} ml={150}>
            <Text>Pontuação Total: </Text>
          </Box>
          <Box flexDirection="row" justifyContent="flex-start" alignItems="center" ml={6} mt={2}>
            <Box
              backgroundColor="#32CD32"
              borderRadius={5}
              alignItems="center"
              justifyContent="center"
              width={20}
              height={8}
            >
              <Text>{userInfo.money}</Text>
            </Box>
            <Box ml={65}
              backgroundColor="#D3D3D3"
              borderRadius={5}
              alignItems="center"
              justifyContent="center"
              width={20}
              height={8}
            >
              <Text>{userInfo.pontuacao}</Text>
            </Box>
          </Box>
          <Divider borderWidth={1} borderColor="#A9A9A9" my={8} />
          <Box flexDirection="row" alignItems="center" ml={5}>
            <Box
              backgroundColor="#D3D3D3"
              borderRadius="full"
              width={75}
              height={75}
            />
            <Text ml={10} mt={-10}>Status da Escalação</Text>
          </Box>
          <Box alignItems="center" mt={-10} ml={20}>
            <Button
              backgroundColor="#D3D3D3"
              borderRadius="full"
            >
              Revisar
            </Button>
          </Box>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}
