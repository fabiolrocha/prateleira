import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Despensa } from '../screens/Despensa';
import { DetalheProduto } from '../screens/DetalheProduto';
import type { DespensaStackParams } from './tipos';

const Pilha = createNativeStackNavigator<DespensaStackParams>();

export function DespensaStack() {
  return (
    <Pilha.Navigator screenOptions={{ headerShown: false }}>
      <Pilha.Screen name="Despensa" component={Despensa} />
      <Pilha.Screen name="DetalheProduto" component={DetalheProduto} />
    </Pilha.Navigator>
  );
}
