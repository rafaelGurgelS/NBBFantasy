import React, { useState,useContext } from "react";
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
import { useRouter } from "expo-router";
import GlobalContext from './globalcontext.js'; // Importe o contexto global

export default function Home() {
  const router = useRouter();
  const { userName, setuserName, ip, setIP, porta, setPorta } = useContext(GlobalContext);
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const toast = useToast();

  const handleLogin  = async() => {
    if (!userName || !senha) {
      // Se qualquer campo estiver vazio, exibe uma mensagem de aviso
      toast.show({
        title: "Erro",
        description: "Preencha todos os campos antes de continuar",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } 
    
    else if(senha!=senha2){
        toast.show({
            title: "Erro",
            description: "Senhas não correspondem",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
    }
    else if(senha==senha2 && senha.length<8){
      toast.show({
        title: "Erro",
        description: "Mínimo 8 caracteres",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
    else {
          // Monta o payload (os dados que serão enviados)
      const userData = {
        username: userName,
        senha: senha,
      };

      try {
        // Faz o POST para o endpoint de criação de usuário
        const response = await fetch(`http://${ip}:${porta}/insert_usuario`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData), // Converte os dados para JSON
        });

        // Verifica se a resposta foi bem-sucedida
        if (response.ok) {


          setuserName(userName);
          toast.show({
            title: "Sucesso",
            description: "Usuário criado com sucesso",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          router.push("/criarTime");
        } else {
          const errorData = await response.json();
          toast.show({
            title: "Erro",
            description: errorData.error || "Erro ao criar usuário",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        toast.show({
          title: "Erro",
          description: "Erro ao se conectar com o servidor",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
     
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <VStack width="90%" space={4} alignItems="center" mt={-160}>
          <Heading size="xl" mb={10}>
            CRIE SUA CONTA
          </Heading>

          <Text> Insira seu nome de usuário:</Text>


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
          />

          <Text> Insira uma senha:</Text>


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

            <Text>Senhas de no mínimo 8 caracteres</Text>


            <Text>Repita a senha:</Text>


            <Input
            placeholder="Senha"
            variant="filled"
            width="100%"
            backgroundColor="#D9D9D9"
            borderRadius="full"
            height={60}
            fontSize={16}
            secureTextEntry
            value={senha2}
            onChangeText={(text) => setSenha2(text)}
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

        
      </Center>
    </NativeBaseProvider>
  );
}
