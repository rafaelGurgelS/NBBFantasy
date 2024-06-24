import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Biblioteca de ícones

export default function Conta() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Time</Text>
      </View>
      <View style={styles.headerUnderline} />

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={styles.text}>Conteúdo do Meu Time</Text>
        {/* Adicione outros elementos ou botões conforme necessário */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40, // Espaçamento superior para a área segura
    paddingBottom: 10,
    paddingHorizontal: 10, // Adicionado para espaçamento horizontal
    backgroundColor: '#fff', // Cor de fundo do header
    borderBottomWidth: 2,
    borderBottomColor: '#FC9904', // Cor laranja do traço
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center', // Centraliza o título
    flex: 1, // Permite que o título ocupe o espaço restante
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
  },
});
