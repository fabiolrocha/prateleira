import { StyleSheet, Text, View } from 'react-native';
import { cores, espacos, fontes, tamanhos } from '../tema';
import { Botao } from './Botao';

type Props = {
  frase: string;
  acao?: { titulo: string; onPress: () => void };
};

export function EstadoVazio({ frase, acao }: Props) {
  return (
    <View style={styles.vazio}>
      <Text style={styles.frase}>{frase}</Text>
      {acao && <Botao titulo={acao.titulo} onPress={acao.onPress} estilo="contorno" />}
    </View>
  );
}

const styles = StyleSheet.create({
  vazio: {
    alignItems: 'center',
    gap: espacos.lg,
    padding: espacos.xl,
  },
  frase: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.texto,
    textAlign: 'center',
  },
});
