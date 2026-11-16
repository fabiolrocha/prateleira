import { useEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Botao } from '../components/Botao';
import { CampoQuantidade } from '../components/CampoQuantidade';
import { LinhaAjuste } from '../components/LinhaAjuste';
import { TagValidade } from '../components/TagValidade';
import type { SituacaoValidade } from '../components/TagValidade';
import { ThumbProduto } from '../components/ThumbProduto';
import { useAjustes } from '../contexts/AjustesContext';
import { useDespensa } from '../contexts/DespensaContext';
import { useListaCompras } from '../contexts/ListaComprasContext';
import { useToast } from '../contexts/ToastContext';
import type { StatusValidade } from '../models/Produto';
import type { DespensaStackParams } from '../routes/tipos';
import { bordas, cores, espacamentoLetras, espacos, fontes, raios, tamanhos, toque } from '../tema';
import { fundoPressionado } from '../utils/estiloPressionado';
import { formatarData } from '../utils/datas';

type Props = NativeStackScreenProps<DespensaStackParams, 'DetalheProduto'>;

const TAMANHO_THUMB = 96;

const SITUACAO: Record<StatusValidade, SituacaoValidade> = {
  'Em dia': 'ok',
  Atenção: 'atencao',
  Vencido: 'vencido',
};

function doisDigitos(numero: number): string {
  return String(numero).padStart(2, '0');
}

export function DetalheProduto({ navigation, route }: Props) {
  const { produtoId } = route.params;
  const insets = useSafeAreaInsets();
  const { buscarPorId, atualizar, consumir, descartar, carregando } = useDespensa();
  const { adicionarAutomatico } = useListaCompras();
  const { ajustes } = useAjustes();
  const { mostrar } = useToast();
  const produto = buscarPorId(produtoId);

  useEffect(() => {
    if (!carregando && !produto) navigation.goBack();
  }, [carregando, produto, navigation]);

  if (!produto) return <View style={styles.container} />;

  const horario = `${doisDigitos(ajustes.horaAviso)}:${doisDigitos(ajustes.minutoAviso)}`;

  async function aoConsumir() {
    if (!produto) return;
    const { nome, reposicao } = produto;
    await consumir(produtoId);
    mostrar(reposicao ? `${nome} consumido. Adicionado à lista de compras` : `${nome} consumido`, 'sucesso');
  }

  async function aoDescartar() {
    if (!produto) return;
    const { nome } = produto;
    await descartar(produtoId);
    mostrar(`${nome} descartado`, 'info');
  }

  async function aoPorNaLista() {
    if (!produto) return;
    await adicionarAutomatico(produto);
    mostrar(`${produto.nome} adicionado à lista de compras`, 'sucesso');
  }

  function confirmarDescarte() {
    Alert.alert('Joguei fora', `Remover ${produto?.nome} da despensa?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Joguei fora', style: 'destructive', onPress: aoDescartar },
    ]);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.conteudo, { paddingBottom: insets.bottom + espacos.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={({ pressed }) => [styles.voltar, fundoPressionado(pressed)]}
        >
          <Feather name="arrow-left" size={24} color={cores.destaque} />
        </Pressable>

        <View style={styles.cabecalho}>
          <ThumbProduto uri={produto.fotoUri} tamanho={TAMANHO_THUMB} />
          <View style={styles.identificacao}>
            {produto.nutriScore && (
              <View style={styles.nutri} accessibilityLabel={`Nutri-Score ${produto.nutriScore}`}>
                <Text style={styles.nutriTexto}>NUTRI-SCORE {produto.nutriScore}</Text>
              </View>
            )}
            <Text style={styles.nome}>{produto.nome}</Text>
            <Text style={styles.validade}>VAL {formatarData(produto.validade)}</Text>
            <TagValidade situacao={SITUACAO[produto.status]} texto={produto.descricao()} />
          </View>
        </View>

        <View style={styles.secao}>
          <Text style={styles.rotulo}>[ QUANTIDADE ]</Text>
          <CampoQuantidade
            valor={produto.quantidade}
            onChange={(quantidade) => atualizar(produtoId, { quantidade })}
          />
        </View>

        <View style={styles.secao}>
          <Text style={styles.rotulo}>[ AVISO ]</Text>
          <Text style={styles.texto}>
            Aviso: {produto.diasAviso} dias antes, às {horario}
          </Text>
          <LinhaAjuste
            texto="Repor na lista ao acabar"
            interruptor={{
              ligado: produto.reposicao,
              onChange: (reposicao) => atualizar(produtoId, { reposicao }),
            }}
            ultima
          />
        </View>

        <View style={styles.secao}>
          <Text style={styles.rotulo}>[ AÇÕES ]</Text>
          <Botao titulo="Consumi" estilo="positivo" icone="check" onPress={aoConsumir} />
          <Botao titulo="Joguei fora" estilo="perigo" icone="trash-2" onPress={confirmarDescarte} />
          <Botao
            titulo="Pôr na lista"
            estilo="contorno"
            icone="shopping-cart"
            onPress={aoPorNaLista}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    paddingHorizontal: espacos.xl,
    gap: espacos.xl,
  },
  voltar: {
    width: toque.minimo,
    height: toque.minimo,
    justifyContent: 'center',
  },
  cabecalho: {
    flexDirection: 'row',
    gap: espacos.lg,
    alignItems: 'flex-start',
  },
  identificacao: {
    flex: 1,
    gap: espacos.sm,
  },
  nutri: {
    alignSelf: 'flex-start',
    paddingHorizontal: espacos.sm,
    paddingVertical: espacos.xs,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    backgroundColor: cores.painel,
    borderRadius: raios.nenhum,
  },
  nutriTexto: {
    fontFamily: fontes.medio,
    fontSize: tamanhos.micro,
    letterSpacing: espacamentoLetras.largo,
    color: cores.destaque,
  },
  nome: {
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.titulo,
    color: cores.destaque,
  },
  validade: {
    fontFamily: fontes.medio,
    fontSize: tamanhos.corpo,
    color: cores.destaque,
  },
  secao: {
    gap: espacos.md,
  },
  rotulo: {
    fontFamily: fontes.medio,
    fontSize: tamanhos.legenda,
    letterSpacing: espacamentoLetras.largo,
    color: cores.rotulo,
  },
  texto: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.texto,
  },
});
