import { Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { bordas, cores, raios } from '../tema';

type Props = {
  marcado: boolean;
  onChange: (marcado: boolean) => void;
  desabilitado?: boolean;
};

const TAMANHO = 24;

export function Checkbox({ marcado, onChange, desabilitado = false }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!marcado)}
      disabled={desabilitado}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: marcado, disabled: desabilitado }}
      hitSlop={10}
      style={[
        styles.caixa,
        { backgroundColor: marcado ? cores.positivo : cores.fundo, borderColor: marcado ? cores.positivo : cores.linha },
        desabilitado && styles.desabilitado,
      ]}
    >
      {marcado && <Feather name="check" size={16} color={cores.sobreDestaque} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  caixa: {
    width: TAMANHO,
    height: TAMANHO,
    borderWidth: bordas.largura,
    borderRadius: raios.nenhum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desabilitado: { opacity: 0.4 },
});
