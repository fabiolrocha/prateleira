import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Animated } from 'react-native';
import { Toast } from '../components/Toast';
import type { TipoToast } from '../components/Toast';

type ToastAtual = { mensagem: string; tipo: TipoToast };

type ToastContextoValor = {
  mostrar: (mensagem: string, tipo?: TipoToast) => void;
};

const DURACAO_VISIVEL = 2500;
const DURACAO_ANIMACAO = 180;

const ToastContexto = createContext<ToastContextoValor | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [atual, setAtual] = useState<ToastAtual | null>(null);
  const progresso = useRef(new Animated.Value(0)).current;
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mostrar = useCallback(
    (mensagem: string, tipo: TipoToast = 'info') => {
      if (temporizador.current) clearTimeout(temporizador.current);
      progresso.stopAnimation();
      progresso.setValue(0);
      setAtual({ mensagem, tipo });
      Animated.timing(progresso, {
        toValue: 1,
        duration: DURACAO_ANIMACAO,
        useNativeDriver: true,
      }).start();
      temporizador.current = setTimeout(() => {
        Animated.timing(progresso, {
          toValue: 0,
          duration: DURACAO_ANIMACAO,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) setAtual(null);
        });
      }, DURACAO_VISIVEL);
    },
    [progresso],
  );

  useEffect(
    () => () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    },
    [],
  );

  const valor = useMemo(() => ({ mostrar }), [mostrar]);

  return (
    <ToastContexto.Provider value={valor}>
      {children}
      {atual && <Toast mensagem={atual.mensagem} tipo={atual.tipo} progresso={progresso} />}
    </ToastContexto.Provider>
  );
}

export function useToast(): ToastContextoValor {
  const contexto = useContext(ToastContexto);
  if (!contexto) throw new Error('useToast deve ser usado dentro de ToastProvider');
  return contexto;
}
