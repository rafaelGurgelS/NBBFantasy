import React, { useState } from 'react';
import {
  VStack,
  Heading,
  Input,
  Text,
  Button,
  Icon,
  useToast,
} from 'native-base';
import { TouchableOpacity, ImageBackground, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';

export default function Conta() {
  const router = useRouter(); 
  const toast = useToast();

  const [email, setEmail] = useState('user@example.com');
  const [senha, setSenha] = useState('********');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingSenha, setIsEditingSenha] = useState(false);

  const toggleEditEmail = () => {
    setIsEditingEmail(!isEditingEmail);
    if (isEditingEmail) {
      toast.show({
        title: "Sucesso",
        description: "Email editado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const toggleEditSenha = () => {
    setIsEditingSenha(!isEditingSenha);
    if (isEditingSenha) {
      toast.show({
        title: "Sucesso",
        description: "Senha editada com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputClick = (type) => {
    if (type === 'email' && !isEditingEmail) {
      toast.show({
        title: "Atenção",
        description: "Clique no ícone de lápis para editar o email.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else if (type === 'senha' && !isEditingSenha) {
      toast.show({
        title: "Atenção",
        description: "Clique no ícone de lápis para editar a senha.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAccount = () => {
    toast.show({
      title: "Confirmação",
      description: "Tem certeza de que deseja excluir sua conta?",
      status: "warning",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/layoutDrawerConta.jpg')} 
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <VStack
          width="85%"
          space={5}
          alignItems="center"
          padding={4}
          borderRadius="lg"
          style={styles.vStack}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(drawer)/(tabs)/home')}
          >
            <Icon as={MaterialIcons} name="arrow-back" size={10} color="#FFFFFF" />
          </TouchableOpacity>

          <Heading size="lg" color="#FFFFFF" mb={4}>
            SUA CONTA NBB FANTASY!
          </Heading>

          <View style={styles.textContainer}>
            <Text fontSize={25} color="#FFFFFF" textAlign="left">
              Email:
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Input
              placeholder="Email"
              variant="filled"
              width="100%"
              backgroundColor="#D9D9D9"
              borderRadius="full"
              height={50}
              fontSize={16}
              value={email}
              onChangeText={setEmail}
              isReadOnly={!isEditingEmail}
              mb={4}
              onTouchStart={() => handleInputClick('email')}
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={toggleEditEmail}
            >
              <Icon as={MaterialIcons} name={isEditingEmail ? "check" : "edit"} size={6} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.textContainer}>
            <Text fontSize={25} color="#FFFFFF" textAlign="left">
              Senha:
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Input
              placeholder="Senha"
              variant="filled"
              width="100%"
              backgroundColor="#D9D9D9"
              borderRadius="full"
              height={50}
              fontSize={16}
              value={senha}
              onChangeText={setSenha}
              isReadOnly={!isEditingSenha}
              mb={6} // Espaço aumentado entre o campo da senha e o botão
              onTouchStart={() => handleInputClick('senha')}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={toggleEditSenha}
            >
              <Icon as={MaterialIcons} name={isEditingSenha ? "check" : "edit"} size={6} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Container para o botão de excluir conta */}
          <View style={styles.deleteButtonContainer}>
            <Button
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteButtonText}>Excluir Conta</Text>
            </Button>
          </View>
        </VStack>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vStack: {
    justifyContent: 'center',
    paddingBottom: 250,
  },
  textContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editButton: {
    marginLeft: 10,
  },
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
  },
  deleteButtonContainer: {
    width: '100%',
    alignItems: 'center', // Centraliza o botão horizontalmente
    marginTop: 40, // Espaço antes do botão
  },
  deleteButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderColor: '#FC9904',
    borderWidth: 1,
    width: '80%', // Largura do botão
    paddingVertical: 12,
  },
  deleteButtonText: {
    color: '#FC9904',
    fontSize: 16,
    textAlign: 'center',
  },
});
