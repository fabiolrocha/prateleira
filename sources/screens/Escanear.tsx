import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Botao } from '../components/Botao';
import type { RootStackParams } from '../routes/tipos';
import { cores, espacos, fontes, tamanhos } from '../tema';

type Props = NativeStackScreenProps<RootStackParams, 'Escanear'>;

export function Escanear({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Escanear</Text>
      <Botao
        titulo="Código lido"
        onPress={() => navigation.navigate('ConfirmarProduto', { codigoBarras: '7891000100103' })}
      />
      <Botao titulo="Fechar" estilo="contorno" onPress={() => navigation.goBack()} />
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
});
