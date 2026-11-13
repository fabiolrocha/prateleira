import { ItemBase } from './ItemBase';
import { deIso, diasEntre } from '../utils/datas';

export type StatusValidade = 'Em dia' | 'Atenção' | 'Vencido';
export type NutriScore = 'A' | 'B' | 'C' | 'D' | 'E';

export type ProdutoDados = {
  id: string;
  nome: string;
  codigoBarras: string;
  marca?: string;
  fotoUrl?: string;
  nutriScore?: NutriScore;
  validade: string;
  quantidade: number;
  diasAviso?: number;
  reposicao?: boolean;
  notificacaoId?: string;
  criadoEm: string;
};

const diasParaAviso = 3;

export class Produto extends ItemBase {
  codigoBarras: string;
  marca?: string;
  fotoUrl?: string;
  nutriScore?: NutriScore;
  validade: string;
  quantidade: number;
  diasAviso: number;
  reposicao: boolean;
  notificacaoId?: string;
  criadoEm: string;

  constructor(dados: ProdutoDados) {
    super(dados.id, dados.nome);
    this.codigoBarras = dados.codigoBarras;
    this.marca = dados.marca;
    this.fotoUrl = dados.fotoUrl;
    this.nutriScore = dados.nutriScore;
    this.validade = dados.validade;
    this.quantidade = dados.quantidade;
    this.diasAviso = dados.diasAviso ?? diasParaAviso;
    this.reposicao = dados.reposicao ?? false;
    this.notificacaoId = dados.notificacaoId;
    this.criadoEm = dados.criadoEm;
  }

  diasParaVencimento(hoje: Date = new Date()): number {
    return diasEntre(hoje, deIso(this.validade));
  }

  get status(): StatusValidade {
    const dias = this.diasParaVencimento();
    if (dias < 0) return 'Vencido';
    if (dias <= this.diasAviso) return 'Atenção';
    return 'Em dia';
  }

  descricao(): string {
    const dias = this.diasParaVencimento();
    if (dias < -1) return `Vencido há ${-dias} dias`;
    if (dias === -1) return 'Vencido ontem';
    if (dias === 0) return 'Vence hoje';
    if (dias === 1) return 'Vence amanhã';
    return `Vence em ${dias} dias`;
  }

  toJSON(): ProdutoDados {
    return {
      id: this.id,
      codigoBarras: this.codigoBarras,
      nome: this.nome,
      marca: this.marca,
      fotoUrl: this.fotoUrl,
      nutriScore: this.nutriScore,
      validade: this.validade,
      quantidade: this.quantidade,
      diasAviso: this.diasAviso,
      reposicao: this.reposicao,
      notificacaoId: this.notificacaoId,
      criadoEm: this.criadoEm,
    };
  }

  static fromJSON(dados: ProdutoDados): Produto {
    return new Produto(dados);
  }
}
