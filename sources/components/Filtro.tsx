import { Pressable, StyleSheet, Text } from 'react-native';
import { bordas, cores, espacamentoLetras, espacos, fontes, raios, tamanhos, toque } from '../tema';
import { fundoPressionado, opacidadePressionado } from '../utils/estiloPressionado';

type Props = {
  titulo: string;
  ativo: boolean;
  onPress: () => void;
};

export function Filtro({ titulo, ativo, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: ativo }}
      style={({ pressed }) => [
        styles.filtro,
        ativo ? styles.ativo : styles.inativo,
        ativo ? opacidadePressionado(pressed) : fundoPressionado(pressed),
      ]}
    >
      <Text style={[styles.titulo, { color: ativo ? cores.sobreDestaque : cores.texto }]}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filtro: {
    minHeight: toque.minimo,
    paddingHorizontal: espacos.lg,
    borderWidth: bordas.largura,
    borderRadius: raios.nenhum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ativo: { backgroundColor: cores.destaque, borderColor: cores.destaque },
  inativo: { backgroundColor: cores.painel, borderColor: cores.linha },
  titulo: {
    fontFamily: fontes.medio,
    fontSize: tamanhos.legenda,
    letterSpacing: espacamentoLetras.largo,
    textTransform: 'uppercase',
  },
});
