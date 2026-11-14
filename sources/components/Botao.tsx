import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { cores, espacos, fontes, raios, tamanhos } from '../tema';

export type EstiloBotao = 'primario' | 'positivo' | 'contorno' | 'perigo';

type Props = {
  titulo: string;
  onPress: () => void;
  estilo?: EstiloBotao;
  icone?: ComponentProps<typeof Feather>['name'];
  desabilitado?: boolean;
};

const VISUAL: Record<EstiloBotao, { fundo: string; texto: string; borda?: string }> = {
  primario: { fundo: cores.texto, texto: cores.textoInverso },
  positivo: { fundo: cores.positivo, texto: cores.textoInverso },
  contorno: { fundo: cores.superficie, texto: cores.texto, borda: cores.borda },
  perigo: { fundo: cores.perigoClaro, texto: cores.perigo },
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
        { backgroundColor: visual.fundo },
        visual.borda && { borderWidth: 1.5, borderColor: visual.borda },
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
    paddingHorizontal: espacos.xl,
    borderRadius: raios.botao,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacos.sm,
  },
  titulo: {
    fontFamily: fontes.seminegrito,
    fontSize: tamanhos.medio,
  },
  apertado: { opacity: 0.8 },
  desabilitado: { opacity: 0.4 },
});
