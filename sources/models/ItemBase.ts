// Classe mãe de Produto e ItemCompra.
export abstract class ItemBase {
  constructor(
    public readonly id: string,
    public nome: string,
  ) {}

  abstract descricao(): string;
}
