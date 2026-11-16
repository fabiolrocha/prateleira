import { StyleSheet, Text, View } from 'react-native';
import { bordas, cores, espacos, fontes, tamanhos, toque } from '../tema';
import { Slider } from './Slider';
import { Switch } from './Switch';

type Props = {
  texto: string;
  valor?: string;
  interruptor?: { ligado: boolean; onChange: (ligado: boolean) => void };
  slider?: { valor: number; minimo: number; maximo: number; passo?: number; onChange: (valor: number) => void; aoSoltar?: (valor: number) => void };
  ultima?: boolean;
};

export function LinhaAjuste({ texto, valor, interruptor, slider, ultima = false }: Props) {
  return (
    <View style={[styles.linha, !ultima && styles.divisoria]}>
      <View style={styles.topo}>
        <Text style={styles.texto}>{texto}</Text>
        {valor !== undefined && <Text style={styles.valor}>{valor}</Text>}
        {interruptor && <Switch valor={interruptor.ligado} onChange={interruptor.onChange} />}
      </View>
      {slider && (
        <Slider
          valor={slider.valor}
          minimo={slider.minimo}
          maximo={slider.maximo}
          passo={slider.passo}
          onChange={slider.onChange}
          aoSoltar={slider.aoSoltar}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { paddingVertical: espacos.sm, minHeight: toque.minimo, justifyContent: 'center' },
  divisoria: { borderBottomWidth: bordas.largura, borderBottomColor: cores.linha },
  topo: {
    minHeight: toque.minimo,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacos.md,
  },
  texto: {
    flex: 1,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.destaque,
  },
  valor: {
    fontFamily: fontes.medio,
    fontSize: tamanhos.corpo,
    color: cores.destaque,
  },
});
