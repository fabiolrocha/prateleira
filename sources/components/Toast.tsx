import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bordas, cores, espacos, fontes, raios, tamanhos } from '../tema';

export type TipoToast = 'sucesso' | 'info' | 'erro';

type Props = {
  mensagem: string;
  tipo: TipoToast;
  progresso: Animated.Value;
};

const COR_FAIXA: Record<TipoToast, string> = {
  sucesso: cores.positivo,
  info: cores.rotulo,
  erro: cores.perigo,
};

const DESLOCAMENTO = -espacos.md;

export function Toast({ mensagem, tipo, progresso }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="none"
      style={[styles.area, { top: insets.top + espacos.md }]}
    >
      <Animated.View
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        style={[
          styles.toast,
          {
            opacity: progresso,
            transform: [
              {
                translateY: progresso.interpolate({ inputRange: [0, 1], outputRange: [DESLOCAMENTO, 0] }),
              },
            ],
          },
        ]}
      >
        <View style={[styles.faixa, { backgroundColor: COR_FAIXA[tipo] }]} />
        <Text style={styles.texto}>{mensagem}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    position: 'absolute',
    left: espacos.lg,
    right: espacos.lg,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: cores.painel,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    borderRadius: raios.nenhum,
  },
  faixa: {
    width: bordas.acento,
  },
  texto: {
    flex: 1,
    paddingVertical: espacos.md,
    paddingHorizontal: espacos.lg,
    color: cores.texto,
    fontFamily: fontes.medio,
    fontSize: tamanhos.corpo,
  },
});
