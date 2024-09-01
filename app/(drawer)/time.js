import React, { useState, useContext } from 'react';
import {
  VStack,
  Heading,
  Input,
  Text,
  FlatList,
  Box,
  Icon,
  useToast,
} from 'native-base';
import { TouchableOpacity, ImageBackground, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
//import GlobalContext from '../globalcontext.js';

export default function EditTeamScreen() {
  const router = useRouter(); 
  const toast = useToast();

  const [localTeamName, setLocalTeamName] = useState('INVENCÍVEIS');
  const [localSelectedEmblem, setLocalSelectedEmblem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const handleEmblemSelect = (id) => {
    setLocalSelectedEmblem(id);
    toast.show({
      title: "Sucesso",
      description: "Emblema alterado com sucesso!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      toast.show({
        title: "Sucesso",
        description: "Nome editado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputClick = () => {
    if (!isEditing) {
      toast.show({
        title: "Atenção",
        description: "Clique no ícone de lápis para editar o nome.",
        status: "warning",
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

          <View style={styles.textContainer}>
            <Text fontSize={25} color="#FFFFFF" textAlign="left">
              Nome:
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Input
              placeholder="Nome do time"
              variant="filled"
              width="100%"
              backgroundColor="#D9D9D9"
              borderRadius="full"
              height={50}
              fontSize={16}
              value={localTeamName}
              onChangeText={setLocalTeamName}
              isReadOnly={!isEditing}
              mb={4}
              onTouchStart={handleInputClick} 
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={toggleEditMode}
            >
              <Icon as={MaterialIcons} name={isEditing ? "check" : "edit"} size={6} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.textContainer}>
            <Text fontSize={25} color="#FFFFFF" textAlign="left">
              Emblema:
            </Text>
          </View>

          <View style={styles.separator} />

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
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#D9D9D9',
    marginVertical: 0,
  },
});
