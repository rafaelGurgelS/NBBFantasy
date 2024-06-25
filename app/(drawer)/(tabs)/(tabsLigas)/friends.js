import React from 'react';
import { NativeBaseProvider, Text, View } from 'native-base';

const Friends = () => {
  return (
    <NativeBaseProvider>
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>Conteúdo de Meus Amigos</Text>
        {/* Adicione outros elementos ou botões conforme necessário */}
      </View>
    </NativeBaseProvider>
  );
}

export default Friends;
