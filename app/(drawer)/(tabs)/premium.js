import React from 'react';
import { NativeBaseProvider, VStack, Heading, Box } from 'native-base';

export default function PremiumScreen() {
  return (
    <NativeBaseProvider>



      


      <VStack flex={1} justifyContent="center" alignItems="center">
        {/* Título no topo */}
        <Heading size="xl" mb={10}>
          VERSÃO PREMIUM
        </Heading>

        {/* Bloco laranja com bordas arredondadas */}
        <Box
          mt={-10}
          backgroundColor="#FFA500" 
          borderRadius={10} 
          opacity={0.9}
          width="75%" 
          height="50%" 
        >
          {/* Conteúdo do bloco laranja (por enquanto vazio) */}
        </Box>
      </VStack>
    </NativeBaseProvider>
  );
}
