import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { CampoQuantidade } from '../components/CampoQuantidade';
import { LinhaAjuste } from '../components/LinhaAjuste';
import { ThumbProduto } from '../components/ThumbProduto';
import { useAjustes } from '../contexts/AjustesContext';
import { useDespensa } from '../contexts/DespensaContext';
import type { RootStackParams } from '../routes/tipos';
import { buscarProdutoPorCodigo } from '../services/openFoodFacts';
import { bordas, cores, espacamentoLetras, espacos, fontes, raios, tamanhos, toque } from '../tema';
import { fundoPressionado } from '../utils/estiloPressionado';
import type { ProdutoApi } from '../tipos';
import { inicioDoDia } from '../utils/datas';

type Props = NativeStackScreenProps<RootStackParams, 'ConfirmarProduto'>;

const DIAS_AVISO_MINIMO = 1;
const DIAS_AVISO_MAXIMO = 7;
const TAMANHO_THUMB = 72;

function paraIso(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${dia}`;
}

function formatarDataCompleta(data: Date): string {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${data.getFullYear()}`;
}

export function ConfirmarProduto({ navigation, route }: Props) {
  const { codigoBarras } = route.params;
  const { adicionar } = useDespensa();
  const { ajustes } = useAjustes();

  const semCodigo = !codigoBarras;
  const [carregando, setCarregando] = useState(!semCodigo);
  const [erro, setErro] = useState<string | null>(null);
  const [produtoApi, setProdutoApi] = useState<ProdutoApi | null>(null);
  const [nome, setNome] = useState('');
  const [fotoUri, setFotoUri] = useState<string | undefined>(undefined);
  const [validade, setValidade] = useState<Date>(() => inicioDoDia(new Date()));
  const [quantidade, setQuantidade] = useState(1);
  const [diasAviso, setDiasAviso] = useState(() =>
    Math.min(DIAS_AVISO_MAXIMO, Math.max(DIAS_AVISO_MINIMO, ajustes.diasAvisoPadrao)),
  );
  const [reposicao, setReposicao] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const buscar = useCallback(async () => {
    if (!codigoBarras) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const resultado = await buscarProdutoPorCodigo(codigoBarras);
      setProdutoApi(resultado);
      setNome(resultado?.nome ?? '');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível consultar o produto.');
    } finally {
      setCarregando(false);
    }
  }, [codigoBarras]);

  useEffect(() => {
    buscar();
  }, [buscar]);

  async function adicionarFoto() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      Alert.alert('Permissão negada', 'Libere o acesso às fotos nos ajustes do aparelho para anexar uma imagem.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (resultado.canceled) return;
    setFotoUri(resultado.assets[0].uri);
  }

  function abrirSeletorAndroid() {
    DateTimePickerAndroid.open({
      value: validade,
      mode: 'date',
      minimumDate: inicioDoDia(new Date()),
      onValueChange: (_evento, data) => setValidade(inicioDoDia(data)),
    });
  }

  async function salvar() {
    const nomeFinal = nome.trim();
    if (!nomeFinal) {
      Alert.alert('Nome obrigatório', 'Informe o nome do produto.');
      return;
    }
    setSalvando(true);
    try {
      await adicionar({
        nome: nomeFinal,
        codigoBarras: codigoBarras ?? '',
        marca: produtoApi?.marca,
        fotoUrl: produtoApi?.fotoUrl,
        fotoUri,
        nutriScore: produtoApi?.nutriScore,
        validade: paraIso(validade),
        quantidade,
        diasAviso,
        reposicao,
      });
      navigation.popToTop();
    } catch {
      setSalvando(false);
      Alert.alert('Erro ao salvar', 'Não foi possível salvar o produto. Tente novamente.');
    }
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.destaque} />
        <Text style={styles.texto}>Consultando o Open Food Facts...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.texto}>{erro}</Text>
        <Botao titulo="Tentar novamente" onPress={buscar} estilo="contorno" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.tela} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Confirmar produto</Text>

      {!semCodigo && (
        <View style={styles.faixa}>
          <ThumbProduto uri={fotoUri ?? produtoApi?.fotoUrl} tamanho={TAMANHO_THUMB} />
          <View style={styles.faixaTexto}>
            <Text style={styles.rotulo}>
              {produtoApi ? '[ ENCONTRADO NO OPEN FOOD FACTS ]' : '[ PRODUTO NÃO ENCONTRADO ]'}
            </Text>
            {produtoApi && <Text style={styles.nome}>{produtoApi.nome}</Text>}
            {produtoApi?.marca && <Text style={styles.texto}>{produtoApi.marca}</Text>}
            <Text style={styles.codigo}>{codigoBarras}</Text>
          </View>
        </View>
      )}

      {!produtoApi && (
        <View style={styles.secao}>
          <Text style={styles.rotulo}>[ NOME DO PRODUTO ]</Text>
          <Campo value={nome} onChangeText={setNome} placeholder="Ex.: Arroz integral" autoCapitalize="sentences" />
        </View>
      )}

      <View style={styles.secao}>
        <Text style={styles.rotulo}>[ FOTO ]</Text>
        <Botao
          titulo={fotoUri ? 'Trocar foto' : 'Adicionar foto'}
          onPress={adicionarFoto}
          estilo="contorno"
          icone="image"
        />
      </View>

      <View style={styles.secao}>
        <Text style={styles.rotulo}>[ VALIDADE ]</Text>
        {Platform.OS === 'android' ? (
          <Pressable
            onPress={abrirSeletorAndroid}
            accessibilityRole="button"
            accessibilityLabel="Escolher data de validade"
            style={({ pressed }) => [styles.dataBotao, fundoPressionado(pressed)]}
          >
            <Text style={styles.dataTexto}>{formatarDataCompleta(validade)}</Text>
          </Pressable>
        ) : (
          <View style={styles.dataLinha}>
            <DateTimePicker
              value={validade}
              mode="date"
              display="compact"
              minimumDate={inicioDoDia(new Date())}
              onValueChange={(_evento, data) => setValidade(inicioDoDia(data))}
            />
          </View>
        )}
      </View>

      <View style={styles.secao}>
        <Text style={styles.rotulo}>[ QUANTIDADE ]</Text>
        <CampoQuantidade valor={quantidade} onChange={setQuantidade} />
      </View>

      <View style={styles.secao}>
        <Text style={styles.rotulo}>[ AVISO ]</Text>
        <LinhaAjuste
          texto="Avisar antes de vencer"
          valor={`${diasAviso} ${diasAviso === 1 ? 'dia' : 'dias'}`}
          slider={{
            valor: diasAviso,
            minimo: DIAS_AVISO_MINIMO,
            maximo: DIAS_AVISO_MAXIMO,
            passo: 1,
            onChange: setDiasAviso,
          }}
        />
        <LinhaAjuste
          texto="Repor na lista quando acabar"
          interruptor={{ ligado: reposicao, onChange: setReposicao }}
          ultima
        />
      </View>

      <Botao titulo="Salvar na despensa" estilo="positivo" onPress={salvar} desabilitado={salvando || !nome.trim()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espacos.xl, gap: espacos.xl },
  centro: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espacos.xl,
    gap: espacos.lg,
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
    textAlign: 'center',
  },
  faixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.md,
    padding: espacos.md,
    backgroundColor: cores.painel,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    borderRadius: raios.nenhum,
  },
  faixaTexto: { flex: 1, gap: espacos.xs },
  nome: {
    color: cores.destaque,
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.corpo,
  },
  codigo: {
    color: cores.apagado,
    fontFamily: fontes.regular,
    fontSize: tamanhos.legenda,
  },
  secao: { gap: espacos.sm },
  rotulo: {
    color: cores.rotulo,
    fontFamily: fontes.medio,
    fontSize: tamanhos.legenda,
    letterSpacing: espacamentoLetras.largo,
    textTransform: 'uppercase',
  },
  dataLinha: { alignItems: 'flex-start', minHeight: toque.minimo, justifyContent: 'center' },
  dataBotao: {
    minHeight: toque.minimo,
    paddingHorizontal: espacos.md,
    justifyContent: 'center',
    backgroundColor: cores.painel,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    borderRadius: raios.nenhum,
  },
  dataTexto: {
    color: cores.destaque,
    fontFamily: fontes.medio,
    fontSize: tamanhos.corpo,
  },
});
