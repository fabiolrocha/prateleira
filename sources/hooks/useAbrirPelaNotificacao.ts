import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { useDespensa } from '../contexts/DespensaContext';
import { navigationRef } from '../routes/navigationRef';

function extrairProdutoId(resposta: Notifications.NotificationResponse | null): string | undefined {
  if (!resposta) return undefined;
  if (resposta.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return undefined;
  const produtoId = resposta.notification.request.content.data?.produtoId;
  return typeof produtoId === 'string' && produtoId.length > 0 ? produtoId : undefined;
}

export function useAbrirPelaNotificacao(): void {
  const { buscarPorId, carregando } = useDespensa();
  const [pendente, setPendente] = useState<string | null>(null);
  const [navegacaoPronta, setNavegacaoPronta] = useState<boolean>(navigationRef.isReady());

  useEffect(() => {
    let ativo = true;

    Notifications.getLastNotificationResponseAsync().then((resposta) => {
      const produtoId = extrairProdutoId(resposta);
      if (ativo && produtoId) {
        setPendente(produtoId);
        Notifications.clearLastNotificationResponseAsync();
      }
    });

    const assinatura = Notifications.addNotificationResponseReceivedListener((resposta) => {
      const produtoId = extrairProdutoId(resposta);
      if (produtoId) setPendente(produtoId);
    });

    return () => {
      ativo = false;
      assinatura.remove();
    };
  }, []);

  useEffect(() => {
    if (navegacaoPronta) return undefined;
    const cancelar = navigationRef.addListener('state', () => {
      setNavegacaoPronta(navigationRef.isReady());
    });
    setNavegacaoPronta(navigationRef.isReady());
    return cancelar;
  }, [navegacaoPronta]);

  useEffect(() => {
    if (!pendente || !navegacaoPronta || carregando) return;
    const produto = buscarPorId(pendente);
    setPendente(null);
    if (!produto) return;
    navigationRef.navigate('Abas', {
      screen: 'Despensa',
      params: { screen: 'DetalheProduto', params: { produtoId: produto.id } },
    });
  }, [pendente, navegacaoPronta, carregando, buscarPorId]);
}
