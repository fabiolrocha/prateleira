import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { CHAVES, ler, salvar } from '../services/armazenamento';
import { AJUSTES_PADRAO } from '../tipos';
import type { Ajustes } from '../tipos';

export type AjustesContextoValor = {
  ajustes: Ajustes;
  carregando: boolean;
  atualizarAjustes: (alteracoes: Partial<Ajustes>) => Promise<void>;
};

const AjustesContext = createContext<AjustesContextoValor | null>(null);

export function AjustesProvider({ children }: { children: ReactNode }): ReactElement {
  const [ajustes, setAjustes] = useState<Ajustes>(AJUSTES_PADRAO);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    let ativo = true;
    async function carregar(): Promise<void> {
      try {
        const salvos = await ler<Ajustes>(CHAVES.ajustes);
        if (ativo && salvos) setAjustes({ ...AJUSTES_PADRAO, ...salvos });
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const atualizarAjustes = useCallback(
    async (alteracoes: Partial<Ajustes>): Promise<void> => {
      const novos: Ajustes = { ...ajustes, ...alteracoes };
      setAjustes(novos);
      await salvar(CHAVES.ajustes, novos);
    },
    [ajustes],
  );

  const valor = useMemo<AjustesContextoValor>(
    () => ({ ajustes, carregando, atualizarAjustes }),
    [ajustes, carregando, atualizarAjustes],
  );

  return <AjustesContext.Provider value={valor}>{children}</AjustesContext.Provider>;
}

export function useAjustes(): AjustesContextoValor {
  const contexto = useContext(AjustesContext);
  if (!contexto) {
    throw new Error('useAjustes deve ser usado dentro de AjustesProvider');
  }
  return contexto;
}
