import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { ItemCompra } from '../models/ItemCompra';
import type { Produto } from '../models/Produto';

export type ListaComprasContextoValor = {
  itens: ItemCompra[];
  carregando: boolean;
  adicionarManual: (nome: string, quantidadeTexto?: string) => Promise<void>;
  adicionarAutomatico: (produto: Produto) => Promise<void>;
  alternarCarrinho: (id: string) => Promise<void>;
  remover: (id: string) => Promise<void>;
};

const ListaComprasContext = createContext<ListaComprasContextoValor | null>(null);

const ITENS_EXEMPLO: ItemCompra[] = [
  new ItemCompra({
    id: 'exemplo-1',
    nome: 'Leite integral',
    quantidadeTexto: '2 caixas',
    origem: 'automatico',
    noCarrinho: false,
  }),
  new ItemCompra({ id: 'exemplo-2', nome: 'Pão de forma', origem: 'manual', noCarrinho: false }),
  new ItemCompra({
    id: 'exemplo-3',
    nome: 'Ovos',
    quantidadeTexto: '1 dúzia',
    origem: 'manual',
    noCarrinho: true,
  }),
];

function gerarId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function ListaComprasProvider({ children }: { children: ReactNode }): ReactElement {
  const [itens, setItens] = useState<ItemCompra[]>(ITENS_EXEMPLO);

  const adicionarManual = useCallback(
    async (nome: string, quantidadeTexto?: string): Promise<void> => {
      const item = new ItemCompra({
        id: gerarId(),
        nome,
        quantidadeTexto,
        origem: 'manual',
        noCarrinho: false,
      });
      setItens((atual) => [...atual, item]);
    },
    [],
  );

  const adicionarAutomatico = useCallback(async (produto: Produto): Promise<void> => {
    setItens((atual) => {
      if (atual.some((item) => item.produtoOrigemId === produto.id)) return atual;
      return [...atual, ItemCompra.deProduto(produto, gerarId())];
    });
  }, []);

  const alternarCarrinho = useCallback(async (id: string): Promise<void> => {
    setItens((atual) =>
      atual.map((item) => {
        if (item.id !== id) return item;
        const copia = ItemCompra.fromJSON(item.toJSON());
        copia.alternarCarrinho();
        return copia;
      }),
    );
  }, []);

  const remover = useCallback(async (id: string): Promise<void> => {
    setItens((atual) => atual.filter((item) => item.id !== id));
  }, []);

  const valor = useMemo<ListaComprasContextoValor>(
    () => ({
      itens,
      carregando: false,
      adicionarManual,
      adicionarAutomatico,
      alternarCarrinho,
      remover,
    }),
    [itens, adicionarManual, adicionarAutomatico, alternarCarrinho, remover],
  );

  return <ListaComprasContext.Provider value={valor}>{children}</ListaComprasContext.Provider>;
}

export function useListaCompras(): ListaComprasContextoValor {
  const contexto = useContext(ListaComprasContext);
  if (!contexto) {
    throw new Error('useListaCompras deve ser usado dentro de ListaComprasProvider');
  }
  return contexto;
}
