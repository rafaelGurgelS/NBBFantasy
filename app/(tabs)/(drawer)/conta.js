import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from 'expo-router';

export default function Conta() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Minha Conta</Text>
      {/* Adicione outros elementos ou botões conforme necessário */}
    </View>
  );
}
