import { StyleSheet, Text, View } from 'react-native';
import { useListaCompras } from '../contexts/ListaComprasContext';
import { cores, espacos, fontes, tamanhos } from '../tema';

export function Lista() {
  const { itens } = useListaCompras();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de compras</Text>
      <Text style={styles.texto}>{itens.length} itens</Text>
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
