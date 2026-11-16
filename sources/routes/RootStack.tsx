import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useUsuario } from '../contexts/UsuarioContext';
import { BoasVindas } from '../screens/BoasVindas';
import { ConfirmarProduto } from '../screens/ConfirmarProduto';
import { Escanear } from '../screens/Escanear';
import { Tour } from '../screens/Tour';
import { cores } from '../tema';
import { TabRouter } from './TabRouter';
import type { RootStackParams } from './tipos';

const Pilha = createNativeStackNavigator<RootStackParams>();

export function RootStack() {
  const { usuario, carregando } = useUsuario();

  if (carregando) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator color={cores.destaque} />
      </View>
    );
  }

  return (
    <Pilha.Navigator
      initialRouteName={usuario ? 'Abas' : 'BoasVindas'}
      screenOptions={{ headerShown: false }}
    >
      <Pilha.Group>
        <Pilha.Screen name="BoasVindas" component={BoasVindas} />
        <Pilha.Screen name="Tour" component={Tour} />
        <Pilha.Screen name="Abas" component={TabRouter} />
      </Pilha.Group>
      <Pilha.Group screenOptions={{ presentation: 'modal' }}>
        <Pilha.Screen name="Escanear" component={Escanear} />
        <Pilha.Screen name="ConfirmarProduto" component={ConfirmarProduto} />
      </Pilha.Group>
    </Pilha.Navigator>
  );
}

const styles = StyleSheet.create({
  carregando: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
});