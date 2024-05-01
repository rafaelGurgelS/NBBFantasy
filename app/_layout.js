import { Slot } from 'expo-router';
import { NativeBaseProvider } from 'native-base';
import { GlobalProvider } from './globalcontext.js';

export default function AppLayout() {
  return (
    <NativeBaseProvider> 
      <GlobalProvider> 
        <Slot /> 
      </GlobalProvider>
    </NativeBaseProvider>
  );
}
