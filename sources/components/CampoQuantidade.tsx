import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { bordas, cores, espacos, fontes, raios, tamanhos, toque } from '../tema';
import { fundoPressionado } from '../utils/estiloPressionado';

type Props = {
  valor: number;
  onChange: (valor: number) => void;
  minimo?: number;
};

export function CampoQuantidade({ valor, onChange, minimo = 1 }: Props) {
  const [texto, setTexto] = useState<string | null>(null);

  function mudar(novo: number) {
    setTexto(null);
    onChange(Math.max(minimo, novo));
  }

  function aoDigitar(entrada: string) {
    const digitos = entrada.replace(/\D/g, '');
    setTexto(digitos);
    if (digitos !== '') onChange(Math.max(minimo, parseInt(digitos, 10)));
  }

  return (
    <View style={styles.linha}>
      <Pressable
        onPress={() => mudar(valor - 1)}
        disabled={valor <= minimo}
        accessibilityRole="button"
        accessibilityLabel="Diminuir quantidade"
        style={({ pressed }) => [styles.botao, fundoPressionado(pressed, valor <= minimo), valor <= minimo && styles.desabilitado]}
      >
        <Text style={styles.simbolo}>−</Text>
      </Pressable>
      <TextInput
        value={texto ?? String(valor)}
        onChangeText={aoDigitar}
        onBlur={() => mudar(valor)}
        keyboardType="number-pad"
        selectTextOnFocus
        accessibilityLabel="Quantidade"
        style={styles.campo}
      />
      <Pressable
        onPress={() => mudar(valor + 1)}
        accessibilityRole="button"
        accessibilityLabel="Aumentar quantidade"
        style={({ pressed }) => [styles.botao, fundoPressionado(pressed)]}
      >
        <Text style={styles.simbolo}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacos.sm },
  botao: {
    width: toque.minimo,
    height: toque.minimo,
    backgroundColor: cores.painel,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    borderRadius: raios.nenhum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desabilitado: { opacity: 0.4 },
  simbolo: {
    fontFamily: fontes.medio,
    fontSize: tamanhos.titulo,
    color: cores.destaque,
  },
  campo: {
    minWidth: 64,
    height: toque.minimo,
    paddingHorizontal: espacos.md,
    textAlign: 'center',
    fontFamily: fontes.medio,
    fontSize: tamanhos.corpo,
    color: cores.destaque,
    backgroundColor: cores.fundo,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    borderRadius: raios.nenhum,
  },
});
