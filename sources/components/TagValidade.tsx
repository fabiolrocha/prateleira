import { StyleSheet, Text, View } from 'react-native';
import { bordas, cores, espacamentoLetras, espacos, fontes, raios, tamanhos } from '../tema';

export type SituacaoValidade = 'ok' | 'atencao' | 'vencido';

type Props = {
  situacao: SituacaoValidade;
  texto: string;
};

const COR: Record<SituacaoValidade, string> = {
  ok: cores.positivo,
  atencao: cores.atencao,
  vencido: cores.perigo,
};

export function TagValidade({ situacao, texto }: Props) {
  const cor = COR[situacao];

  return (
    <View style={[styles.tag, { borderColor: cor }]}>
      <Text style={[styles.texto, { color: cor }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: espacos.sm,
    paddingVertical: espacos.xs,
    borderWidth: bordas.largura,
    borderRadius: raios.nenhum,
  },
  texto: {
    fontFamily: fontes.medio,
    fontSize: tamanhos.micro,
    letterSpacing: espacamentoLetras.largo,
    textTransform: 'uppercase',
  },
});
