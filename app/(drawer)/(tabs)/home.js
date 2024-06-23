import React, { useContext } from 'react';
import {
  NativeBaseProvider,
  Box,
  Text,
  Heading,
  Button,
  Divider,
  Image, 
} from "native-base";
import GlobalContext from '../../globalcontext';

const backgroundImage = require("../../../assets/images/nbb-brasil.png");

export default function HomeScreen() {
  const { teamName, selectedEmblem } = useContext(GlobalContext);

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
              <Text>{selectedEmblem}</Text> {/* Emblema */}
            </Box>

            {/* Nome do time */}
            <Box ml={10}>
              <Heading size="sm">Time: {teamName}</Heading>
            </Box>
          </Box>

          {/* Texto "Pontuação Total" */}
          <Box mt={-13} ml={150}>
            <Text>Pontuação Total:</Text>
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
              <Text>$100</Text>
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
              <Text>150</Text>
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
