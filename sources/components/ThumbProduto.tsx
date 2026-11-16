import { Image, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { bordas, cores, raios } from '../tema';

export const ICONE_PLACEHOLDER = 'package';

type Props = {
  uri?: string;
  tamanho: number;
};

export function ThumbProduto({ uri, tamanho }: Props) {
  const dimensao = { width: tamanho, height: tamanho };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.imagem, dimensao]}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View style={[styles.placeholder, dimensao]}>
      <Feather name={ICONE_PLACEHOLDER} size={Math.round(tamanho * 0.45)} color={cores.apagado} />
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: cores.painel,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    borderRadius: raios.nenhum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagem: {
    backgroundColor: cores.painel,
    borderRadius: raios.nenhum,
  },
});
