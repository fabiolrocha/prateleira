import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Botao } from '../components/Botao';
import { LinhaAjuste } from '../components/LinhaAjuste';
import { useAjustes } from '../contexts/AjustesContext';
import { useDespensa } from '../contexts/DespensaContext';
import { useToast } from '../contexts/ToastContext';
import { useUsuario } from '../contexts/UsuarioContext';
import { cancelarTodos, pedirPermissao, testarNotificacao } from '../services/notificacoes';
import { bordas, cores, espacamentoLetras, espacos, fontes, raios, tamanhos, toque } from '../tema';
import { fundoPressionado } from '../utils/estiloPressionado';

const AVATAR = 56;

function doisDigitos(numero: number): string {
  return String(numero).padStart(2, '0');
}

function dataDoHorario(hora: number, minuto: number): Date {
  const data = new Date();
  data.setHours(hora, minuto, 0, 0);
  return data;
}

function nomeDoMes(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

export function Ajustes() {
  const insets = useSafeAreaInsets();
  const { usuario } = useUsuario();
  const { ajustes, atualizarAjustes } = useAjustes();
  const { reagendarTodos } = useDespensa();
  const { mostrar } = useToast();
  const [diasExibidos, setDiasExibidos] = useState<number>(ajustes.diasAvisoPadrao);
  const [reagendamentos, setReagendamentos] = useState<number>(0);
  const [seletorAberto, setSeletorAberto] = useState<boolean>(false);

  useEffect(() => {
    setDiasExibidos(ajustes.diasAvisoPadrao);
  }, [ajustes.diasAvisoPadrao]);

  useEffect(() => {
    if (reagendamentos === 0) return;
    reagendarTodos();
  }, [reagendamentos, reagendarTodos]);

  const inicial = (usuario?.nome ?? '?').trim().charAt(0).toUpperCase();
  const horario = `${doisDigitos(ajustes.horaAviso)}:${doisDigitos(ajustes.minutoAviso)}`;

  async function alternarAvisos(ligado: boolean): Promise<void> {
    await atualizarAjustes({ avisosAtivos: ligado });
    if (ligado) {
      setReagendamentos((anterior) => anterior + 1);
    } else {
      await cancelarTodos();
      setReagendamentos((anterior) => anterior + 1);
    }
    mostrar(ligado ? 'Avisos ativados' : 'Avisos desativados', 'info');
  }

  async function salvarDias(valor: number): Promise<void> {
    await atualizarAjustes({ diasAvisoPadrao: valor });
    setReagendamentos((anterior) => anterior + 1);
  }

  async function salvarHorario(data: Date): Promise<void> {
    await atualizarAjustes({ horaAviso: data.getHours(), minutoAviso: data.getMinutes() });
    setReagendamentos((anterior) => anterior + 1);
  }

  function aoEscolherHorario(evento: DateTimePickerEvent, data?: Date): void {
    if (Platform.OS !== 'ios') setSeletorAberto(false);
    if (evento.type === 'set' && data) salvarHorario(data);
  }

  function abrirSeletor(): void {
    const valor = dataDoHorario(ajustes.horaAviso, ajustes.minutoAviso);
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: valor,
        mode: 'time',
        is24Hour: true,
        onChange: aoEscolherHorario,
      });
      return;
    }
    setSeletorAberto((aberto) => !aberto);
  }

  async function testar(): Promise<void> {
    const permitido = await pedirPermissao();
    if (!permitido) {
      Alert.alert('Notificações bloqueadas', 'Libere as notificações da Prateleira nos ajustes do aparelho.');
      return;
    }
    await testarNotificacao();
    mostrar('Notificação de teste enviada', 'info');
  }

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={[
        styles.conteudo,
        { paddingTop: insets.top + espacos.xl, paddingBottom: espacos.xxl },
      ]}
    >
      <Text style={styles.titulo}>Ajustes</Text>

      <View style={styles.secao}>
        <Text style={styles.rotulo}>[ CONTA ]</Text>
        <View style={styles.conta}>
          <View style={styles.avatar}>
            <Text style={styles.inicial}>{inicial}</Text>
          </View>
          <View style={styles.dadosConta}>
            <Text style={styles.nome}>{usuario?.nome}</Text>
            {usuario && (
              <Text style={styles.desde}>Usa a Prateleira desde {nomeDoMes(usuario.desde)}</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.secao}>
        <Text style={styles.rotulo}>[ AVISOS ]</Text>
        <View>
          <LinhaAjuste
            texto="Avisos de validade"
            interruptor={{ ligado: ajustes.avisosAtivos, onChange: alternarAvisos }}
          />
          <LinhaAjuste
            texto="Antecedência padrão"
            valor={diasExibidos === 1 ? '1 dia' : `${diasExibidos} dias`}
            slider={{
              valor: diasExibidos,
              minimo: 1,
              maximo: 7,
              passo: 1,
              onChange: setDiasExibidos,
              aoSoltar: salvarDias,
            }}
          />
          <Pressable
            onPress={abrirSeletor}
            accessibilityRole="button"
            style={({ pressed }) => [styles.horario, fundoPressionado(pressed)]}
          >
            <Text style={styles.textoHorario}>Horário do aviso</Text>
            <Text style={styles.valorHorario}>{horario}</Text>
          </Pressable>
          {seletorAberto && Platform.OS === 'ios' && (
            <DateTimePicker
              value={dataDoHorario(ajustes.horaAviso, ajustes.minutoAviso)}
              mode="time"
              display="spinner"
              is24Hour
              onChange={aoEscolherHorario}
            />
          )}
        </View>
        <Botao titulo="Testar notificação" icone="bell" estilo="contorno" onPress={testar} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { paddingHorizontal: espacos.xl, gap: espacos.xl },
  titulo: {
    color: cores.destaque,
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.titulo,
  },
  secao: { gap: espacos.md },
  rotulo: {
    color: cores.rotulo,
    fontFamily: fontes.medio,
    fontSize: tamanhos.legenda,
    letterSpacing: espacamentoLetras.maisLargo,
    textTransform: 'uppercase',
  },
  conta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.lg,
    padding: espacos.lg,
    backgroundColor: cores.painel,
    borderWidth: bordas.largura,
    borderColor: cores.linha,
    borderRadius: raios.nenhum,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    backgroundColor: cores.destaque,
    borderRadius: raios.nenhum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inicial: {
    color: cores.sobreDestaque,
    fontFamily: fontes.extranegrito,
    fontSize: tamanhos.titulo,
  },
  dadosConta: { flex: 1, gap: espacos.xs },
  nome: {
    color: cores.destaque,
    fontFamily: fontes.medio,
    fontSize: tamanhos.corpo,
  },
  desde: {
    color: cores.apagado,
    fontFamily: fontes.regular,
    fontSize: tamanhos.legenda,
  },
  horario: {
    minHeight: toque.minimo,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacos.md,
    borderTopWidth: bordas.largura,
    borderTopColor: cores.linha,
  },
  textoHorario: {
    flex: 1,
    color: cores.destaque,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
  },
  valorHorario: {
    color: cores.destaque,
    fontFamily: fontes.medio,
    fontSize: tamanhos.corpo,
  },
});
