import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { bordas, cores, espacamentoLetras, espacos, fontes, raios, tamanhos, toque } from '../tema';

export type EstiloBotao = 'primario' | 'positivo' | 'contorno' | 'perigo';

type Props = {
  titulo: string;
  onPress: () => void;
  estilo?: EstiloBotao;
  icone?: ComponentProps<typeof Feather>['name'];
  desabilitado?: boolean;
};

const VISUAL: Record<EstiloBotao, { fundo: string; texto: string; borda: string }> = {
  primario: { fundo: cores.destaque, texto: cores.sobreDestaque, borda: cores.destaque },
  positivo: { fundo: cores.positivo, texto: cores.sobreDestaque, borda: cores.positivo },
  contorno: { fundo: cores.fundo, texto: cores.destaque, borda: cores.destaque },
  perigo: { fundo: cores.fundo, texto: cores.perigo, borda: cores.perigo },
};

export function Botao({ titulo, onPress, estilo = 'primario', icone, desabilitado = false }: Props) {
  const visual = VISUAL[estilo];

  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.botao,
        { backgroundColor: visual.fundo, borderColor: visual.borda },
        pressed && styles.apertado,
        desabilitado && styles.desabilitado,
      ]}
    >
      {icone && <Feather name={icone} size={18} color={visual.texto} />}
      <Text style={[styles.titulo, { color: visual.texto }]}>{titulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    height: 52,
    minHeight: toque.minimo,
    paddingHorizontal: espacos.xl,
    borderWidth: bordas.largura,
    borderRadius: raios.nenhum,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacos.sm,
  },
  titulo: {
    fontFamily: fontes.medio,
    fontSize: tamanhos.legenda,
    letterSpacing: espacamentoLetras.largo,
    textTransform: 'uppercase',
  },
  apertado: { opacity: 0.8 },
  desabilitado: { opacity: 0.4 },
});
