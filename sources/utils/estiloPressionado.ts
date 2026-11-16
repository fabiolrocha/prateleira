import { cores } from '../tema';

export const OPACIDADE_PRESSIONADO = 0.85;

export function fundoPressionado(pressionado: boolean, desabilitado = false) {
  if (!pressionado || desabilitado) return null;
  return { backgroundColor: cores.painelPressionado };
}

export function opacidadePressionado(pressionado: boolean, desabilitado = false) {
  if (!pressionado || desabilitado) return null;
  return { opacity: OPACIDADE_PRESSIONADO };
}
