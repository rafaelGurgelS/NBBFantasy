import React, { useState } from "react";
import {
  NativeBaseProvider,
  VStack,
  Center,
  Heading,
  Input,
  Button,
  Text,
  Link,
  Box,
  Divider,
  useToast,
} from "native-base";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const toast = useToast();

  const handleLogin = () => {
    if (!email || !senha) {
      // Se qualquer campo estiver vazio, exibe uma mensagem de aviso
      toast.show({
        title: "Erro",
        description: "Preencha todos os campos antes de continuar",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Se os campos não estiverem vazios, navega para a próxima tela
      router.push("/criarTime"); // Muda o caminho para a rota da tela desejada
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <VStack width="90%" space={4} alignItems="center" mt={-160}>
          <Heading size="xl" mb={10}>
            NBB FANTASY
          </Heading>

          <Input
            placeholder="Email"
            variant="filled"
            width="100%"
            backgroundColor="#D9D9D9"
            borderRadius="full"
            height={60}
            fontSize={16}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />

          <Input
            placeholder="Senha"
            variant="filled"
            width="100%"
            backgroundColor="#D9D9D9"
            borderRadius="full"
            height={60}
            fontSize={16}
            secureTextEntry
            value={senha}
            onChangeText={(text) => setSenha(text)}
          />

          <Button
            width="100%"
            backgroundColor="#FC9904"
            borderRadius="full"
            height={60}
            size="lg"
            justifyContent="center"
            alignItems="center"
            paddingTop={3}
            onPress={handleLogin}
          >
            <Text color="#55776D" fontSize={16}>
              Entrar
            </Text>
          </Button>
        </VStack>

        <Box position="absolute" bottom={5} width="100%">
          <Divider borderWidth={1} borderColor="#FC9904" marginBottom={2} />
          <Text color="#A99797" textAlign="center">
            {" "}
            <Link href="/signup" color="blue.500">
              Não tem conta? Registre-se!
            </Link>
          </Text>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}
