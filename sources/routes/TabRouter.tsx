import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBar } from '../components/TabBar';
import { Ajustes } from '../screens/Ajustes';
import { Home } from '../screens/Home';
import { Lista } from '../screens/Lista';
import { DespensaStack } from './DespensaStack';
import type { TabParams } from './tipos';

const Abas = createBottomTabNavigator<TabParams>();

export function TabRouter() {
  return (
    <Abas.Navigator
      initialRouteName="Home"
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Abas.Screen name="Home" component={Home} />
      <Abas.Screen name="Despensa" component={DespensaStack} />
      <Abas.Screen name="Lista" component={Lista} />
      <Abas.Screen name="Ajustes" component={Ajustes} />
    </Abas.Navigator>
  );
}
