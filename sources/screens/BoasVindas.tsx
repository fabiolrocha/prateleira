import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { useUsuario } from '../contexts/UsuarioContext';
import type { RootStackParams } from '../routes/tipos';
import { pedirPermissao } from '../services/notificacoes';
import { cores, espacamentoLetras, espacos, fontes, tamanhos } from '../tema';

type Props = NativeStackScreenProps<RootStackParams, 'BoasVindas'>;

export function BoasVindas({ navigation }: Props) {
  const { definirNome } = useUsuario();
  const [nome, setNome] = useState('');
  const [enviando, setEnviando] = useState(false);
  const nomeValido = nome.trim().length > 0;

  async function comecar() {
    if (!nomeValido || enviando) return;
    setEnviando(true);
    try {
      await definirNome(nome);
      await pedirPermissao();
    } finally {
      setEnviando(false);
    }
    navigation.replace('Tour');
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.apresentacao}>
        <Text style={styles.rotulo}>[ PRATELEIRA ]</Text>
        <Text style={styles.titulo}>Boas-vindas</Text>
        <Text style={styles.texto}>
          Acompanhe a validade dos produtos da sua despensa e receba um aviso antes que estraguem.
        </Text>
      </View>
      <View style={styles.formulario}>
        <Text style={styles.rotulo}>[ COMO QUER SER CHAMADO? ]</Text>
        <Campo
          value={nome}
          onChangeText={setNome}
          placeholder="Como quer ser chamado?"
          autoCapitalize="words"
          accessibilityLabel="Como quer ser chamado?"
        />
        <Botao titulo="Começar" onPress={comecar} desabilitado={!nomeValido || enviando} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    justifyContent: 'center',
    padding: espacos.xl,
    gap: espacos.xxl,
  },
  apresentacao: {
    gap: espacos.md,
  },
  formulario: {
    gap: espacos.md,
  },
  rotulo: {
    color: cores.rotulo,
    fontFamily: fontes.medio,
    fontSize: tamanhos.legenda,
    letterSpacing: espacamentoLetras.largo,
  },
  titulo: {
    color: cores.destaque,
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.display,
  },
  texto: {
    color: cores.texto,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    lineHeight: tamanhos.corpo * 1.4,
  },
});