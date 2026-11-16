import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Produto } from '../models/Produto';
import type { ProdutoDados } from '../models/Produto';
import { CHAVES, ler, salvar } from '../services/armazenamento';
import type { TipoEvento } from '../tipos';

export type NovoProduto = Omit<ProdutoDados, 'id' | 'criadoEm' | 'notificacaoId'>;

export type IntegracoesDespensa = {
  agendarAviso: (produto: Produto) => Promise<string | undefined>;
  cancelarAviso: (notificacaoId?: string) => Promise<void>;
  registrarEvento: (produto: Produto, tipo: TipoEvento) => Promise<void>;
  reporNaLista: (produto: Produto) => void | Promise<void>;
};

export type DespensaContextoValor = {
  produtos: Produto[];
  carregando: boolean;
  adicionar: (dados: NovoProduto) => Promise<Produto>;
  atualizar: (id: string, alteracoes: Partial<NovoProduto>) => Promise<Produto | null>;
  consumir: (id: string) => Promise<void>;
  descartar: (id: string) => Promise<void>;
  buscarPorId: (id: string) => Produto | undefined;
  reagendarTodos: () => Promise<void>;
};

type DespensaProviderProps = {
  children: ReactNode;
  integracoes?: Partial<IntegracoesDespensa>;
};

const integracoesPadrao: IntegracoesDespensa = {
  agendarAviso: async () => undefined,
  cancelarAviso: async () => undefined,
  registrarEvento: async () => undefined,
  reporNaLista: () => undefined,
};

const DespensaContext = createContext<DespensaContextoValor | null>(null);

function gerarId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function ordenarPorValidade(lista: Produto[]): Produto[] {
  return [...lista].sort((a, b) => a.validade.localeCompare(b.validade));
}

export function DespensaProvider({
  children,
  integracoes,
}: DespensaProviderProps): ReactElement {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const listaRef = useRef<Produto[]>([]);
  const integracoesRef = useRef<IntegracoesDespensa>(integracoesPadrao);

  integracoesRef.current = { ...integracoesPadrao, ...integracoes };

  const gravar = useCallback(async (lista: Produto[]): Promise<void> => {
    listaRef.current = lista;
    setProdutos(lista);
    await salvar(
      CHAVES.produtos,
      lista.map((produto) => produto.toJSON()),
    );
  }, []);

  useEffect(() => {
    let ativo = true;
    async function carregar(): Promise<void> {
      try {
        const dados = await ler<ProdutoDados[]>(CHAVES.produtos);
        if (ativo && dados) {
          const lista = dados.map((item) => Produto.fromJSON(item));
          listaRef.current = lista;
          setProdutos(lista);
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

  const adicionar = useCallback(
    async (dados: NovoProduto): Promise<Produto> => {
      const produto = Produto.fromJSON({
        ...dados,
        id: gerarId(),
        criadoEm: new Date().toISOString(),
      });
      produto.notificacaoId = await integracoesRef.current.agendarAviso(produto);
      await gravar([...listaRef.current, produto]);
      return produto;
    },
    [gravar],
  );

  const atualizar = useCallback(
    async (id: string, alteracoes: Partial<NovoProduto>): Promise<Produto | null> => {
      const atual = listaRef.current.find((item) => item.id === id);
      if (!atual) return null;
      await integracoesRef.current.cancelarAviso(atual.notificacaoId);
      const atualizado = Produto.fromJSON({
        ...atual.toJSON(),
        ...alteracoes,
        notificacaoId: undefined,
      });
      atualizado.notificacaoId = await integracoesRef.current.agendarAviso(atualizado);
      await gravar(listaRef.current.map((item) => (item.id === id ? atualizado : item)));
      return atualizado;
    },
    [gravar],
  );

  const remover = useCallback(
    async (produto: Produto, tipo: TipoEvento): Promise<void> => {
      await integracoesRef.current.cancelarAviso(produto.notificacaoId);
      await gravar(listaRef.current.filter((item) => item.id !== produto.id));
      await integracoesRef.current.registrarEvento(produto, tipo);
      if (produto.reposicao) await integracoesRef.current.reporNaLista(produto);
    },
    [gravar],
  );

  const consumir = useCallback(
    async (id: string): Promise<void> => {
      const atual = listaRef.current.find((item) => item.id === id);
      if (!atual) return;
      if (atual.quantidade > 1) {
        const atualizado = Produto.fromJSON({
          ...atual.toJSON(),
          quantidade: atual.quantidade - 1,
        });
        await gravar(listaRef.current.map((item) => (item.id === id ? atualizado : item)));
        return;
      }
      await remover(atual, 'consumido');
    },
    [gravar, remover],
  );

  const descartar = useCallback(
    async (id: string): Promise<void> => {
      const atual = listaRef.current.find((item) => item.id === id);
      if (!atual) return;
      await remover(atual, 'descartado');
    },
    [remover],
  );

  const reagendarTodos = useCallback(async (): Promise<void> => {
    const atualizados = await Promise.all(
      listaRef.current.map(async (produto) => {
        await integracoesRef.current.cancelarAviso(produto.notificacaoId);
        const copia = Produto.fromJSON({ ...produto.toJSON(), notificacaoId: undefined });
        copia.notificacaoId = await integracoesRef.current.agendarAviso(copia);
        return copia;
      }),
    );
    await gravar(atualizados);
  }, [gravar]);

  const ordenados = useMemo<Produto[]>(() => ordenarPorValidade(produtos), [produtos]);

  const buscarPorId = useCallback(
    (id: string): Produto | undefined => produtos.find((item) => item.id === id),
    [produtos],
  );

  const valor = useMemo<DespensaContextoValor>(
    () => ({
      produtos: ordenados,
      carregando,
      adicionar,
      atualizar,
      consumir,
      descartar,
      buscarPorId,
      reagendarTodos,
    }),
    [ordenados, carregando, adicionar, atualizar, consumir, descartar, buscarPorId, reagendarTodos],
  );

  return <DespensaContext.Provider value={valor}>{children}</DespensaContext.Provider>;
}

export function useDespensa(): DespensaContextoValor {
  const contexto = useContext(DespensaContext);
  if (!contexto) {
    throw new Error('useDespensa deve ser usado dentro de DespensaProvider');
  }
  return contexto;
}
