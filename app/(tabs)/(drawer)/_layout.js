import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return (
    <Drawer>
      {/* Defina rotas do Drawer com base na estrutura do sistema de arquivos */}
      <Drawer.Screen
        name="home" // Assumindo que esta é a rota principal
        options={{
          drawerLabel: 'Home',
          title: 'Home',
        }}
      />
      <Drawer.Screen
        name="conta" // Rota para a tela "Minha Conta"
        options={{
          drawerLabel: 'Minha Conta',
          title: 'Minha Conta',
        }}
      />
      <Drawer.Screen
        name="time" // Rota para a tela "Meu Time"
        options={{
          drawerLabel: 'Meu Time',
          title: 'Meu Time',
        }}
      />
    </Drawer>
  );
}
