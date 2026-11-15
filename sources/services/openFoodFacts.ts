import type { NutriScore } from '../models/Produto';
import type { ProdutoApi } from '../tipos';

export const URL_API = 'https://world.openfoodfacts.org/api/v2/product';

const CAMPOS = 'product_name,brands,image_front_small_url,nutriscore_grade,quantity';
const NUTRISCORES_VALIDOS: readonly string[] = ['A', 'B', 'C', 'D', 'E'];

type ProdutoOpenFoodFacts = {
  product_name?: string;
  brands?: string;
  image_front_small_url?: string;
  nutriscore_grade?: string;
  quantity?: string;
};

type RespostaOpenFoodFacts = {
  status: 0 | 1;
  code?: string;
  product?: ProdutoOpenFoodFacts;
};

function textoOuUndefined(valor?: string): string | undefined {
  const texto = valor?.trim();
  return texto ? texto : undefined;
}

function converterNutriScore(grau?: string): NutriScore | undefined {
  const maiusculo = grau?.toUpperCase();
  if (maiusculo && NUTRISCORES_VALIDOS.includes(maiusculo)) {
    return maiusculo as NutriScore;
  }
  return undefined;
}

function converterProduto(codigo: string, produto: ProdutoOpenFoodFacts): ProdutoApi {
  return {
    codigo,
    nome: textoOuUndefined(produto.product_name) ?? 'Produto sem nome',
    marca: textoOuUndefined(produto.brands),
    fotoUrl: textoOuUndefined(produto.image_front_small_url),
    nutriScore: converterNutriScore(produto.nutriscore_grade),
    quantidadeTexto: textoOuUndefined(produto.quantity),
  };
}

export async function buscarProdutoPorCodigo(codigo: string): Promise<ProdutoApi | null> {
  const codigoLimpo = codigo.trim();
  if (!codigoLimpo) {
    return null;
  }

  let resposta: Response;
  try {
    resposta = await fetch(
      `${URL_API}/${encodeURIComponent(codigoLimpo)}.json?fields=${CAMPOS}`
    );
  } catch {
    throw new Error('Sem conexão com a internet. Verifique a rede e tente novamente.');
  }

  if (resposta.status === 404) {
    return null;
  }
  if (!resposta.ok) {
    throw new Error(`Falha ao consultar o Open Food Facts (código ${resposta.status}).`);
  }

  const dados = (await resposta.json()) as RespostaOpenFoodFacts;
  if (dados.status === 0 || !dados.product) {
    return null;
  }

  return converterProduto(codigoLimpo, dados.product);
}
