import React from "react";
import {
  NativeBaseProvider,
  VStack,
  Center,
  Heading,
  Input,
  Button,
  Text,
  Divider,
  FlatList,
  Box,
} from "native-base";

export default function TeamCreationScreen() {
  const emblemData = [
    { id: '1', name: 'Emblema 1' },
    { id: '2', name: 'Emblema 2' },
    { id: '3', name: 'Emblema 3' },
    { id: '4', name: 'Emblema 4' },
    { id: '5', name: 'Emblema 5' },
    { id: '6', name: 'Emblema 6' },
    { id: '7', name: 'Emblema 7' },
    { id: '8', name: 'Emblema 8' },
    { id: '9', name: 'Emblema 9' },
    { id: '10', name: 'Emblema 10' },
  ];

  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <VStack
          width="90%"
          space={5}
          alignItems="center"
          mt={-50} // Para trazer o título mais para cima
        >
          {/* Centralizar o título e manter centralizado em quebra de linha */}
          <Heading size="xl" mb={10} textAlign="center">
            CRIE A SUA EQUIPE DE BASQUETE!
          </Heading>

          <Input
            placeholder="Nome do time"
            variant="filled"
            width="100%"
            backgroundColor="#D9D9D9"
            borderRadius="full"
            height={60} // Campo mais grosso
            fontSize={16} // Tamanho do texto no campo
            mt={10}
          />

          {/* Espaço em branco entre o campo e a frase "Escolha um emblema:" */}
          <Text fontSize={20} textAlign="center" mt={10}>
            Escolha um emblema:
          </Text>

          {/* Linha horizontal laranja */}
          <Divider borderWidth={1} borderColor="#FC9904" width="100%" mt={-2} />

          {/* FlatList horizontal para emblemas */}
          <FlatList
            horizontal
            data={emblemData}
            renderItem={({ item }) => (
              <Box padding={5} borderColor="#FC9904" borderWidth={1} borderRadius="full" m={2}>
                <Text>{item.name}</Text>
              </Box>
            )}
            keyExtractor={(item) => item.id}
          />

          {/* Botão "Concluído" */}
          <Button
            width="100%"
            backgroundColor="#FC9904"
            borderRadius="full"
            height={60} // Botão mais grosso
            size="lg"
            justifyContent="center" // Centralizar verticalmente
            alignItems="center" // Centralizar horizontalmente
            onPress={() => console.log("Concluído")}
          >
            <Text color="#55776D" fontSize={16}>Concluído</Text>
          </Button>
        </VStack>
      </Center>
    </NativeBaseProvider>
  );
}
