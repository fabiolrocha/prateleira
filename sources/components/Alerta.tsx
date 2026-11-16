import { StyleSheet, Text, View } from 'react-native';
import { bordas, cores, espacos, fontes, raios, tamanhos } from '../tema';

type Props = {
  titulo: string;
  texto?: string;
};

export function Alerta({ titulo, texto }: Props) {
  return (
    <View style={styles.alerta} accessibilityRole="alert">
      <View style={styles.barra} />
      <View style={styles.conteudo}>
        <Text style={styles.titulo}>{titulo}</Text>
        {texto && <Text style={styles.texto}>{texto}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alerta: {
    flexDirection: 'row',
    backgroundColor: cores.painel,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    borderRadius: raios.nenhum,
  },
  barra: {
    width: bordas.acento,
    backgroundColor: cores.destaque,
  },
  conteudo: { flex: 1, padding: espacos.md, gap: espacos.xs },
  titulo: {
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.corpo,
    color: cores.destaque,
  },
  texto: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.texto,
  },
});
