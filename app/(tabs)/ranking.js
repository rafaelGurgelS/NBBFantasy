import React from 'react';
import { NativeBaseProvider, VStack, Heading, Box, FlatList, Text } from 'native-base';

const data = Array.from({ length: 10 }, (_, index) => ({
  position: index + 1,
  name: `User ${index + 1}`,
  points: Math.floor(Math.random() * 100) + 1, // Pontos aleatórios entre 1 e 100
}));

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
          p={4} // Padding interno
        >
          {/* FlatList para exibir os dados */}
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <Box flexDirection="row" justifyContent="space-between" mb={2}>
                <Text>{item.position}</Text>
                <Text>{item.name}</Text>
                <Text>{item.points} pts</Text>
              </Box>
            )}
            keyExtractor={(item) => item.position.toString()}
          />
        </Box>
      </VStack>
    </NativeBaseProvider>
  );
}
