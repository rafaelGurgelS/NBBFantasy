import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer
    screenOptions={{ tabBarActiveTintColor: '#FC9904', 
      headerTitleAlign: 'center',
      headerStyle: {
        borderBottomWidth: 2, // Espessura da linha
        borderBottomColor: '#FC9904', // Cor laranja para a linha
      },
     }}>
      {/* Defina rotas do Drawer com base na estrutura do sistema de arquivos */}
      <Drawer.Screen
        name="(tabs)" 
        options={{
          drawerItemStyle: { display: 'none' }, // Oculta esta tela do menu do Drawer
          drawerLabel: 'tabs',
          drawerActiveBackgroundColor: '#FC9904',
          title: '', // O título pode ser atualizado dinamicamente
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
