import AsyncStorage from '@react-native-async-storage/async-storage';

export const CHAVES = {
  usuario: '@prateleira/usuario',
  produtos: '@prateleira/produtos',
  lista: '@prateleira/lista',
  ajustes: '@prateleira/ajustes',
} as const;

export async function salvar<T>(chave: string, valor: T): Promise<void> {
  await AsyncStorage.setItem(chave, JSON.stringify(valor));
}

export async function ler<T>(chave: string): Promise<T | null> {
  const json = await AsyncStorage.getItem(chave);
  return json ? (JSON.parse(json) as T) : null;
}

export async function deletar(chave: string): Promise<void> {
  await AsyncStorage.removeItem(chave);
}
