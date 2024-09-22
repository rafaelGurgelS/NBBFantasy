import React, { useState, useContext,useEffect } from "react";
import {
  NativeBaseProvider,
  VStack,
  Center,
  Heading,
  Input,
  Button,
  Text,
  Box,
  Divider,
  useToast,
  HStack
} from "native-base";
import { useRouter, Link } from "expo-router";
import GlobalContext from './globalcontext.js'; 
import { useFonts } from 'expo-font';
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

export default function Home() {
  const router = useRouter();
  const toast = useToast();

  const { userName, setuserName, ip, setIP, porta, setPorta, senha, setSenha } = useContext(GlobalContext); // Usa o contexto global
  
  const [fontsLoaded] = useFonts({
    //   ../../../assets/images/quadra_nova.jpg
    //  C:\Users\clien\Documents\comp_movel_projetos\NBBFantasy\assets\fonts\Lacquer-Regular.ttf
    'Lacquer-Regular': require('../assets/fonts/Lacquer-Regular.ttf'),
  });


  if (!fontsLoaded) {
    return <AppLoading />;
  }
  
  const handleLogin = async () => {
    if (!userName || !senha) {
      toast.show({
        title: "Erro",
        description: "Preencha todos os campos antes de continuar",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch(`http://${ip}:${porta}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName, senha: senha }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.redirect === "home") {
          router.push("/home");
        } else if (data.redirect === "criarTime") {
          router.push("/criarTime");
        }
      } else {
        toast.show({
          title: "Erro",
          description: data.error,
          status: "danger",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast.show({
        title: "Erro",
        description: "Erro de comunicação com o servidor",
        status: "danger",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <VStack width="90%" space={4} alignItems="center" mt={-160}>
        <Text fontSize="4xl" mb={10} style={{ fontFamily: 'Lacquer-Regular' }} >
          NBB FANTASY
        </Text>


          <Input
            placeholder="Nome de usuário"
            variant="filled"
            width="100%"
            backgroundColor="#D9D9D9"
            borderRadius="full"
            height={60}
            fontSize={16}
            value={userName}
            onChangeText={(text) => setuserName(text)}
            borderColor="transparent" 
            _focus={{
              borderColor: "#FC9904", 
              borderWidth: 2 
            }}
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
            borderColor="transparent" 
            _focus={{
              borderColor: "#FC9904", 
              borderWidth: 2 
            }}
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
          <HStack justifyContent="center" alignItems="center">
            <Text mr={1} color="#A99797" textAlign="center">
              {"Não tem conta?"}
            </Text>
            <Link href="/signup" _text={{ color: "blue.100" }}>
              Registre-se!
            </Link>
          </HStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
}
