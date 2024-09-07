import React, { useState, useContext } from 'react';
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
import GlobalContext from '../globalcontext';

export default function Conta() {
  const router = useRouter(); 
  const toast = useToast();

  const { userName, setuserName, ip, porta, senha, setSenha } = useContext(GlobalContext); 
  const [isEditingUserName, setIsEditingUserName] = useState(false);
  const [isEditingSenha, setIsEditingSenha] = useState(false);

  // Variáveis de estado locais para controlar o novo valor durante a edição
  const [newUserName, setNewUserName] = useState(userName);
  const [newSenha, setNewSenha] = useState(senha);

  const updateUsuario = async (updatedSenha) => {
    console.log('Enviando dados para o backend:', {
      
      new_password: updatedSenha,
    });
  
    try {
      const response = await fetch(`http://${ip}:${porta}/update_usuario`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
         
          new_password: updatedSenha,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.show({
            title: "Sucesso",
            description: "Informações atualizadas com sucesso!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error(data.message || 'Erro ao atualizar');
        }
      } else {
        throw new Error('Erro de rede ou do servidor');
      }
    } catch (error) {
      toast.show({
        title: "Erro",
        description: `Falha ao atualizar informações: ${error.message}`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };


  const toggleEditSenha = () => {
    if (isEditingSenha && newSenha !== senha) { 
      if (newSenha.length >= 8) { // Verifica se a nova senha tem pelo menos 8 caracteres
        updateUsuario(newUserName, newSenha); // Envia o novo nome de usuário e senha
        setSenha(newSenha); // Atualiza no contexto global
      } else {
        alert("A senha deve ter pelo menos 8 caracteres."); // Alerta se a senha for muito curta
      }
    }
    setIsEditingSenha(!isEditingSenha); // Alterna o modo de edição
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
              Nome de usuário: {userName}
            </Text>
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
              value={newSenha} // Usando o novo valor local
              onChangeText={setNewSenha} // Atualizando o estado local
              isReadOnly={!isEditingSenha}
              mb={6}
              secureTextEntry
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={toggleEditSenha}
            >
              <Icon as={MaterialIcons} name={isEditingSenha ? "check" : "edit"} size={6} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

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
    alignItems: 'center', 
    marginTop: 40, 
  },
  deleteButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderColor: '#FC9904',
    borderWidth: 1,
    width: '80%', 
    paddingVertical: 12,
  },
  deleteButtonText: {
    color: '#FC9904',
    fontSize: 16,
    textAlign: 'center',
  },
});
