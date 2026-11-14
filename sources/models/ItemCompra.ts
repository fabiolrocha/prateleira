import { ItemBase } from './ItemBase';
import { Produto } from './Produto';

export type OrigemItem = 'automatico' | 'manual';

export type ItemCompraDados = {
  id: string;
  nome: string;
  quantidadeTexto?: string;
  origem: OrigemItem;
  noCarrinho: boolean;
  produtoOrigemId?: string;
};

export class ItemCompra extends ItemBase {
  quantidadeTexto?: string;
  origem: OrigemItem;
  noCarrinho: boolean;
  produtoOrigemId?: string;

  constructor(dados: ItemCompraDados) {
    super(dados.id, dados.nome);
    this.quantidadeTexto = dados.quantidadeTexto;
    this.origem = dados.origem;
    this.noCarrinho = dados.noCarrinho;
    this.produtoOrigemId = dados.produtoOrigemId;
  }

  descricao(): string {
    return this.quantidadeTexto ?? '';
  }

  alternarCarrinho(): void {
    this.noCarrinho = !this.noCarrinho;
  }

  toJSON(): ItemCompraDados {
    return {
      id: this.id,
      nome: this.nome,
      quantidadeTexto: this.quantidadeTexto,
      origem: this.origem,
      noCarrinho: this.noCarrinho,
      produtoOrigemId: this.produtoOrigemId,
    };
  }

  static fromJSON(dados: ItemCompraDados): ItemCompra {
    return new ItemCompra(dados);
  }

  static deProduto(produto: Produto, id: string): ItemCompra {
    return new ItemCompra({
      id,
      nome: produto.nome,
      origem: 'automatico',
      noCarrinho: false,
      produtoOrigemId: produto.id,
    });
  }
}