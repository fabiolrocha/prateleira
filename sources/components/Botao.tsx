// Botão do Figma (seção "Componentes"), usado em todas as telas.
// Quatro estilos: primario (escuro, padrão), positivo (verde, "Consumi"),
// contorno (branco com borda, ações secundárias) e perigo ("Joguei fora").
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { cores, espacos, fontes, raios, tamanhos } from '../tema';

// União de textos: o TypeScript só aceita um destes quatro valores.
export type EstiloBotao = 'primario' | 'positivo' | 'contorno' | 'perigo';

// Props = o que a tela passa para o componente.
// O "?" deixa a prop opcional.
type Props = {
  titulo: string;
  onPress: () => void;          // função chamada no toque
  estilo?: EstiloBotao;         // sem ele, vale 'primario'
  // Nome de um ícone Feather (ex.: 'check', 'trash-2').
  // ComponentProps pega o tipo da prop "name" do próprio Feather,
  // então o editor sugere os nomes e recusa nome errado.
  icone?: ComponentProps<typeof Feather>['name'];
  desabilitado?: boolean;
};

// Cores de cada estilo num objeto só (valores do Figma, via tema).
// Record<EstiloBotao, ...> obriga a ter as quatro chaves:
// se faltar uma, o TypeScript acusa erro.
const VISUAL: Record<EstiloBotao, { fundo: string; texto: string; borda?: string }> = {
  primario: { fundo: cores.texto, texto: cores.textoInverso },
  positivo: { fundo: cores.positivo, texto: cores.textoInverso },
  contorno: { fundo: cores.superficie, texto: cores.texto, borda: cores.borda },
  perigo: { fundo: cores.perigoClaro, texto: cores.perigo },
};

// Desestruturação com valor padrão: estilo = 'primario' se a tela não mandar.
export function Botao({ titulo, onPress, estilo = 'primario', icone, desabilitado = false }: Props) {
  const visual = VISUAL[estilo];

  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button" // leitor de tela anuncia "botão"
      // style pode ser uma função: o Pressable informa se está sendo apertado (pressed).
      // O array junta estilos; valores false/undefined são ignorados.
      style={({ pressed }) => [
        styles.botao,
        { backgroundColor: visual.fundo },
        visual.borda && { borderWidth: 1.5, borderColor: visual.borda }, // só o contorno tem borda
        pressed && styles.apertado,
        desabilitado && styles.desabilitado,
      ]}
    >
      {/* Renderização condicional: o ícone só aparece se a prop veio. */}
      {icone && <Feather name={icone} size={18} color={visual.texto} />}
      <Text style={[styles.titulo, { color: visual.texto }]}>{titulo}</Text>
    </Pressable>
  );
}

// StyleSheet.create valida os estilos e deixa tudo num lugar só.
const styles = StyleSheet.create({
  botao: {
    height: 52,                       // altura do Figma
    paddingHorizontal: espacos.xl,    // 20
    borderRadius: raios.botao,        // 14
    flexDirection: 'row',             // ícone e texto lado a lado
    alignItems: 'center',             // centro na vertical
    justifyContent: 'center',         // centro na horizontal
    gap: espacos.sm,                  // 8 entre ícone e texto
  },
  titulo: {
    fontFamily: fontes.seminegrito,   // Schibsted Grotesk SemiBold
    fontSize: tamanhos.medio,         // 16
  },
  apertado: { opacity: 0.8 },         // resposta visual ao toque
  desabilitado: { opacity: 0.4 },
});
