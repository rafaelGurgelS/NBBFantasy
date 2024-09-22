import React, { useState, useContext } from 'react';
import {
  VStack,
  Heading,
  Input,
  Text,
  Button,
  Icon,
  useToast,
  Modal,
} from 'native-base';
import { TouchableOpacity, ImageBackground, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import GlobalContext from '../globalcontext';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import { useFonts } from 'expo-font'; // Import para carregar a fonte
import AppLoading from 'expo-app-loading'; // Para tela de carregamento enquanto a fonte é carregada

export default function Conta() {
  const router = useRouter(); 
  const toast = useToast();
  const navigation = useNavigation();

  const { userName, setuserName, ip, porta, senha, setSenha } = useContext(GlobalContext); 
  const [isEditingSenha, setIsEditingSenha] = useState(false);
  const [newSenha, setNewSenha] = useState(senha);
  const [showModal, setShowModal] = useState(false); 

  const [fontsLoaded] = useFonts({
    //   ../../../assets/images/quadra_nova.jpg
    //  C:\Users\clien\Documents\comp_movel_projetos\NBBFantasy\assets\fonts\Lacquer-Regular.ttf
    'Lacquer-Regular': require('../../assets/fonts/Lacquer-Regular.ttf'),
  });


  const updateUsuario = async (updatedSenha) => {
    console.log('Enviando dados para o backend:', {
      username: userName,
      new_password: updatedSenha,
    });
  
    try {
      const response = await fetch(`http://${ip}:${porta}/update_usuario`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userName,
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
        updateUsuario(newSenha); // Envia o novo nome de usuário e senha
        setSenha(newSenha); // Atualiza no contexto global
      } else {
        toast.show({
          title: "Erro",
          description: "A senha deve ter pelo menos 8 caracteres.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
    setIsEditingSenha(!isEditingSenha); // Alterna o modo de edição
  };

  const handleDeleteAccount = () => {
    setShowModal(true);
  };

  const deleteUsuario = async () => {
    try {
        // Verificar o valor de `ip`, `porta` e `userName`
        console.log(`URL: http://${ip}:${porta}/delete_usuario`);
        console.log(`Body: ${JSON.stringify({ username: userName })}`);
      
        const response = await fetch(`http://${ip}:${porta}/delete_usuario`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: userName }),
        });

        // Verificar o status da resposta
        const responseBody = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Body:', responseBody);
      
        if (response.ok) {
            toast.show({
                title: "Sucesso",
                description: "Conta excluída com sucesso!",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            setShowModal(false); // Fechar modal
            setuserName(null);
            setSenha(null);
            router.push('/');
        } else {
            // Detalhes do erro para depuração
            throw new Error(responseBody.error || 'Erro ao excluir a conta.');
        }
    } catch (error) {
        toast.show({
            title: "Erro",
            description: `Falha ao excluir a conta: ${error.message}`,
            status: "error",
            duration: 3000,
            isClosable: true,
        });
    }
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
            onPress={() => navigation.goBack()}
          >
            <Icon as={MaterialIcons} name="arrow-back" size={10} color="#FFFFFF" />
          </TouchableOpacity>

          <Heading size="lg" color="#FFFFFF" mb={4}  style={{ fontFamily: 'Lacquer-Regular' }}>
            SUA CONTA NBB FANTASY!
          </Heading>

          <View style={styles.textContainer}>
            <Text fontSize={25} color="#FFFFFF" textAlign="left" style={{ fontFamily: 'Lacquer-Regular' }}>
              Nome de usuário: {userName}
            </Text>
          </View>

          <View style={styles.textContainer}>
            <Text fontSize={25} color="#FFFFFF" textAlign="left" style={{ fontFamily: 'Lacquer-Regular' }}>
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

        {/* Modal de Confirmação */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="md">
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Confirmar Exclusão</Modal.Header>
            <Modal.Body>
              Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button variant="ghost" colorScheme="coolGray" onPress={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button colorScheme="red" onPress={deleteUsuario}>
                  Excluir
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        
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
