import { Drawer } from 'expo-router/drawer';
import CountdownTimer from '../../timer';
import { View, Text } from 'react-native';

export default function DrawerLayout() {
  return (
    <Drawer>
      {/* Defina rotas do Drawer com base na estrutura do sistema de arquivos */}
      <Drawer.Screen
        name="home" // Assumindo que esta é a rota principal
        options={{
          drawerLabel: 'Home',
          drawerActiveBackgroundColor: '#FC9904',
          headerTitleAlign: 'center',
          headerTitle: () => (
            <View>
              <Text style={{fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>
                Tempo para próxima partida:
                </Text>
                <View style={{justifyContent: 'center', alignItems: 'center' }}>
                  <CountdownTimer initialInterval={60 * 60 * 1000} />
              </View>
            </View>
          ),
          headerStyle: {
            borderBottomWidth: 2, // Espessura da linha
            borderBottomColor: '#FC9904',
          },
        }}
      />
      <Drawer.Screen
        name="conta" // Rota para a tela "Minha Conta"
        options={{
          drawerLabel: 'Minha Conta',
          drawerActiveBackgroundColor: '#FC9904',
          title: 'Minha Conta',
        }}
      />
      <Drawer.Screen
        name="time" // Rota para a tela "Meu Time"
        options={{
          drawerLabel: 'Meu Time',
          drawerActiveBackgroundColor: '#FC9904',
          title: 'Meu Time',
        }}
      />
    </Drawer>
  );
}
