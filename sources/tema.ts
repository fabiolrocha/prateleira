export const paleta = {
  cinza: {
    900: '#131927',
    800: '#212936',
    700: '#394050',
    600: '#4D5461',
    500: '#6D717F',
    400: '#9EA2AE',
    300: '#D2D5DB',
    200: '#E5E7EA',
    100: '#F3F4F6',
    50: '#F9FAFB',
  },
  primaria: {
    900: '#054026',
    800: '#08653C',
    700: '#0B8A52',
    600: '#0FB86D',
    500: '#57CD99',
    400: '#75D6AB',
    300: '#9DE2C3',
    200: '#B8EAD4',
    100: '#CFF1E2',
    50: '#EBF9F3',
  },
  creme: {
    900: '#C1CDC1',
    800: '#CDD9CD',
    700: '#D0DFD0',
    600: '#D4E6D4',
    500: '#DBECDB',
    400: '#E2F2E2',
    300: '#E8F7E8',
    200: '#EBF9EB',
    100: '#F7FFF7',
    50: '#FBFEFB',
  },
  brancoAlfa: {
    100: '#FFFFFF',
    90: '#FFFFFFE6',
    80: '#FFFFFFCC',
    70: '#FFFFFFB3',
    60: '#FFFFFF99',
    50: '#FFFFFF80',
    40: '#FFFFFF66',
    30: '#FFFFFF4D',
    20: '#FFFFFF33',
    10: '#FFFFFF1A',
  },
  tons: {
    preto: '#0A0A0A',
    creme: '#F6F3EA',
    cremeEscuro: '#ECE7D8',
    linha: '#D9D2BE',
    marrom: '#4A4437',
    marromClaro: '#8A8372',
    azul: '#3E6384',
    ambar: '#8F6A1E',
    verde: '#2F6B3A',
    vermelho: '#A63A2B',
    verdeClaro: '#B8E5C0',
    laranjaClaro: '#FFDBBC',
    vermelhoClaro: '#EFC9C3',
  },
} as const;

export const sombras = {
  100: {
    shadowColor: paleta.cinza[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  200: {
    shadowColor: paleta.cinza[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  300: {
    shadowColor: paleta.cinza[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  400: {
    shadowColor: paleta.cinza[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  500: {
    shadowColor: paleta.cinza[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  600: {
    shadowColor: paleta.cinza[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  700: {
    shadowColor: paleta.cinza[900],
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  800: {
    shadowColor: paleta.cinza[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 12,
  },
} as const;

export const cores = {
  fundo: paleta.brancoAlfa[100],
  painel: paleta.tons.creme,
  painelPressionado: paleta.tons.cremeEscuro,
  linha: paleta.tons.linha,
  texto: paleta.tons.marrom,
  destaque: paleta.tons.preto,
  apagado: paleta.tons.marromClaro,
  rotulo: paleta.tons.azul,
  atencao: paleta.tons.ambar,
  positivo: paleta.tons.verde,
  perigo: paleta.tons.vermelho,
  sobreDestaque: paleta.brancoAlfa[100],
} as const;

export const fontes = {
  regular: 'JetBrainsMono_400Regular',
  medio: 'JetBrainsMono_500Medium',
  extranegrito: 'JetBrainsMono_800ExtraBold',
} as const;

export const tamanhos = {
  micro: 9,
  legenda: 11,
  corpo: 13,
  titulo: 20,
  display: 28,
} as const;

export const espacamentoLetras = {
  normal: 0.5,
  largo: 1.2,
  maisLargo: 2,
} as const;

export const espacos = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 36,
} as const;

export const bordas = {
  largura: 1,
  acento: 3,
} as const;

export const raios = {
  nenhum: 0,
} as const;

export const toque = {
  minimo: 44,
} as const;
