import React, { useContext, useState, useEffect } from 'react';
import {
  VStack,
  Heading,
  Text,
  FlatList,
  Box,
  Icon,
  useToast,
} from 'native-base';
import { TouchableOpacity, ImageBackground, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import GlobalContext from '../globalcontext';

export default function EditTeamScreen() {
  const { userName, ip, porta } = useContext(GlobalContext); // Obtendo userName, ip, e porta do contexto
  const router = useRouter();
  const toast = useToast();

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSelectedEmblem, setLocalSelectedEmblem] = useState(null);

  // Emblemas disponíveis
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

  // Buscar informações do usuário
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://${ip}:${porta}/get_user_info?username=${userName}`);
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
          setLocalSelectedEmblem(data.emblema); // Marcar o emblema atual
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Erro ao buscar informações do usuário');
        }
      } catch (err) {
        setError('Erro ao se conectar com o servidor');
      } finally {
        setLoading(false);
      }
    };

    if (userName) {
      fetchUserInfo();
    }
  }, [userName, ip, porta]);

  // Função para atualizar o emblema no servidor
  const handleEmblemSelect = async (id) => {
    try {
      setLocalSelectedEmblem(id); // Atualiza o emblema localmente

      const response = await fetch(`http://${ip}:${porta}/update-emblem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_name: userInfo.teamName,
          new_emblem: id,
        }),
      });

      console.log('Nome do Time:', userInfo.teamName);
      console.log('Emblema:', id);

      if (response.ok) {
        toast.show({
          title: "Sucesso",
          description: "Emblema alterado com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        const errorData = await response.json();
        toast.show({
          title: "Erro",
          description: errorData.message || "Erro ao atualizar o emblema",
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
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/layoutDrawerTime.jpg')}
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
            SUA EQUIPE DE BASQUETE!
          </Heading>

          {loading ? (
            <Text color="#FFFFFF">Carregando...</Text>
          ) : error ? (
            <Text color="red.500">{error}</Text>
          ) : (
            <>
              <View style={styles.textContainer}>
                <Text fontSize={25} color="#FFFFFF" textAlign="left">
                  Nome: {userInfo?.teamName || 'N/A'}
                </Text>
              </View>

              <View style={styles.textContainer}>
                <Text fontSize={25} color="#FFFFFF" textAlign="left">
                  Emblema:
                </Text>
              </View>

              <FlatList
                horizontal
                data={emblemData}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleEmblemSelect(item.id)}>
                    <Box
                      padding={5}
                      borderColor={
                        localSelectedEmblem === item.id ? '#FC9904' : '#D9D9D9'
                      }
                      borderWidth={1}
                      borderRadius="full"
                      m={2}
                      backgroundColor={
                        localSelectedEmblem === item.id ? '#FFFFFF' : 'transparent'
                      }
                    >
                      <Text
                        color={localSelectedEmblem === item.id ? '#FC9904' : '#FFFFFF'}
                      >
                        {item.name}
                      </Text>
                    </Box>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
              />
            </>
          )}
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
  backButton: {
    position: 'absolute',
    top: 45,
    left: 20,
  },
});
