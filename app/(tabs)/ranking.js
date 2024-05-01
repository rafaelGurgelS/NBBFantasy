import React from 'react';
import { NativeBaseProvider, VStack, Heading, Box } from 'native-base';

export default function RankingScreen() {
  return (
    <NativeBaseProvider>
      <VStack flex={1} justifyContent="center" alignItems="center">
        {/* Título no topo */}
        <Heading size="xl" mb={10}>
          RANKING
        </Heading>

        {/* Bloco laranja com bordas arredondadas */}
        <Box
          mt={-10}
          backgroundColor="#FFA500" // Cor laranja
          borderRadius={10} // Borda arredondada
          opacity={0.9}
          width="75%" // Largura ajustável
          height="50%" // Altura ajustável
        >
          {/* Conteúdo do bloco laranja (por enquanto vazio) */}
        </Box>
      </VStack>
    </NativeBaseProvider>
  );
}
