import RNSlider from '@react-native-community/slider';
import { StyleSheet } from 'react-native';
import { cores, toque } from '../tema';

type Props = {
  valor: number;
  onChange: (valor: number) => void;
  minimo: number;
  maximo: number;
  passo?: number;
  aoSoltar?: (valor: number) => void;
};

export function Slider({ valor, onChange, minimo, maximo, passo = 1, aoSoltar }: Props) {
  return (
    <RNSlider
      value={valor}
      onValueChange={onChange}
      onSlidingComplete={aoSoltar}
      minimumValue={minimo}
      maximumValue={maximo}
      step={passo}
      minimumTrackTintColor={cores.destaque}
      maximumTrackTintColor={cores.linha}
      thumbTintColor={cores.destaque}
      style={styles.slider}
    />
  );
}

const styles = StyleSheet.create({
  slider: { height: toque.minimo },
});
