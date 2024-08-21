import React, { useContext,useState,useEffect } from 'react';
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

export default function HomeScreen() {
  const { userName, setuserName } = useContext(GlobalContext);
  
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://192.168.1.193:5000/get_user_info?username=${userName}`);
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

    if (userName) {
      fetchUserInfo();
    }
  }, [userName]);

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






  return (
    <NativeBaseProvider>
      <Box flex={1} justifyContent="center" alignItems="center">
        {/* Imagem de fundo */}
        <Image
          source={backgroundImage}
          position="absolute"
          height="100%"
          width="100%"
          resizeMode="cover"
          alt="Background de NBB Brasil"
        />

        {/* Caixa laranja para informações do time */}
        <Box
          mt={-10}
          backgroundColor='orange.400'   //orange 400
          //color='green.600'
          borderRadius={10} 
          opacity={0.9}
          width="75%"
          height="50%"
        >
          {/* Emblema e Nome do Time lado a lado */}
          <Box flexDirection="row" alignItems="center"  ml={5} mt={5}>
            {/* Caixa cinza para o emblema */}
            <Box
              backgroundColor="#D3D3D3"
              borderRadius={10}
              width={24}
              height={24}
            >
              <Text>{userInfo.emblema}</Text> {/* Emblema */}
            </Box>

            {/* Nome do time */}
            <Box ml={10}>
              <Heading size="sm">Time: {userInfo.teamName}</Heading>
            </Box>
          </Box>

          {/* Texto "Pontuação Total" */}
          <Box mt={-13} ml={150}>
            <Text>Pontuação Total: </Text>
          </Box>

          {/* Caixa para dinheiro e pontuação total */}
          <Box flexDirection="row" justifyContent="flex-start" alignItems="center" ml={6} mt={2}>
            {/* Caixa para dinheiro */}
            <Box
              backgroundColor="#32CD32"
              borderRadius={5}
              alignItems="center"
              justifyContent="center"
              width={20}
              height={8}
            >
              <Text>{userInfo.dinheiro}</Text>
            </Box>

            {/* Caixa para pontuação total */}
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

          {/* Linha divisória */}
          <Divider borderWidth={1} borderColor="#A9A9A9" my={8} />

          {/* Status da Escalação */}
          <Box flexDirection="row" alignItems="center" ml={5}>
            {/* Espaço para imagem circular */}
            <Box
              backgroundColor="#D3D3D3"
              borderRadius="full"
              width={75}
              height={75}
            />

            <Text ml={10} mt={-10}>Status da Escalação</Text>
          </Box>

          {/* Botão Revisar alinhado abaixo do Status da Escalação */}
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
