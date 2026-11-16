import { openDatabaseAsync } from 'expo-sqlite';
import type { SQLiteDatabase } from 'expo-sqlite';
import type { Produto } from '../models/Produto';
import type { EventoHistorico, ResumoMes, TipoEvento } from '../tipos';

const NOME_BANCO = 'prateleira.db';

type LinhaContagem = {
  tipo: TipoEvento;
  total: number;
};

type LinhaHistorico = {
  produtoId: string;
  nome: string;
  tipo: TipoEvento;
  data: string;
};

let conexao: Promise<SQLiteDatabase> | null = null;

async function prepararBanco(): Promise<SQLiteDatabase> {
  const banco = await openDatabaseAsync(NOME_BANCO);
  await banco.execAsync(
    `CREATE TABLE IF NOT EXISTS historico (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produtoId TEXT NOT NULL,
      nome TEXT NOT NULL,
      codigoBarras TEXT,
      marca TEXT,
      tipo TEXT NOT NULL,
      data TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idxHistoricoData ON historico (data);`,
  );
  return banco;
}

export function abrirBanco(): Promise<SQLiteDatabase> {
  if (!conexao) {
    conexao = prepararBanco().catch((erro: unknown) => {
      conexao = null;
      throw erro;
    });
  }
  return conexao;
}

export async function registrarEvento(
  produto: Produto,
  tipo: TipoEvento,
  data: Date = new Date(),
): Promise<void> {
  const banco = await abrirBanco();
  await banco.runAsync(
    'INSERT INTO historico (produtoId, nome, codigoBarras, marca, tipo, data) VALUES (?, ?, ?, ?, ?, ?)',
    [
      produto.id,
      produto.nome,
      produto.codigoBarras,
      produto.marca ?? null,
      tipo,
      data.toISOString(),
    ],
  );
}

export function inicioDoMes(referencia: Date = new Date()): Date {
  return new Date(referencia.getFullYear(), referencia.getMonth(), 1);
}

export async function resumoDoMes(referencia: Date = new Date()): Promise<ResumoMes> {
  const banco = await abrirBanco();
  const inicio = inicioDoMes(referencia);
  const fim = new Date(inicio.getFullYear(), inicio.getMonth() + 1, 1);
  const linhas = await banco.getAllAsync<LinhaContagem>(
    'SELECT tipo, COUNT(*) AS total FROM historico WHERE data >= ? AND data < ? GROUP BY tipo',
    [inicio.toISOString(), fim.toISOString()],
  );
  const resumo: ResumoMes = { usadosATempo: 0, jogadosFora: 0 };
  for (const linha of linhas) {
    if (linha.tipo === 'consumido') resumo.usadosATempo = linha.total;
    if (linha.tipo === 'descartado') resumo.jogadosFora = linha.total;
  }
  return resumo;
}

export async function listarHistorico(limite: number = 50): Promise<EventoHistorico[]> {
  const banco = await abrirBanco();
  return banco.getAllAsync<LinhaHistorico>(
    'SELECT produtoId, nome, tipo, data FROM historico ORDER BY data DESC, id DESC LIMIT ?',
    [limite],
  );
}

export async function temHistorico(): Promise<boolean> {
  const banco = await abrirBanco();
  const linha = await banco.getFirstAsync<{ total: number }>(
    'SELECT COUNT(*) AS total FROM historico',
  );
  return (linha?.total ?? 0) > 0;
}
