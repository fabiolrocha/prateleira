import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';
import { bordas, cores, espacos, fontes, raios, tamanhos, toque } from '../tema';

type Props = Pick<
  TextInputProps,
  'value' | 'onChangeText' | 'placeholder' | 'keyboardType' | 'secureTextEntry' | 'autoCapitalize' | 'accessibilityLabel'
>;

export function Campo(props: Props) {
  const [focado, setFocado] = useState(false);

  return (
    <TextInput
      {...props}
      onFocus={() => setFocado(true)}
      onBlur={() => setFocado(false)}
      placeholderTextColor={cores.apagado}
      style={[styles.campo, focado && styles.focado]}
    />
  );
}

const styles = StyleSheet.create({
  campo: {
    minHeight: toque.minimo,
    paddingHorizontal: espacos.md,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.destaque,
    backgroundColor: cores.painel,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    borderRadius: raios.nenhum,
  },
  focado: { borderColor: cores.destaque },
});
