import type { NutriScore } from './models/Produto';

export type Usuario = {
  nome: string;
  desde: string;
};

export type Ajustes = {
  avisosAtivos: boolean;
  diasAvisoPadrao: number;
  horaAviso: number;
  minutoAviso: number;
};

export const AJUSTES_PADRAO: Ajustes = {
  avisosAtivos: true,
  diasAvisoPadrao: 3,
  horaAviso: 9,
  minutoAviso: 0,
};

export type TipoEvento = 'consumido' | 'descartado';

export type EventoHistorico = {
  produtoId: string;
  nome: string;
  tipo: TipoEvento;
  data: string;
};

export type ResumoMes = {
  usadosATempo: number;
  jogadosFora: number;
};

export type ProdutoApi = {
  codigo: string;
  nome: string;
  marca?: string;
  fotoUrl?: string;
  nutriScore?: NutriScore;
  quantidadeTexto?: string;
};
