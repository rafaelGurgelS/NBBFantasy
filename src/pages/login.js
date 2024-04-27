import React from "react";
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
} from "native-base";

export default function LoginScreen() {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <VStack
          width="90%"
          space={4}
          alignItems="center"
          mt={-160} // Para trazer o título mais para cima
        >
          <Heading size="xl" mb={10}>
            NBB FANTASY
          </Heading>

          <Input
            placeholder="Email"
            variant="filled"
            width="100%"
            backgroundColor="#D9D9D9"
            borderRadius="full"
            height={60} // Campo mais grosso
            fontSize={16} // Tamanho do texto no campo
          />

          <Input
            placeholder="Senha"
            variant="filled"
            width="100%"
            backgroundColor="#D9D9D9"
            borderRadius="full"
            height={60} // Campo mais grosso
            fontSize={16} // Tamanho do texto no campo
          />

          <Button
            width="100%"
            backgroundColor="#FC9904"
            borderRadius="full"
            height={60} // Botão mais grosso
            size="lg"
            justifyContent="center" // Centralizar verticalmente
            alignItems="center" // Centralizar horizontalmente
            paddingTop={6} // Ajustar para centralizar o texto verticalmente
            onPress={() => console.log("Entrar")}
          >
            <Text color="#55776D" fontSize={16}>Entrar</Text> {/* Texto centralizado */}
          </Button>
        </VStack>

        <Box position="absolute" bottom={5} width="100%"> {/* Linha horizontal completa */}
          <Divider borderWidth={1} borderColor="#FC9904"marginBottom={2}/>
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