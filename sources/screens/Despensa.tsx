import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppState, FlatList, StyleSheet, Text, View } from 'react-native';
import type { CompositeScreenProps } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alerta } from '../components/Alerta';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { CardProduto } from '../components/CardProduto';
import { EstadoVazio } from '../components/EstadoVazio';
import { Filtro } from '../components/Filtro';
import { useDespensa } from '../contexts/DespensaContext';
import { useUsuario } from '../contexts/UsuarioContext';
import type { DespensaStackParams, RootStackParams } from '../routes/tipos';
import { cores, espacos, fontes, tamanhos } from '../tema';

type Props = CompositeScreenProps<
  NativeStackScreenProps<DespensaStackParams, 'Despensa'>,
  NativeStackScreenProps<RootStackParams>
>;

type FiltroValidade = 'todos' | 'vencendo' | 'vencidos';

const FILTROS: { chave: FiltroValidade; titulo: string }[] = [
  { chave: 'todos', titulo: 'Todos' },
  { chave: 'vencendo', titulo: 'Vencendo' },
  { chave: 'vencidos', titulo: 'Vencidos' },
];

const DIAS_DA_SEMANA = 7;

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function Despensa({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { produtos } = useDespensa();
  const { usuario } = useUsuario();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<FiltroValidade>('todos');
  const [referencia, setReferencia] = useState(() => Date.now());

  const recalcular = useCallback(() => setReferencia(Date.now()), []);

  useFocusEffect(recalcular);

  useEffect(() => {
    const assinatura = AppState.addEventListener('change', (estado) => {
      if (estado === 'active') recalcular();
    });
    return () => assinatura.remove();
  }, [recalcular]);

  const vencemNaSemana = useMemo(
    () =>
      produtos.filter((produto) => {
        const dias = produto.diasParaVencimento();
        return dias >= 0 && dias <= DIAS_DA_SEMANA;
      }).length,
    [produtos, referencia],
  );

  const visiveis = useMemo(() => {
    const termo = normalizar(busca);
    return produtos
      .filter((produto) => {
        if (filtro === 'vencendo') return produto.status === 'Atenção';
        if (filtro === 'vencidos') return produto.status === 'Vencido';
        return true;
      })
      .filter((produto) => !termo || normalizar(produto.nome).includes(termo));
  }, [produtos, busca, filtro, referencia]);

  const frasePadrao =
    produtos.length === 0 ? 'Sua despensa está vazia.' : 'Nenhum produto encontrado.';

  const cabecalho = (
    <View style={styles.cabecalho}>
      <View style={styles.titulos}>
        <Text style={styles.rotulo}>{`Oi, ${usuario?.nome ?? ''}`}</Text>
        <Text style={styles.titulo}>Sua despensa</Text>
      </View>
      {vencemNaSemana > 0 && (
        <Alerta
          titulo={`${vencemNaSemana} ${vencemNaSemana === 1 ? 'item vence' : 'itens vencem'} esta semana`}
        />
      )}
      <Campo
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar produto"
        accessibilityLabel="Buscar produto"
        autoCapitalize="none"
      />
      <View style={styles.filtros}>
        {FILTROS.map((item) => (
          <Filtro
            key={item.chave}
            titulo={item.titulo}
            ativo={filtro === item.chave}
            onPress={() => setFiltro(item.chave)}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={visiveis}
        keyExtractor={(produto) => produto.id}
        extraData={referencia}
        ListHeaderComponent={cabecalho}
        ListEmptyComponent={
          <EstadoVazio
            frase={frasePadrao}
            acao={
              produtos.length === 0
                ? { titulo: 'Adicionar produto', onPress: () => navigation.navigate('Escanear') }
                : undefined
            }
          />
        }
        renderItem={({ item }) => (
          <CardProduto
            produto={item}
            onPress={() => navigation.navigate('DetalheProduto', { produtoId: item.id })}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        contentContainerStyle={[styles.lista, { paddingTop: insets.top + espacos.xl }]}
        keyboardShouldPersistTaps="handled"
      />
      <View style={styles.flutuante}>
        <Botao titulo="Adicionar" icone="plus" onPress={() => navigation.navigate('Escanear')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  lista: {
    padding: espacos.xl,
    paddingBottom: espacos.xxl * 3,
  },
  cabecalho: {
    gap: espacos.lg,
    marginBottom: espacos.lg,
  },
  titulos: { gap: espacos.xs },
  rotulo: {
    color: cores.texto,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
  },
  titulo: {
    color: cores.destaque,
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.display,
  },
  filtros: {
    flexDirection: 'row',
    gap: espacos.sm,
  },
  separador: { height: espacos.sm },
  flutuante: {
    position: 'absolute',
    right: espacos.xl,
    bottom: espacos.xl,
  },
});
