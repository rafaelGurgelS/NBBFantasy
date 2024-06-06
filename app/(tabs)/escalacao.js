import React from 'react';
import { NativeBaseProvider, VStack, HStack, Heading, Box, Button } from 'native-base';

export default function EscalacaoScreen() {
  return (
    <NativeBaseProvider>
      <VStack flex={1} justifyContent="center" alignItems="center">
        {/* Título no topo */}
        <Heading size="xl" mb={10}>
          ESCALAÇÃO
        </Heading>

        {/* Bloco laranja com bordas arredondadas */}
        <Box
          mt={-10}
          backgroundColor="#FFA500" // Cor laranja
          borderRadius={10} // Borda arredondada
          opacity={0.9}
          width="75%" // Largura ajustável
          height="50%" // Altura ajustável
          justifyContent="center"
          alignItems="center"
        >
          {/* Container para os botões */}
          <VStack flex={1}  alignItems="center" py={4}>
            {/* Linha superior */}
            <HStack space={6}>
              <Button
                size="lg"
                borderRadius="full"
                backgroundColor="white"
                width={16}
                height={16}
              />
              <Button
                size="lg"
                borderRadius="full"
                backgroundColor="white"
                width={16}
                height={16}
              />
              <Button
                size="lg"
                borderRadius="full"
                backgroundColor="white"
                width={16}
                height={16}
              />
            </HStack>

            {/* Linha inferior */}
            <HStack space={10} mt={6}>
              <Button
                size="lg"
                borderRadius="full"
                backgroundColor="white"
                width={16}
                height={16}
              />
              <Button
                size="lg"
                borderRadius="full"
                backgroundColor="white"
                width={16}
                height={16}
              />
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </NativeBaseProvider>
  );
}
