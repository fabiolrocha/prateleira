import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Botao } from '../components/Botao';
import { useDespensa } from '../contexts/DespensaContext';
import type { DespensaStackParams } from '../routes/tipos';
import { cores, espacos, fontes, tamanhos } from '../tema';

type Props = NativeStackScreenProps<DespensaStackParams, 'Despensa'>;

export function Despensa({ navigation }: Props) {
  const { produtos } = useDespensa();
  const produtoId = produtos[0]?.id ?? 'exemplo';

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Despensa</Text>
      <Botao
        titulo="Detalhe do produto"
        estilo="contorno"
        onPress={() => navigation.navigate('DetalheProduto', { produtoId })}
      />
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
