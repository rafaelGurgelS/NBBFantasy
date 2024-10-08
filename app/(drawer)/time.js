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
import { useNavigation } from '@react-navigation/native';


export default function EditTeamScreen() {
  const { userName, ip, porta } = useContext(GlobalContext); // Obtendo userName, ip, e porta do contexto
  const router = useRouter();
  const toast = useToast();
  const navigation = useNavigation();

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSelectedEmblem, setLocalSelectedEmblem] = useState(null);

  // Emblemas disponíveis
  const emblemData = [
    { id: '1', name: 'Emblema 1', image: require('../../assets/images/emblems/icon_1.png') },
    { id: '2', name: 'Emblema 2', image: require('../../assets/images/emblems/icon_2.png') },
    { id: '3', name: 'Emblema 3', image: require('../../assets/images/emblems/icon_3.png') },
    { id: '4', name: 'Emblema 4', image: require('../../assets/images/emblems/icon_4.png') },
    { id: '5', name: 'Emblema 5', image: require('../../assets/images/emblems/icon_5.png') },
    { id: '6', name: 'Emblema 6', image: require('../../assets/images/emblems/icon_6.png') },
    { id: '7', name: 'Emblema 7', image: require('../../assets/images/emblems/icon_7.png') },
    { id: '8', name: 'Emblema 8', image: require('../../assets/images/emblems/icon_8.png') },
    { id: '9', name: 'Emblema 9', image: require('../../assets/images/emblems/icon_9.png') },
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
          team_name: userInfo.fantasy_team,
          new_emblem: id,
        }),
      });

      console.log('Nome do Time:', userInfo.fantasy_team);
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
            onPress={() => navigation.goBack()}
          >
            <Icon as={MaterialIcons} name="arrow-back" size={10} color="#FFFFFF" />
          </TouchableOpacity>

          <Heading size="lg" color="#FFFFFF" mb={4}>
            <Text style={{ fontFamily: 'Lacquer-Regular' }}> SUA EQUIPE DE BASQUETE! </Text>
          </Heading>

          {loading ? (
            <Text color="#FFFFFF">Carregando...</Text>
          ) : error ? (
            <Text color="red.500">{error}</Text>
          ) : (
            <>
              <View style={styles.textContainer}>
                <Text fontSize={25} color="#FFFFFF" textAlign="left" style={{ fontFamily: 'Lacquer-Regular' }}>
                  Nome: {userInfo?.fantasy_team || 'N/A'}
                </Text>
              </View>

              <View style={styles.textContainer}>
                <Text fontSize={25} color="#FFFFFF" textAlign="left" style={{ fontFamily: 'Lacquer-Regular' }}>
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
                      borderWidth={2}
                      borderRadius="full"
                      m={2}
                      backgroundColor={
                        localSelectedEmblem === item.id ? '#FFFFFF' : 'transparent'
                      }
                      alignItems="center"
                    >
                      <ImageBackground
                        source={item.image} // Renderiza a imagem do emblema
                        style={styles.emblemImage} // Aqui o estilo será atualizado
                        imageStyle={styles.emblemImageStyle} // Adicionando um estilo interno para bordas arredondadas
                      />
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
  emblemImage: {
    width: 80,  
    height: 80,
  },

  emblemImageStyle: {
    borderRadius: 40,
  },
});
