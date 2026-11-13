// Cores, fontes, tamanhos e raios do protótipo no Figma (seção "Componentes").
// Toda tela e componente usa estes valores em vez de escrever a cor solta.
// Assim, mudar uma cor aqui muda o app inteiro.

export const cores = {
  fundo: '#F1F3EE',           // fundo das telas
  superficie: '#FFFFFF',      // cards, campos, barra de abas
  texto: '#17202B',           // texto principal, botão primário, filtro ativo
  textoSecundario: '#69727A', // subtítulos, legendas, aba inativa
  textoInverso: '#FFFFFF',    // texto sobre fundo escuro
  borda: '#DCE1DA',           // borda do botão contorno, filtro inativo, barra de abas

  positivo: '#1F7A4D',        // botão "Consumi", texto da tag "Em dia"
  positivoClaro: '#E2EFE6',   // fundo da tag "Em dia" e da miniatura do card
  atencao: '#F2B705',         // tag "Atenção" e card "vencem esta semana"
  perigo: '#D63F2A',          // tag "Vencido" e texto do botão "Joguei fora"
  perigoClaro: '#FBE3DE',     // fundo do botão "Joguei fora"
} as const;

// Nomes das fontes do Figma, carregadas no App.tsx com useFonts.
// Schibsted Grotesk é o texto do app; DotGothic16 imita o carimbo "VAL 06/10" da embalagem.
export const fontes = {
  regular: 'SchibstedGrotesk_400Regular',
  medio: 'SchibstedGrotesk_500Medium',
  seminegrito: 'SchibstedGrotesk_600SemiBold',
  extranegrito: 'SchibstedGrotesk_800ExtraBold',
  carimbo: 'DotGothic16_400Regular',
} as const;

// Tamanhos de texto usados no Figma.
export const tamanhos = {
  legenda: 12,    // tags e rótulos da barra de abas
  pequeno: 13,    // subtítulo do card
  corpo: 14,      // rótulos de campo, filtros
  medio: 16,      // nome no card, texto do botão
  grande: 18,     // texto de apresentação
  titulo: 30,     // "Sua despensa", "Lista de compras"
  destaque: 46,   // "Prateleira" na Boas-vindas
} as const;

// Arredondamento dos cantos.
export const raios = {
  tag: 6,
  botao: 14,      // botões e campos de texto
  card: 18,
  painel: 24,     // cartão grande da Boas-vindas
  pilula: 999,    // filtros (canto totalmente redondo)
} as const;

// Espaçamentos (padding e margin).
export const espacos = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,         // margem lateral das telas
  xxl: 24,
} as const;
