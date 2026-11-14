// Tipos compartilhados entre telas, contextos e serviços.
// Os modelos com métodos (Produto, ItemCompra) ficam em sources/models.
import type { NutriScore } from './models/Produto';

// Quem usa o app. Salvo em @prateleira/usuario.
export type Usuario = {
  nome: string;
  desde: string; // ISO: data do primeiro acesso ("Usa a Prateleira desde setembro")
};

// Ajustes da tela Perfil. Salvo em @prateleira/ajustes.
export type Ajustes = {
  avisosAtivos: boolean;   // Switch "Avisos de validade"
  diasAvisoPadrao: number; // Slider "Antecedência padrão" (1 a 7)
  horaAviso: number;       // "Horário do aviso" (0 a 23)
  minutoAviso: number;     // (0 a 59)
};

// Valores usados na primeira vez que o app abre.
export const AJUSTES_PADRAO: Ajustes = {
  avisosAtivos: true,
  diasAvisoPadrao: 3,
  horaAviso: 9,
  minutoAviso: 0,
};

// Linha da tabela "historico" do SQLite.
export type TipoEvento = 'consumido' | 'descartado';

export type EventoHistorico = {
  produtoId: string;
  nome: string;
  tipo: TipoEvento;
  data: string; // ISO
};

// Resultado do resumo do mês, mostrado no Perfil.
export type ResumoMes = {
  usadosATempo: number;
  jogadosFora: number;
};

// O que o serviço da Open Food Facts devolve para o app (já convertido).
export type ProdutoApi = {
  codigo: string;
  nome: string;
  marca?: string;
  fotoUrl?: string;
  nutriScore?: NutriScore;   // a API manda minúsculo; o serviço converte com toUpperCase()
  quantidadeTexto?: string;  // "170 g", "1 L"
};
