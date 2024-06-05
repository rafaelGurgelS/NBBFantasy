import React, { useState } from 'react';
import { NativeBaseProvider, VStack, Heading, Box, FlatList, Text, HStack, IconButton, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

// Sample match data
const matches = [
  { id: '1', match: 'FLA 55 X 65 BAU' },
  { id: '2', match: 'FLA 68 X 74 COR' },
  { id: '3', match: 'FLA 75 X 70 MIN' },
  { id: '4', match: 'FLA 80 X 85 SP' },
  { id: '5', match: 'FLA 90 X 95 RIO' },
  { id: '6', match: 'FLA 70 X 75 BSB' },
  { id: '7', match: 'FLA 65 X 60 REC' },
  { id: '8', match: 'FLA 80 X 78 SAL' },
  { id: '9', match: 'FLA 85 X 82 PAL' },
  { id: '10', match: 'FLA 88 X 87 BOT' }
];

const itemsPerPage = 5;

export default function PartidasScreen() {
  const [page, setPage] = useState(0);

  const handleNextPage = () => {
    setPage((prevPage) => (prevPage < Math.ceil(matches.length / itemsPerPage) - 1 ? prevPage + 1 : prevPage));
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage));
  };

  const currentPageMatches = matches.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  const roundTitle = `${9 + page}ª rodada`;

  return (
    <NativeBaseProvider>
      <VStack flex={1} justifyContent="center" alignItems="center">
        {/* Título no topo */}
        <Heading size="xl" mb={10}>
          PARTIDAS
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
          p={4}
        >
          <Text fontSize="lg" mb={4}>{roundTitle}</Text>
          <HStack alignItems="center" justifyContent="space-between" width="100%">
            <IconButton
              icon={<Icon as={MaterialIcons} name="chevron-left" />}
              onPress={handlePreviousPage}
              isDisabled={page === 0}
            />
            <FlatList
              data={currentPageMatches}
              renderItem={({ item }) => (
                <Box key={item.id} py={2}>
                  <Text>{item.match}</Text>
                </Box>
              )}
              keyExtractor={(item) => item.id}
            />
            <IconButton
              icon={<Icon as={MaterialIcons} name="chevron-right" />}
              onPress={handleNextPage}
              isDisabled={page === Math.ceil(matches.length / itemsPerPage) - 1}
            />
          </HStack>
        </Box>
      </VStack>
    </NativeBaseProvider>
  );
}
