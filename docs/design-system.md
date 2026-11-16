# Design system da Prateleira

Modo **claro**, monoespaçado, reto. Substitui o visual antigo do Figma (Schibsted Grotesk, cantos arredondados, amarelo/verde de fundo).

- **Fonte de verdade visual:** a tela "01 Boas-vindas" do Figma, como está hoje. Quando algum frame divergir dela, o frame está errado, não a 01.
- **Figma:** https://www.figma.com/design/jThLJM4t47ggLlN7FodICl/Prateleira-%E2%80%94-Prot%C3%B3tipo--Trabalho-Final-
- **Código:** tudo sai de `sources/tema.ts`. Nenhuma tela usa hex, tamanho ou espaçamento solto (regra do `AGENTS.md`).
- **Base do sistema:** vem do `design-system.ts` (tema escuro, React Native) adaptado para o claro. As escalas da paleta vêm do Figma; as cores semânticas seguem o que as telas usam (ver Pendências).

## 1. Regras

1. Cantos retos. Raio 0 em tudo.
2. Estrutura desenhada com borda de 1px, nunca com sombra ou gradiente.
3. Tudo em monoespaçada. Hierarquia por tamanho, peso e cor, não por família.
4. Rótulos de seção em MAIÚSCULAS, espaçamento largo, entre colchetes: `[ ACABOU EM CASA ]`. Texto corrido em caixa normal.
5. Um destaque por tela: `destaque` marca o item ativo ou selecionado, `rotulo` marca as seções.
6. Status = quadradinho + texto em maiúsculas. Nunca só cor.
7. Todo alvo de toque tem no mínimo 44 de altura.
8. Superfícies sobem de tom (fundo → painel → painelPressionado), sem mudar de matiz.
9. Sem ícones de categoria (pão, leite, ovo…). Produto usa `ThumbProduto`: placeholder ou foto do cliente.

## 2. Tokens

### Cores (claro)

Duas camadas em `sources/tema.ts`: `paleta` (primitivas, sem significado) e `cores` (semânticas, o que as telas usam). Componente nunca usa `paleta` direto, só `cores`.

#### Primitivas (escalas do Figma, seção Cores)

Valores lidos por pixel do render do Figma.

| Degrau | `cinza` | `primaria` | `creme` |
|---|---|---|---|
| 900 | `#131927` | `#054026` | `#C1CDC1` |
| 800 | `#212936` | `#08653C` | `#CDD9CD` |
| 700 | `#394050` | `#0B8A52` | `#D0DFD0` |
| 600 | `#4D5461` | `#0FB86D` | `#D4E6D4` |
| 500 | `#6D717F` | `#57CD99` | `#DBECDB` |
| 400 | `#9EA2AE` | `#75D6AB` | `#E2F2E2` |
| 300 | `#D2D5DB` | `#9DE2C3` | `#E8F7E8` |
| 200 | `#E5E7EA` | `#B8EAD4` | `#EBF9EB` |
| 100 | `#F3F4F6` | `#CFF1E2` | `#F7FFF7` |
| 50 | `#F9FAFB` | `#EBF9F3` | `#FBFEFB` |

`brancoAlfa`: branco `#FFFFFF` com opacidade 100, 90, 80, 70, 60, 50, 40, 30, 20 e 10 por cento (`#FFFFFFE6`, `#FFFFFFCC`, `#FFFFFFB3`, `#FFFFFF99`, `#FFFFFF80`, `#FFFFFF66`, `#FFFFFF4D`, `#FFFFFF33`, `#FFFFFF1A`).

`paleta.tons`: tons que as telas e os componentes do Figma realmente usam, medidos por pixel. Não coincidem com nenhum degrau das escalas acima (as escalas são frias e esverdeadas, as telas são quentes).

| Token | Valor | Onde aparece |
|---|---|---|
| `preto` | `#0A0A0A` | botão primário, aba ativa, títulos, filtro ativo, botão +, avatar |
| `creme` | `#F6F3EA` | cards, campos, tab bar, filtro inativo, thumb do slider |
| `cremeEscuro` | `#ECE7D8` | pressionado (valor do documento, não medido) |
| `linha` | `#D9D2BE` | borda de card e painel, divisória, trilho do slider |
| `marrom` | `#4A4437` | texto padrão e secundário, rótulos de aba inativa |
| `marromClaro` | `#8A8372` | placeholder e desabilitado (valor do documento, não medido) |
| `azul` | `#3E6384` | rótulos (valor do documento, não aparece nas telas medidas) |
| `ambar` | `#8F6A1E` | quadradinho e texto de VENCE AMANHÃ |
| `verde` | `#2F6B3A` | botão Consumi, switch, checkbox, barra "usados a tempo", borda de FALTAM N DIAS |
| `vermelho` | `#A63A2B` | Joguei fora, barra "jogados fora", ponto do sino, VENCEU ONTEM |
| `verdeClaro` | `#B8E5C0` | fundo da tag FALTAM N DIAS |
| `laranjaClaro` | `#FFDBBC` | fundo da tag laranja preenchida |
| `vermelhoClaro` | `#EFC9C3` | fundo da tag VENCEU ONTEM |

`sombras` (100 a 800): `shadowColor` `cinza[900]`, deslocamento vertical de 1 a 8, raio de 2 a 20, opacidade de 0,06 a 0,14, `elevation` de 1 a 12. **Estimadas** a partir do aspecto do render (o app é de bordas, sombra só em elementos flutuantes como o botão Adicionar).

#### Semânticas (`cores`)

| Token | Valor | Degrau da escala | Uso |
|---|---|---|---|
| `fundo` | `#FFFFFF` | `brancoAlfa[100]` | fundo das telas |
| `painel` | `#F6F3EA` | `tons.creme` | cards, campos, alertas, tab bar |
| `painelPressionado` | `#ECE7D8` | `tons.cremeEscuro` | pressionado |
| `linha` | `#D9D2BE` | `tons.linha` | toda borda e divisória (1px) |
| `texto` | `#4A4437` | `tons.marrom` | texto padrão e secundário |
| `destaque` | `#0A0A0A` | `tons.preto` | títulos, valores, ativo, botão primário, foco |
| `apagado` | `#8A8372` | `tons.marromClaro` | placeholder e desabilitado. Contraste baixo: nunca para texto essencial |
| `rotulo` | `#3E6384` | `tons.azul` | rótulos `[ ... ]` |
| `atencao` | `#8F6A1E` | `tons.ambar` | vence em breve, pendente |
| `positivo` | `#2F6B3A` | `tons.verde` | ok, no prazo, confirmar |
| `perigo` | `#A63A2B` | `tons.vermelho` | vencido, jogado fora |
| `sobreDestaque` | `#FFFFFF` | `brancoAlfa[100]` | texto sobre preenchimento `destaque`, `positivo` ou `perigo` |

#### Token por componente

| Componente | Fundo | Borda | Texto e ícone |
|---|---|---|---|
| Botão primário | `destaque` | nenhuma | `sobreDestaque` |
| Botão positivo (Consumi) | `positivo` | nenhuma | `sobreDestaque` |
| Botão contorno | `fundo` | `destaque` | `destaque` |
| Botão perigo (Joguei fora) | `fundo` | `perigo` | `perigo` |
| Tag FALTAM N DIAS | `paleta.tons.verdeClaro` | `positivo` | `destaque` |
| Tag VENCE AMANHÃ | `painel` | `atencao` | `destaque`, quadradinho `atencao` |
| Tag VENCEU ONTEM | `paleta.tons.vermelhoClaro` | `perigo` | `destaque`, quadradinho `perigo` |
| Card de produto | `painel` | `linha` | nome `destaque`, quantidade `texto` |
| Filtro ativo | `destaque` | nenhuma | `sobreDestaque` |
| Filtro inativo | `painel` | `linha` | `texto` |
| Tab bar | `painel` | `linha` (topo) | nenhum |
| Aba ativa | quadrado `destaque` | nenhuma | ícone e rótulo `sobreDestaque` / `destaque` |
| Aba inativa | transparente | nenhuma | `texto` |
| Campo | `painel` ou `fundo` | `linha`; foco `destaque` | `destaque`; placeholder `apagado` |
| Switch ligado | `positivo` | nenhuma | thumb `painel` |
| Slider | trilho `linha`, preenchido `destaque` | nenhuma | thumb `painel` com borda `linha` |
| Checkbox marcado | `positivo` | nenhuma | check `sobreDestaque` |
| Alerta | `painel` | `linha`, barra lateral `destaque` | `texto` |
| Toast | `destaque` | nenhuma | `sobreDestaque` |

Toast e a cor de fundo da tag laranja preenchida ainda não aparecem em nenhuma tela medida; seguem o botão primário e a escolha acima até o Figma definir.

### Tipografia

Família: **JetBrains Mono** (400 regular, 500 médio, 800 extranegrito).

| Papel | Tamanho | Peso | Observação |
|---|---|---|---|
| `destaque` (número do resumo) | conferir na tela 01 | 800 | ex.: o "14" do resumo |
| `display` | 28 | 800 | título de tela |
| `titulo` | 20 | 800 | |
| `corpo` | 13 | 400 | |
| `valor` | 13 | 500 | |
| `corpoForte` | 13 | 800 | título de alerta |
| `legenda` | 11 | 400 | |
| `rotulo` / `botao` | 11 | 500 | MAIÚSCULAS, espaçamento largo |
| `micro` | 9 | 400 | MAIÚSCULAS |

Espaçamento entre letras (px): normal 0,5; largo 1,2; mais largo 2. Entrelinha 140%.
Os tamanhos acima seguem o `design-system.ts`. Se a tela 01 usar outro valor, vale a tela 01.

### Espaçamento, bordas e toque

| Token | Valor |
|---|---|
| `espacos` | xs 4, sm 8, md 12, lg 16, xl 24, xxl 36 |
| `bordas.largura` | 1 |
| `bordas.acento` | 3 (barra lateral de alerta e item selecionado) |
| `raios` | 0 (não arredondar) |
| `toque.minimo` | 44 |

### Proposta de `sources/tema.ts`

```ts
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

export const tamanhos = { micro: 9, legenda: 11, corpo: 13, titulo: 20, display: 28 } as const;
export const espacamentoLetras = { normal: 0.5, largo: 1.2, maisLargo: 2 } as const;
export const espacos = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 36 } as const;
export const bordas = { largura: 1, acento: 3 } as const;
export const raios = { nenhum: 0 } as const;
export const toque = { minimo: 44 } as const;
```

## 3. Migração do `tema.ts` atual

| Hoje | Novo |
|---|---|
| `fundo #F1F3EE` | `fundo #FFFFFF` |
| `superficie #FFFFFF` | `painel #F6F3EA` (com borda `linha`) |
| `texto #17202B` | `destaque #0A0A0A` |
| `textoSecundario #69727A` | `texto #4A4437` |
| `textoInverso #FFFFFF` | `sobreDestaque #FFFFFF` |
| `borda #DCE1DA` | `linha #D9D2BE` |
| `positivo #1F7A4D` | `positivo #2F6B3A` |
| `positivoClaro`, `perigoClaro` | removidos (tags e botões viram contorno) |
| `atencao #F2B705` | `atencao #8F6A1E` (o amarelo não passa em contraste como texto/borda) |
| `perigo #D63F2A` | `perigo #A63A2B` |
| `fontes.*` Schibsted e `carimbo` DotGothic16 | `fontes` JetBrains Mono |
| `raios.*` | `raios.nenhum = 0` (remover o uso de raio nos componentes) |
| `tamanhos` 12/13/14/16/18/30/46 | 9/11/13/20/28 |
| `espacos.xl 20`, `xxl 24` | `xl 24`, `xxl 36` (revisar quem usa `xl`) |

Pacote da fonte: `npx expo install @expo-google-fonts/jetbrains-mono` (avisar o grupo antes de mexer no `package.json`).

## 4. Componentes

Todos em `sources/components/`, props tipadas com `type`, um mestre por componente no Figma (seção "Componentes").

| Componente | Descrição |
|---|---|
| `Botao` | 4 estilos. `primario`: fundo `destaque`, texto `sobreDestaque`. `positivo`: fundo `positivo`. `contorno`: fundo `fundo`, borda 1px `destaque`. `perigo`: fundo `fundo`, borda e texto `perigo`. Altura 52, texto `botao` em MAIÚSCULAS ou caixa normal conforme a tela 01. |
| `TagValidade` | contorno 1px + texto MAIÚSCULAS. `ok` (positivo): "Faltam N dias". `atencao`: "Vence amanhã" / "Vence em N dias". `vencido` (perigo): "Venceu ontem". |
| `Filtro` | ativo: fundo `destaque`, texto `sobreDestaque`. Inativo: fundo `painel`, borda `linha`. |
| `ThumbProduto` | quadrado 52 (card) ou maior (detalhe). Placeholder: borda `linha`, ícone neutro de pacote. Com foto: imagem do produto ou a que o cliente anexou. Substitui os ícones de categoria. |
| `CardProduto` | fundo `painel`, borda `linha`. `ThumbProduto` + nome + quantidade à esquerda, `VAL dd/mm` + `TagValidade` à direita. |
| `CampoQuantidade` | `[ − ] [ campo numérico ] [ + ]`. O usuário digita a quantidade e pode usar − e + como atalho. Substitui o `Contador`. Altura mínima 44. |
| `TabBar` | 4 abas: Home, Despensa, Lista, Ajustes. Fundo `painel`, borda superior `linha`. Aba ativa: quadrado `destaque` com ícone `sobreDestaque`. Rótulos em MAIÚSCULAS. |
| `LinhaAjuste` | texto + `Switch`, valor, slider ou horário. Divisória `linha`. |
| `Alerta` | fundo `painel`, borda `linha`, barra lateral de 3px `destaque`. |
| `Campo` | altura mínima 44, borda `linha`; foco: borda `destaque`. |
| `Switch` | quadrado (sem pílula). Ligado: `positivo`. |
| `Slider` | trilho `linha`, parte preenchida `destaque`, thumb quadrado. |
| `Checkbox` | quadrado 24. Marcado: fundo `positivo` + check `sobreDestaque`. |
| `EstadoVazio` | frase direta + ação, no mesmo estilo (despensa, lista e busca vazias). |

## 5. Telas e navegação

Fluxo: `BoasVindas` → `Tour` (só na primeira vez) → `Abas`.
Abas: **Home**, **Despensa** (com Detalhe), **Lista**, **Ajustes**. Modais: `Escanear` → `ConfirmarProduto`.

| Tela | Conteúdo |
|---|---|
| 01 Boas-vindas | referência visual de todo o app |
| Tour (nova) | 3 a 4 passos descrevendo cada função: Home, Despensa, Escanear, Lista, Ajustes. Botão "Começar" leva à Home |
| Home (nova, aba) | dashboard: resumo do mês (usados a tempo e jogados fora, barra de aproveitamento), alerta "N itens vencem esta semana", atalhos (Escanear, Ver lista, Ir ao mercado) |
| Despensa | busca, filtros, lista de `CardProduto`, botão Adicionar |
| Detalhe do produto | `ThumbProduto`, validade, `CampoQuantidade`, aviso, repor na lista, ações |
| Escanear (modal) | claro; visor com cantos e etiqueta com borda de 1px |
| Confirmar produto (modal) | resultado da API, `CampoQuantidade`, validade, aviso, repor na lista, foto opcional |
| Lista de compras | grupos Acabou em casa, Adicionados por você, No carrinho |
| Ajustes (antes "Perfil e ajustes") | conta, avisos, preferências, dados, sobre. **Sem dashboard** |
| Notificação | claro, cards com borda de 1px |

## 6. Pendências

- **Paleta final:** as cores acima são provisórias. Trocar os valores quando a paleta adicionada ao Figma for confirmada (os nomes dos tokens não mudam).
- **Abas:** Home, Despensa, Lista, Ajustes é a ordem assumida. Confirmar.
- **Alerta "N itens vencem":** fica só na Home ou também na Despensa? Hoje está nas duas intenções.
- **Rota "Perfil":** renomear para "Ajustes" mexe nas rotas tipadas (`routes/tipos.ts`). O `AGENTS.md` diz para não renomear rotas, então precisa de acordo do grupo.
- **Foto do produto:** anexar foto exige `expo-image-picker` (muda o `package.json`, avisar o grupo).
- **Figma:** o restyle cobre componentes e telas 01, 02, 03, 05, 06 e 07. Faltam as telas 04 e 08 (claras), a Home, o Tour e a troca de Perfil por Ajustes.
