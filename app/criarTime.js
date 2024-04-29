import React, { useState } from "react";
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
  useToast,
} from "native-base";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function TeamCreationScreen() {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [selectedEmblem, setSelectedEmblem] = useState(null);
  const toast = useToast();

  const emblemData = [
    { id: "1", name: "Emblema 1" },
    { id: "2", name: "Emblema 2" },
    { id: "3", name: "Emblema 3" },
    { id: "4", name: "Emblema 4" },
    { id: "5", name: "Emblema 5" },
    { id: "6", name: "Emblema 6" },
    { id: "7", name: "Emblema 7" },
    { id: "8", name: "Emblema 8" },
    { id: "9", name: "Emblema 9" },
    { id: "10", name: "Emblema 10" },
  ];

  const handleEmblemSelect = (id) => {
    setSelectedEmblem(id);
  };

  const handleComplete = () => {
    if (!teamName || !selectedEmblem) {
      toast.show({
        title: "Erro",
        description: "Preencha o nome do time e escolha um emblema.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Passa o nome do time e o emblema para a página home
      console.log("Values before pushing:", teamName, selectedEmblem);
      router.push({
        pathname: "/(tabs)/home",
        params: { teamName : teamName, selectedEmblem :selectedEmblem},
      });
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <VStack width="90%" space={5} alignItems="center" mt={-50}>
          <Heading size="xl" mb={10} textAlign="center">
            CRIE A SUA EQUIPE DE BASQUETE!
          </Heading>

          <Input
            placeholder="Nome do time"
            variant="filled"
            width="100%"
            backgroundColor="#D9D9D9"
            borderRadius="full"
            height={60}
            fontSize={16}
            value={teamName}
            onChangeText={(text) => setTeamName(text)}
          />

          <Text fontSize={20} textAlign="center" mt={10}>
            Escolha um emblema:
          </Text>

          <Divider borderWidth={1} borderColor="#FC9904" width="100%" mt={1} />

          <FlatList
            horizontal
            data={emblemData}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleEmblemSelect(item.id)}>
                <Box
                  padding={5}
                  borderColor={selectedEmblem === item.id ? "#FC9904" : "#D9D9D9"}
                  borderWidth={1}
                  borderRadius="full"
                  m={2}
                >
                  <Text>{item.name}</Text>
                </Box>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
          />

          <Button
            width="100%"
            backgroundColor="#FC9904"
            borderRadius="full"
            height={60}
            size="lg"
            justifyContent="center"
            alignItems="center"
            onPress={handleComplete}
          >
            <Text color="#55776D" fontSize={16}>Concluído</Text>
          </Button>
        </VStack>
      </Center>
    </NativeBaseProvider>
  );
}
