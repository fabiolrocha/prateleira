const MS_POR_DIA = 24 * 60 * 60 * 1000;

export function deIso(iso: string): Date {
  const [ano, mes, dia] = iso.split('-').map(Number);
  return new Date(ano, mes - 1, dia);
}

export function inicioDoDia(data: Date): Date {
  const copia = new Date(data);
  copia.setHours(0, 0, 0, 0);
  return copia;
}

export function diasEntre(de: Date, ate: Date): number {
  const diferenca = inicioDoDia(ate).getTime() - inicioDoDia(de).getTime();
  return Math.round(diferenca / MS_POR_DIA);
}

export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano.slice(2)}`;
}
