import { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alerta } from '../components/Alerta';
import { Botao } from '../components/Botao';
import { EstadoVazio } from '../components/EstadoVazio';
import { useDespensa } from '../contexts/DespensaContext';
import { useUsuario } from '../contexts/UsuarioContext';
import type { RootStackParams, TabParams } from '../routes/tipos';
import { resumoDoMes, temHistorico } from '../services/historico';
import { bordas, cores, espacamentoLetras, espacos, fontes, raios, tamanhos } from '../tema';
import type { ResumoMes } from '../tipos';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParams, 'Home'>,
  NativeStackScreenProps<RootStackParams>
>;

const DIAS_DA_SEMANA = 7;
const LADO_LEGENDA = 10;
const ALTURA_BARRA = 16;

export function Home({ navigation }: Props) {
  const { usuario } = useUsuario();
  const { produtos } = useDespensa();
  const [resumo, setResumo] = useState<ResumoMes>({ usadosATempo: 0, jogadosFora: 0 });
  const [existeHistorico, setExisteHistorico] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      async function carregar(): Promise<void> {
        const [dadosResumo, possuiHistorico] = await Promise.all([resumoDoMes(), temHistorico()]);
        if (ativo) {
          setResumo(dadosResumo);
          setExisteHistorico(possuiHistorico);
        }
      }
      carregar().catch(() => undefined);
      return () => {
        ativo = false;
      };
    }, []),
  );

  const vencemNaSemana = useMemo<number>(
    () =>
      produtos.filter((produto) => {
        const dias = produto.diasParaVencimento();
        return dias >= 0 && dias <= DIAS_DA_SEMANA;
      }).length,
    [produtos],
  );

  const total = resumo.usadosATempo + resumo.jogadosFora;

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Oi, {usuario?.nome}</Text>

      <View style={styles.card}>
        <Text style={styles.rotulo}>[ SEU MÊS ]</Text>
        {existeHistorico ? (
          <>
            <View style={styles.numeros}>
              <View style={styles.numeroBloco}>
                <Text style={[styles.numero, { color: cores.positivo }]}>{resumo.usadosATempo}</Text>
                <Text style={styles.numeroLegenda}>usados a tempo</Text>
              </View>
              <View style={styles.numeroBloco}>
                <Text style={[styles.numero, { color: cores.perigo }]}>{resumo.jogadosFora}</Text>
                <Text style={styles.numeroLegenda}>jogados fora</Text>
              </View>
            </View>
            <View
              style={styles.barra}
              accessibilityLabel={`Aproveitamento: ${resumo.usadosATempo} usados a tempo e ${resumo.jogadosFora} jogados fora`}
            >
              {total > 0 && (
                <>
                  <View
                    style={{ flex: resumo.usadosATempo, backgroundColor: cores.positivo }}
                  />
                  <View style={{ flex: resumo.jogadosFora, backgroundColor: cores.perigo }} />
                </>
              )}
            </View>
            <View style={styles.legenda}>
              <View style={styles.itemLegenda}>
                <View style={[styles.quadrado, { backgroundColor: cores.positivo }]} />
                <Text style={styles.textoLegenda}>Usados a tempo</Text>
              </View>
              <View style={styles.itemLegenda}>
                <View style={[styles.quadrado, { backgroundColor: cores.perigo }]} />
                <Text style={styles.textoLegenda}>Jogados fora</Text>
              </View>
            </View>
          </>
        ) : (
          <EstadoVazio frase="Ainda não há histórico. Use ou descarte um produto para ver seu mês aqui." />
        )}
      </View>

      {vencemNaSemana > 0 && (
        <Alerta
          titulo={
            vencemNaSemana === 1
              ? '1 item vence esta semana'
              : `${vencemNaSemana} itens vencem esta semana`
          }
        />
      )}

      <View style={styles.atalhos}>
        <Botao titulo="Escanear produto" icone="camera" onPress={() => navigation.navigate('Escanear')} />
        <Botao
          titulo="Ver lista de compras"
          estilo="contorno"
          icone="list"
          onPress={() => navigation.navigate('Lista')}
        />
        <Botao
          titulo="Ir ao mercado"
          estilo="contorno"
          icone="shopping-cart"
          onPress={() => navigation.navigate('Lista')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espacos.xl, gap: espacos.lg },
  titulo: {
    color: cores.destaque,
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.display,
  },
  card: {
    backgroundColor: cores.painel,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    borderRadius: raios.nenhum,
    padding: espacos.lg,
    gap: espacos.lg,
  },
  rotulo: {
    color: cores.rotulo,
    fontFamily: fontes.medio,
    fontSize: tamanhos.legenda,
    letterSpacing: espacamentoLetras.largo,
    textTransform: 'uppercase',
  },
  numeros: { flexDirection: 'row', gap: espacos.xl },
  numeroBloco: { flex: 1, gap: espacos.xs },
  numero: {
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.display,
  },
  numeroLegenda: {
    color: cores.texto,
    fontFamily: fontes.regular,
    fontSize: tamanhos.legenda,
  },
  barra: {
    flexDirection: 'row',
    height: ALTURA_BARRA,
    backgroundColor: cores.linha,
    borderRadius: raios.nenhum,
    overflow: 'hidden',
  },
  legenda: { flexDirection: 'row', flexWrap: 'wrap', gap: espacos.lg },
  itemLegenda: { flexDirection: 'row', alignItems: 'center', gap: espacos.sm },
  quadrado: {
    width: LADO_LEGENDA,
    height: LADO_LEGENDA,
    borderRadius: raios.nenhum,
  },
  textoLegenda: {
    color: cores.texto,
    fontFamily: fontes.regular,
    fontSize: tamanhos.legenda,
  },
  atalhos: { gap: espacos.md },
});
