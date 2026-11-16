import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Produto } from '../models/Produto';
import { bordas, cores, espacamentoLetras, espacos, fontes, raios, tamanhos, toque } from '../tema';
import { fundoPressionado } from '../utils/estiloPressionado';
import { ThumbProduto } from './ThumbProduto';
import { TagValidade } from './TagValidade';
import type { SituacaoValidade } from './TagValidade';

type Props = {
  produto: Produto;
  onPress: () => void;
};

const TAMANHO_THUMB = 52;

function situacaoDe(produto: Produto): SituacaoValidade {
  if (produto.status === 'Vencido') return 'vencido';
  if (produto.status === 'Atenção') return 'atencao';
  return 'ok';
}

function textoTag(dias: number): string {
  if (dias < -1) return `Venceu há ${-dias} dias`;
  if (dias === -1) return 'Venceu ontem';
  if (dias === 0) return 'Vence hoje';
  if (dias === 1) return 'Vence amanhã';
  if (dias <= 3) return `Vence em ${dias} dias`;
  return `Faltam ${dias} dias`;
}

function diaMes(iso: string): string {
  const [, mes, dia] = iso.slice(0, 10).split('-');
  return `${dia}/${mes}`;
}

export function CardProduto({ produto, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, fundoPressionado(pressed)]}
    >
      <ThumbProduto uri={produto.fotoUri ?? produto.fotoUrl} tamanho={TAMANHO_THUMB} />
      <View style={styles.dados}>
        <Text style={styles.nome} numberOfLines={2}>
          {produto.nome}
        </Text>
        <Text style={styles.quantidade}>{`${produto.quantidade} un`}</Text>
      </View>
      <View style={styles.validade}>
        <Text style={styles.data}>{`VAL ${diaMes(produto.validade)}`}</Text>
        <TagValidade situacao={situacaoDe(produto)} texto={textoTag(produto.diasParaVencimento())} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: toque.minimo,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.md,
    padding: espacos.md,
    backgroundColor: cores.painel,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    borderRadius: raios.nenhum,
  },
  dados: { flex: 1, gap: espacos.xs },
  nome: {
    fontFamily: fontes.medio,
    fontSize: tamanhos.corpo,
    color: cores.destaque,
  },
  quantidade: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.legenda,
    color: cores.texto,
  },
  validade: { alignItems: 'flex-end', gap: espacos.xs },
  data: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.micro,
    letterSpacing: espacamentoLetras.largo,
    color: cores.texto,
    textTransform: 'uppercase',
  },
});
