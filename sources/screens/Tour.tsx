import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Botao } from '../components/Botao';
import type { RootStackParams } from '../routes/tipos';
import { CHAVES, ler, salvar } from '../services/armazenamento';
import { bordas, cores, espacamentoLetras, espacos, fontes, raios, tamanhos, toque } from '../tema';
import { fundoPressionado } from '../utils/estiloPressionado';

type Props = NativeStackScreenProps<RootStackParams, 'Tour'>;

type Passo = {
  rotulo: string;
  titulo: string;
  frase: string;
};

const PASSOS: Passo[] = [
  {
    rotulo: '[ HOME ]',
    titulo: 'Veja o seu mês',
    frase: 'Acompanhe o que você consumiu e o que foi desperdiçado.',
  },
  {
    rotulo: '[ DESPENSA ]',
    titulo: 'Tudo em um lugar',
    frase: 'Cadastre seus produtos e veja a validade de cada um.',
  },
  {
    rotulo: '[ ESCANEAR ]',
    titulo: 'Cadastro rápido',
    frase: 'Leia o código de barras ou digite as informações.',
  },
  {
    rotulo: '[ LISTA E AJUSTES ]',
    titulo: 'Compras e avisos',
    frase: 'Veja o que acabou na lista de compras e escolha quando ser avisado.',
  },
];

export function Tour({ navigation }: Props) {
  const [carregando, setCarregando] = useState(true);
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    let ativo = true;
    ler<boolean>(CHAVES.tour).then((visto) => {
      if (!ativo) return;
      if (visto) {
        navigation.replace('Abas');
      } else {
        setCarregando(false);
      }
    });
    return () => {
      ativo = false;
    };
  }, [navigation]);

  async function concluir() {
    await salvar(CHAVES.tour, true);
    navigation.replace('Abas');
  }

  if (carregando) {
    return <View style={styles.container} />;
  }

  const passo = PASSOS[indice];
  const ultimo = indice === PASSOS.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topo}>
        <Pressable
          onPress={concluir}
          accessibilityRole="button"
          accessibilityLabel="Pular tour"
          style={({ pressed }) => [styles.pular, fundoPressionado(pressed)]}
        >
          <Text style={styles.textoPular}>Pular</Text>
        </Pressable>
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.rotulo}>{passo.rotulo}</Text>
        <Text style={styles.titulo}>{passo.titulo}</Text>
        <Text style={styles.frase}>{passo.frase}</Text>
      </View>

      <View style={styles.rodape}>
        <View
          style={styles.indicador}
          accessibilityLabel={`Passo ${indice + 1} de ${PASSOS.length}`}
        >
          {PASSOS.map((_, posicao) => (
            <View
              key={posicao}
              style={[styles.quadrado, posicao === indice && styles.quadradoAtivo]}
            />
          ))}
        </View>
        <Botao
          titulo={ultimo ? 'Começar' : 'Próximo'}
          onPress={ultimo ? concluir : () => setIndice(indice + 1)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: espacos.xl,
  },
  topo: {
    alignItems: 'flex-end',
    paddingTop: espacos.lg,
  },
  pular: {
    minHeight: toque.minimo,
    justifyContent: 'center',
    paddingHorizontal: espacos.sm,
  },
  textoPular: {
    color: cores.texto,
    fontFamily: fontes.medio,
    fontSize: tamanhos.legenda,
    letterSpacing: espacamentoLetras.largo,
    textTransform: 'uppercase',
  },
  conteudo: {
    flex: 1,
    justifyContent: 'center',
    gap: espacos.md,
  },
  rotulo: {
    color: cores.rotulo,
    fontFamily: fontes.medio,
    fontSize: tamanhos.legenda,
    letterSpacing: espacamentoLetras.maisLargo,
    textTransform: 'uppercase',
  },
  titulo: {
    color: cores.destaque,
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.display,
  },
  frase: {
    color: cores.texto,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    lineHeight: tamanhos.corpo * 1.4,
  },
  rodape: {
    gap: espacos.xl,
    paddingBottom: espacos.xl,
  },
  indicador: {
    flexDirection: 'row',
    gap: espacos.sm,
  },
  quadrado: {
    width: espacos.md,
    height: espacos.md,
    borderWidth: bordas.largura,
    borderColor: cores.destaque,
    borderRadius: raios.nenhum,
    backgroundColor: cores.fundo,
  },
  quadradoAtivo: {
    backgroundColor: cores.destaque,
  },
});
