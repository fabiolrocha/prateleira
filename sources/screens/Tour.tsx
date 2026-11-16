import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Botao } from '../components/Botao';
import type { RootStackParams } from '../routes/tipos';
import { cores, espacos, fontes, tamanhos } from '../tema';

type Props = NativeStackScreenProps<RootStackParams, 'Tour'>;

export function Tour({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tour</Text>
      <Botao titulo="Começar" onPress={() => navigation.replace('Abas')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    padding: espacos.xl,
    gap: espacos.xl,
  },
  titulo: {
    color: cores.destaque,
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.display,
  },
});
