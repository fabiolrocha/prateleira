import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Botao } from '../components/Botao';
import type { RootStackParams } from '../routes/tipos';
import { cores, espacos, fontes, tamanhos } from '../tema';

type Props = NativeStackScreenProps<RootStackParams, 'ConfirmarProduto'>;

export function ConfirmarProduto({ navigation, route }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Confirmar produto</Text>
      <Text style={styles.texto}>{route.params.codigoBarras}</Text>
      <Botao titulo="Confirmar" estilo="positivo" onPress={() => navigation.popToTop()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    padding: espacos.xl,
    gap: espacos.lg,
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
