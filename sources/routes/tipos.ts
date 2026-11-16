import type { NavigatorScreenParams } from '@react-navigation/native';

export type DespensaStackParams = {
  Despensa: undefined;
  DetalheProduto: { produtoId: string };
};

export type TabParams = {
  Home: undefined;
  Despensa: NavigatorScreenParams<DespensaStackParams> | undefined;
  Lista: undefined;
  Ajustes: undefined;
};

export type RootStackParams = {
  BoasVindas: undefined;
  Tour: undefined;
  Abas: NavigatorScreenParams<TabParams> | undefined;
  Escanear: undefined;
  ConfirmarProduto: { codigoBarras: string };
};
