import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { CHAVES, ler, salvar } from '../services/armazenamento';
import type { Usuario } from '../tipos';

export type UsuarioContextoValor = {
  usuario: Usuario | null;
  carregando: boolean;
  definirNome: (nome: string) => Promise<void>;
};

const UsuarioContext = createContext<UsuarioContextoValor | null>(null);

export function UsuarioProvider({ children }: { children: ReactNode }): ReactElement {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    let ativo = true;
    async function carregar(): Promise<void> {
      try {
        const salvo = await ler<Usuario>(CHAVES.usuario);
        if (ativo && salvo) setUsuario(salvo);
      } finally {
        if (ativo) setCarregando(false);
      }
    }
    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const definirNome = useCallback(async (nome: string): Promise<void> => {
    const novo: Usuario = { nome: nome.trim(), desde: new Date().toISOString() };
    setUsuario(novo);
    await salvar(CHAVES.usuario, novo);
  }, []);

  const valor = useMemo<UsuarioContextoValor>(
    () => ({ usuario, carregando, definirNome }),
    [usuario, carregando, definirNome],
  );

  return <UsuarioContext.Provider value={valor}>{children}</UsuarioContext.Provider>;
}

export function useUsuario(): UsuarioContextoValor {
  const contexto = useContext(UsuarioContext);
  if (!contexto) {
    throw new Error('useUsuario deve ser usado dentro de UsuarioProvider');
  }
  return contexto;
}
