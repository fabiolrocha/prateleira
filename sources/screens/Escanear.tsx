import { useCallback, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { BarcodeScanningResult } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import type { RootStackParams } from '../routes/tipos';
import { bordas, cores, espacamentoLetras, espacos, fontes, raios, tamanhos, toque } from '../tema';
import { fundoPressionado, opacidadePressionado } from '../utils/estiloPressionado';

type Props = NativeStackScreenProps<RootStackParams, 'Escanear'>;

const TAMANHO_CANTO = 28;
const TAMANHO_MAXIMO_CODIGO = 14;
const TAMANHO_MINIMO_CODIGO = 8;

export function Escanear({ navigation }: Props) {
  const [permissao, pedirPermissao] = useCameraPermissions();
  const [lanterna, setLanterna] = useState(false);
  const [digitando, setDigitando] = useState(false);
  const [codigoDigitado, setCodigoDigitado] = useState('');
  const jaLeu = useRef(false);

  useFocusEffect(
    useCallback(() => {
      jaLeu.current = false;
    }, []),
  );

  function abrirConfirmacao(codigoBarras: string) {
    if (jaLeu.current) return;
    jaLeu.current = true;
    navigation.navigate('ConfirmarProduto', { codigoBarras });
  }

  function abrirSemCodigo() {
    if (jaLeu.current) return;
    jaLeu.current = true;
    navigation.navigate('ConfirmarProduto', {});
  }

  function aoLerCodigo(resultado: BarcodeScanningResult) {
    abrirConfirmacao(resultado.data);
  }

  function confirmarDigitado() {
    abrirConfirmacao(codigoDigitado);
  }

  const codigoValido = codigoDigitado.length >= TAMANHO_MINIMO_CODIGO;

  const botaoFechar = (
    <Pressable
      onPress={() => navigation.goBack()}
      accessibilityRole="button"
      accessibilityLabel="Fechar"
      style={({ pressed }) => [styles.botaoIcone, fundoPressionado(pressed)]}
    >
      <Feather name="x" size={20} color={cores.destaque} />
    </Pressable>
  );

  if (!permissao) {
    return <View style={styles.container} />;
  }

  if (!permissao.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.cabecalho}>
          <Text style={styles.rotulo}>[ ESCANEAR ]</Text>
          {botaoFechar}
        </View>
        <View style={styles.permissao}>
          <View style={styles.iconeCamera}>
            <Feather name="camera-off" size={28} color={cores.destaque} />
          </View>
          <Text style={styles.titulo}>Câmera desativada</Text>
          <Text style={styles.subtexto}>
            Precisamos da câmera para ler o código de barras dos produtos. Você também pode digitar o código.
          </Text>
        </View>
        <View style={styles.rodape}>
          <Botao titulo="Permitir câmera" icone="camera" onPress={pedirPermissao} />
          <Botao
            titulo="Digitar código"
            estilo="contorno"
            icone="edit-3"
            onPress={() => setDigitando(true)}
          />
          <Botao titulo="Adicionar sem código" estilo="contorno" icone="plus" onPress={abrirSemCodigo} />
          {digitando && (
            <View style={styles.digitar}>
              <Campo
                value={codigoDigitado}
                onChangeText={(texto) => setCodigoDigitado(texto.replace(/\D/g, ''))}
                placeholder="Código de barras"
                keyboardType="number-pad"
                maxLength={TAMANHO_MAXIMO_CODIGO}
                accessibilityLabel="Código de barras"
              />
              <Botao titulo="Confirmar" desabilitado={!codigoValido} onPress={confirmarDigitado} />
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.cabecalho}>
        <Text style={styles.rotulo}>[ ESCANEAR ]</Text>
        {botaoFechar}
      </View>

      <View style={styles.visorArea}>
        <View style={styles.visor}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            enableTorch={lanterna}
            barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'] }}
            onBarcodeScanned={aoLerCodigo}
          />
          <View style={[styles.canto, styles.cantoSuperiorEsquerdo]} />
          <View style={[styles.canto, styles.cantoSuperiorDireito]} />
          <View style={[styles.canto, styles.cantoInferiorEsquerdo]} />
          <View style={[styles.canto, styles.cantoInferiorDireito]} />
          <View style={styles.linhaLeitura} />
        </View>
        <Pressable
          onPress={() => setLanterna((atual) => !atual)}
          accessibilityRole="button"
          accessibilityLabel={lanterna ? 'Desligar lanterna' : 'Ligar lanterna'}
          style={({ pressed }) => [
            styles.botaoIcone,
            styles.botaoLanterna,
            lanterna ? styles.lanternaLigada : null,
            lanterna ? opacidadePressionado(pressed) : fundoPressionado(pressed),
          ]}
        >
          <Feather name="zap" size={20} color={lanterna ? cores.sobreDestaque : cores.destaque} />
        </Pressable>
      </View>

      <View style={styles.rodape}>
        <Text style={styles.titulo}>Aponte para o código de barras</Text>
        <Text style={styles.subtexto}>A leitura é automática. Mantenha o código dentro do quadro.</Text>
        {digitando ? (
          <View style={styles.digitar}>
            <Campo
              value={codigoDigitado}
              onChangeText={(texto) => setCodigoDigitado(texto.replace(/\D/g, ''))}
              placeholder="Código de barras"
              keyboardType="number-pad"
              maxLength={TAMANHO_MAXIMO_CODIGO}
              accessibilityLabel="Código de barras"
            />
            <Botao titulo="Confirmar" desabilitado={!codigoValido} onPress={confirmarDigitado} />
            <Botao titulo="Voltar à câmera" estilo="contorno" onPress={() => setDigitando(false)} />
          </View>
        ) : (
          <>
            <Botao
              titulo="Digitar código"
              estilo="contorno"
              icone="edit-3"
              onPress={() => setDigitando(true)}
            />
            <Botao titulo="Adicionar sem código" estilo="contorno" icone="plus" onPress={abrirSemCodigo} />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    padding: espacos.lg,
    gap: espacos.lg,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rotulo: {
    color: cores.rotulo,
    fontFamily: fontes.medio,
    fontSize: tamanhos.legenda,
    letterSpacing: espacamentoLetras.maisLargo,
  },
  botaoIcone: {
    width: toque.minimo,
    height: toque.minimo,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.fundo,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    borderRadius: raios.nenhum,
  },
  botaoLanterna: {
    position: 'absolute',
    right: espacos.md,
    bottom: espacos.md,
  },
  lanternaLigada: {
    backgroundColor: cores.destaque,
    borderColor: cores.destaque,
  },
  visorArea: {
    flex: 1,
  },
  visor: {
    flex: 1,
    backgroundColor: cores.fundo,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    borderRadius: raios.nenhum,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  canto: {
    position: 'absolute',
    width: TAMANHO_CANTO,
    height: TAMANHO_CANTO,
    borderColor: cores.destaque,
  },
  cantoSuperiorEsquerdo: {
    top: espacos.lg,
    left: espacos.lg,
    borderTopWidth: bordas.acento,
    borderLeftWidth: bordas.acento,
  },
  cantoSuperiorDireito: {
    top: espacos.lg,
    right: espacos.lg,
    borderTopWidth: bordas.acento,
    borderRightWidth: bordas.acento,
  },
  cantoInferiorEsquerdo: {
    bottom: espacos.lg,
    left: espacos.lg,
    borderBottomWidth: bordas.acento,
    borderLeftWidth: bordas.acento,
  },
  cantoInferiorDireito: {
    bottom: espacos.lg,
    right: espacos.lg,
    borderBottomWidth: bordas.acento,
    borderRightWidth: bordas.acento,
  },
  linhaLeitura: {
    marginHorizontal: espacos.xl,
    height: bordas.largura,
    backgroundColor: cores.perigo,
  },
  rodape: {
    gap: espacos.md,
  },
  titulo: {
    color: cores.destaque,
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.titulo,
  },
  subtexto: {
    color: cores.texto,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    lineHeight: tamanhos.corpo * 1.4,
  },
  digitar: {
    gap: espacos.md,
  },
  permissao: {
    flex: 1,
    justifyContent: 'center',
    gap: espacos.md,
  },
  iconeCamera: {
    width: espacos.xxl * 2,
    height: espacos.xxl * 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: cores.painel,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    borderRadius: raios.nenhum,
  },
});
