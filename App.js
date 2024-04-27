import React from "react";
import { NativeBaseProvider } from "native-base";

// Caminho corrigido para importar corretamente
import LoginScreen from './src/pages/login';
import TeamCreationScreen from './src/pages/criarTime';

export default function App() {
  return (
    <NativeBaseProvider>
      <TeamCreationScreen /> 
    </NativeBaseProvider>
  );
}
