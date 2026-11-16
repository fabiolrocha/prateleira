import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BoasVindas } from '../screens/BoasVindas';
import { ConfirmarProduto } from '../screens/ConfirmarProduto';
import { Escanear } from '../screens/Escanear';
import { Tour } from '../screens/Tour';
import { TabRouter } from './TabRouter';
import type { RootStackParams } from './tipos';

const Pilha = createNativeStackNavigator<RootStackParams>();

export function RootStack() {
  return (
    <Pilha.Navigator initialRouteName="BoasVindas" screenOptions={{ headerShown: false }}>
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
