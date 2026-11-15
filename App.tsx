import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/jetbrains-mono';
import { cores, fontes, tamanhos } from './sources/tema';

export default function App() {
  const [fontesCarregadas] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_800ExtraBold,
  });

  if (!fontesCarregadas) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    color: cores.texto,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
  },
});
