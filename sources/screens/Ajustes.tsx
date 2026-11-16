import { StyleSheet, Text, View } from 'react-native';
import { useAjustes } from '../contexts/AjustesContext';
import { cores, espacos, fontes, tamanhos } from '../tema';

export function Ajustes() {
  const { ajustes } = useAjustes();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Ajustes</Text>
      <Text style={styles.texto}>
        Avisos {ajustes.avisosAtivos ? 'ligados' : 'desligados'}, {ajustes.diasAvisoPadrao} dias
      </Text>
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
