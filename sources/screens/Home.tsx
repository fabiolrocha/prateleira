import { StyleSheet, Text, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Botao } from '../components/Botao';
import { useUsuario } from '../contexts/UsuarioContext';
import type { RootStackParams, TabParams } from '../routes/tipos';
import { cores, espacos, fontes, tamanhos } from '../tema';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParams, 'Home'>,
  NativeStackScreenProps<RootStackParams>
>;

export function Home({ navigation }: Props) {
  const { usuario } = useUsuario();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Oi, {usuario?.nome}</Text>
      <Botao titulo="Escanear produto" icone="camera" onPress={() => navigation.navigate('Escanear')} />
      <Botao
        titulo="Ver lista de compras"
        estilo="contorno"
        onPress={() => navigation.navigate('Lista')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    padding: espacos.xl,
    gap: espacos.lg,
  },
  titulo: {
    color: cores.destaque,
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.display,
  },
});
