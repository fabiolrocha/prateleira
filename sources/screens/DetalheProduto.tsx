import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { DespensaStackParams } from '../routes/tipos';
import { cores, espacos, fontes, tamanhos } from '../tema';

type Props = NativeStackScreenProps<DespensaStackParams, 'DetalheProduto'>;

export function DetalheProduto({ route }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Detalhe do produto</Text>
      <Text style={styles.texto}>{route.params.produtoId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    padding: espacos.xl,
    gap: espacos.md,
  },
  titulo: {
    color: cores.destaque,
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.display,
  },
  texto: {
    color: cores.texto,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
  },
});
