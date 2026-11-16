import { Pressable, StyleSheet, View } from 'react-native';
import { bordas, cores, raios } from '../tema';

type Props = {
  valor: boolean;
  onChange: (valor: boolean) => void;
  desabilitado?: boolean;
};

const LARGURA = 44;
const ALTURA = 24;
const MARCADOR = 16;
const MARGEM = 3;

export function Switch({ valor, onChange, desabilitado = false }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!valor)}
      disabled={desabilitado}
      accessibilityRole="switch"
      accessibilityState={{ checked: valor, disabled: desabilitado }}
      hitSlop={10}
      style={[
        styles.trilho,
        { backgroundColor: valor ? cores.positivo : cores.painel, borderColor: valor ? cores.positivo : cores.linha },
        desabilitado && styles.desabilitado,
      ]}
    >
      <View
        style={[
          styles.marcador,
          { backgroundColor: valor ? cores.sobreDestaque : cores.apagado },
          valor ? styles.ligado : styles.desligado,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  trilho: {
    width: LARGURA,
    height: ALTURA,
    borderWidth: bordas.largura,
    borderRadius: raios.nenhum,
    justifyContent: 'center',
  },
  marcador: {
    width: MARCADOR,
    height: MARCADOR,
    borderRadius: raios.nenhum,
  },
  ligado: { alignSelf: 'flex-end', marginRight: MARGEM },
  desligado: { alignSelf: 'flex-start', marginLeft: MARGEM },
  desabilitado: { opacity: 0.4 },
});
