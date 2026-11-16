import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { ItemCompra } from '../models/ItemCompra';
import type { ItemCompraDados } from '../models/ItemCompra';
import type { Produto } from '../models/Produto';
import { CHAVES, ler, salvar } from '../services/armazenamento';

export type ListaComprasContextoValor = {
  itens: ItemCompra[];
  carregando: boolean;
  adicionarManual: (nome: string, quantidadeTexto?: string) => Promise<void>;
  adicionarAutomatico: (produto: Produto) => Promise<void>;
  alternarCarrinho: (id: string) => Promise<void>;
  remover: (id: string) => Promise<void>;
};

const ListaComprasContext = createContext<ListaComprasContextoValor | null>(null);

function gerarId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function ListaComprasProvider({ children }: { children: ReactNode }): ReactElement {
  const [itens, setItens] = useState<ItemCompra[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const itensRef = useRef<ItemCompra[]>([]);

  useEffect(() => {
    let ativo = true;
    async function carregar(): Promise<void> {
      try {
        const salvos = await ler<ItemCompraDados[]>(CHAVES.lista);
        if (ativo && salvos) {
          const lidos = salvos.map((dados) => ItemCompra.fromJSON(dados));
          itensRef.current = lidos;
          setItens(lidos);
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const aplicar = useCallback(async (novos: ItemCompra[]): Promise<void> => {
    itensRef.current = novos;
    setItens(novos);
    await salvar(
      CHAVES.lista,
      novos.map((item) => item.toJSON()),
    );
  }, []);

  const adicionarManual = useCallback(
    async (nome: string, quantidadeTexto?: string): Promise<void> => {
      const nomeLimpo = nome.trim();
      if (!nomeLimpo) return;
      const quantidadeLimpa = quantidadeTexto?.trim() || undefined;
      const item = new ItemCompra({
        id: gerarId(),
        nome: nomeLimpo,
        quantidadeTexto: quantidadeLimpa,
        origem: 'manual',
        noCarrinho: false,
      });
      await aplicar([...itensRef.current, item]);
    },
    [aplicar],
  );

  const adicionarAutomatico = useCallback(
    async (produto: Produto): Promise<void> => {
      if (itensRef.current.some((item) => item.produtoOrigemId === produto.id)) return;
      await aplicar([...itensRef.current, ItemCompra.deProduto(produto, gerarId())]);
    },
    [aplicar],
  );

  const alternarCarrinho = useCallback(
    async (id: string): Promise<void> => {
      const novos = itensRef.current.map((item) => {
        if (item.id !== id) return item;
        const copia = ItemCompra.fromJSON(item.toJSON());
        copia.alternarCarrinho();
        return copia;
      });
      await aplicar(novos);
    },
    [aplicar],
  );

  const remover = useCallback(
    async (id: string): Promise<void> => {
      await aplicar(itensRef.current.filter((item) => item.id !== id));
    },
    [aplicar],
  );

  const valor = useMemo<ListaComprasContextoValor>(
    () => ({ itens, carregando, adicionarManual, adicionarAutomatico, alternarCarrinho, remover }),
    [itens, carregando, adicionarManual, adicionarAutomatico, alternarCarrinho, remover],
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
