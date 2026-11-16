import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { Produto } from '../models/Produto';
import { deIso, diasEntre } from '../utils/datas';

export type ConfiguracaoAviso = {
  avisosAtivos: boolean;
  diasAviso: number;
  hora: number;
  minuto: number;
};

export type AgendadorAvisos = {
  agendarAviso: (produto: Produto) => Promise<string | undefined>;
  cancelarAviso: (notificacaoId?: string) => Promise<void>;
};

const CANAL_AVISOS = 'avisos-validade';
const SEGUNDOS_DATA_PASSADA = 10;
const SEGUNDOS_TESTE = 5;

export async function configurarNotificacoes(): Promise<void> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL_AVISOS, {
      name: 'Avisos de validade',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }
}

export async function pedirPermissao(): Promise<boolean> {
  const atual = await Notifications.getPermissionsAsync();
  if (atual.granted) return true;
  const resposta = await Notifications.requestPermissionsAsync();
  return resposta.granted;
}

function montarTitulo(nome: string, dias: number): string {
  if (dias <= 0) return `Seu ${nome} vence hoje`;
  if (dias === 1) return `Seu ${nome} vence amanhã`;
  return `Seu ${nome} vence em ${dias} dias`;
}

export async function agendarAviso(
  produto: Produto,
  configuracao: ConfiguracaoAviso,
): Promise<string | undefined> {
  if (!configuracao.avisosAtivos) return undefined;
  const agora = new Date();
  if (produto.diasParaVencimento(agora) < 0) return undefined;

  const dataAviso = deIso(produto.validade);
  dataAviso.setDate(dataAviso.getDate() - configuracao.diasAviso);
  dataAviso.setHours(configuracao.hora, configuracao.minuto, 0, 0);

  const passou = dataAviso.getTime() <= agora.getTime();
  const dataFinal = passou
    ? new Date(agora.getTime() + SEGUNDOS_DATA_PASSADA * 1000)
    : dataAviso;
  const diasRestantes = passou
    ? Math.max(diasEntre(agora, deIso(produto.validade)), 0)
    : configuracao.diasAviso;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: montarTitulo(produto.nome, diasRestantes),
      body: 'Confira a despensa e use antes que estrague.',
      data: { produtoId: produto.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dataFinal,
      channelId: CANAL_AVISOS,
    },
  });
}

export async function cancelarAviso(notificacaoId?: string): Promise<void> {
  if (!notificacaoId) return;
  await Notifications.cancelScheduledNotificationAsync(notificacaoId);
}

export async function cancelarTodos(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function reagendarTodos(
  produtos: Produto[],
  configuracao: ConfiguracaoAviso,
): Promise<Produto[]> {
  await cancelarTodos();
  for (const produto of produtos) {
    produto.notificacaoId = await agendarAviso(produto, configuracao);
  }
  return produtos;
}

export async function testarNotificacao(): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Teste de aviso',
      body: 'As notificações da Prateleira estão funcionando.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: SEGUNDOS_TESTE,
      channelId: CANAL_AVISOS,
    },
  });
}

export function criarAgendador(obterConfiguracao: () => ConfiguracaoAviso): AgendadorAvisos {
  return {
    agendarAviso: (produto) => agendarAviso(produto, obterConfiguracao()),
    cancelarAviso,
  };
}
