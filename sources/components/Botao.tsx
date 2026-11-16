import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { fundoPressionado, opacidadePressionado } from '../utils/estiloPressionado';
import { bordas, cores, espacamentoLetras, espacos, fontes, raios, tamanhos, toque } from '../tema';

export type EstiloBotao = 'primario' | 'positivo' | 'contorno' | 'perigo';

type Props = {
  titulo: string;
  onPress: () => void;
  estilo?: EstiloBotao;
  icone?: ComponentProps<typeof Feather>['name'];
  desabilitado?: boolean;
  rotuloAcessibilidade?: string;
};

const VISUAL: Record<EstiloBotao, { fundo: string; texto: string; borda: string }> = {
  primario: { fundo: cores.destaque, texto: cores.sobreDestaque, borda: cores.destaque },
  positivo: { fundo: cores.positivo, texto: cores.sobreDestaque, borda: cores.positivo },
  contorno: { fundo: cores.fundo, texto: cores.destaque, borda: cores.destaque },
  perigo: { fundo: cores.fundo, texto: cores.perigo, borda: cores.perigo },
};

export function Botao({
  titulo,
  onPress,
  estilo = 'primario',
  icone,
  desabilitado = false,
  rotuloAcessibilidade,
}: Props) {
  const visual = VISUAL[estilo];
  const soIcone = titulo === '' && !!icone;

  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessibilidade ?? (titulo || undefined)}
      style={({ pressed }) => [
        styles.botao,
        soIcone && styles.soIcone,
        { backgroundColor: visual.fundo, borderColor: visual.borda },
        (estilo === 'primario' || estilo === 'positivo' ? opacidadePressionado : fundoPressionado)(pressed, desabilitado),
        desabilitado && styles.desabilitado,
      ]}
    >
      {icone && <Feather name={icone} size={18} color={visual.texto} />}
      {titulo !== '' && <Text style={[styles.titulo, { color: visual.texto }]}>{titulo}</Text>}
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
  soIcone: { paddingHorizontal: 0 },
  titulo: {
    fontFamily: fontes.medio,
    fontSize: tamanhos.legenda,
    letterSpacing: espacamentoLetras.largo,
    textTransform: 'uppercase',
  },
  desabilitado: { opacity: 0.4 },
});
