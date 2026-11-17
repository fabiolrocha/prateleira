# Prateleira

Aplicativo móvel para acompanhar a validade dos produtos da despensa. O usuário cadastra os produtos lendo o código de barras ou digitando os dados, e recebe uma notificação antes de cada produto vencer. Os dados ficam salvos no próprio aparelho, sem conta e sem servidor.

## O que o app faz

- **Boas-vindas e tour**: pede o nome do usuário e a permissão de notificações. Depois mostra um tour de 4 passos, que pode ser pulado.
- **Home**: resumo do mês (itens usados a tempo e jogados fora, com barra de aproveitamento), alerta de itens que vencem na semana e atalhos para escanear e para a lista de compras.
- **Despensa**: lista de produtos ordenada pela validade, com selo de situação (em dia, atenção, vencido), busca por nome e filtros Todos, Vencendo e Vencidos.
- **Detalhe do produto**: foto, Nutri-Score (quando a API informa), validade, quantidade editável, opção de repor na lista ao acabar e as ações Consumi, Joguei fora e Pôr na lista.
- **Escanear**: lê código de barras EAN-13, EAN-8, UPC-A e UPC-E pela câmera, com lanterna. Também permite digitar o código ou adicionar um produto sem código.
- **Confirmar produto**: consulta o código no Open Food Facts e preenche nome e foto. Se o produto não for encontrado, ou se não houver código, o usuário digita o nome e pode anexar uma foto da galeria. Define validade, quantidade, dias de antecedência do aviso e reposição na lista.
- **Lista de compras**: itens agrupados em "Acabou em casa" (entram sozinhos quando um produto acaba), "Adicionados por você" e "No carrinho". O checkbox move o item para o carrinho e de volta.
- **Ajustes**: nome e data de início de uso, liga e desliga os avisos de validade, antecedência padrão (1 a 7 dias), horário do aviso e botão para testar a notificação.
- **Avisos de validade**: notificação local agendada para cada produto. Tocar na notificação abre o detalhe do produto.
- **Histórico de consumo**: cada produto consumido ou jogado fora é registrado em SQLite e alimenta o resumo do mês na Home.

## Tecnologias

- Expo SDK 58, React Native 0.88, React 19.3 e TypeScript
- React Navigation (native stack e bottom tabs)
- AsyncStorage para os dados do app e as preferências
- expo-sqlite para o histórico de consumo
- expo-notifications para os avisos de validade
- expo-camera para a leitura do código de barras
- expo-image-picker para anexar foto ao produto
- API pública do [Open Food Facts](https://world.openfoodfacts.org) para buscar os dados do produto

## Como rodar

### Requisitos

- [Node.js](https://nodejs.org) na versão LTS
- npm (vem com o Node.js)
- Git
- O app Expo Go no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) ou [iOS](https://apps.apple.com/app/expo-go/id982107779)), ou um emulador Android

### Passos

```bash
git clone https://github.com/fabiolrocha/prateleira.git
cd prateleira
npm install
npx expo start
```

O terminal mostra um QR code.

- **No celular**: abra o Expo Go e leia o QR code (no iPhone, use a câmera do aparelho).
- **No emulador Android**: com o emulador aberto, pressione `a` no terminal.

O celular e o computador precisam estar na mesma rede Wi-Fi. Se o Expo Go não conectar, rode com túnel:

```bash
npx expo start --tunnel
```

## Como testar (QA)

Quando o app pedir, dê permissão de câmera e de notificações. Sem elas não é possível testar a leitura do código de barras e os avisos.

### Roteiro

1. Abra o app, digite um nome em Boas-vindas e toque em "Começar". Aceite a permissão de notificações.
2. Passe pelos 4 passos do tour até "Começar". Confira se o app abre na Home.
3. Vá até a Despensa e toque em "Adicionar". Leia o código de barras de um produto. Se não tiver câmera, toque em "Digitar código" e informe o número que aparece abaixo das barras.
4. Em Confirmar produto, confira o nome e a foto vindos do Open Food Facts. Escolha a validade e toque em "Salvar na despensa".
5. Toque de novo em "Adicionar" e depois em "Adicionar sem código". Digite um nome, escolha a validade e salve.
6. Na Despensa, confira os dois produtos, a ordem pela validade, a busca e os filtros.
7. Abra um produto. Mude a quantidade, ligue "Repor na lista ao acabar" e teste os botões Consumi, Joguei fora (pede confirmação) e Pôr na lista.
8. Abra a Lista de compras. Confira se os itens aparecem no grupo certo, adicione um item manual e marque o checkbox para mover para o carrinho.
9. Volte para a Home e confira o resumo do mês e o alerta de itens que vencem na semana.
10. Em Ajustes, mude a antecedência padrão e o horário do aviso, desligue e ligue os avisos e toque em "Testar notificação". A notificação deve chegar em cerca de 5 segundos.

Dica: códigos de barras de produtos comuns de mercado têm mais chance de estar no Open Food Facts. Quando o produto não é encontrado, o app deve deixar você digitar o nome e cadastrar mesmo assim.

### Como relatar um problema

Abra uma issue na aba [Issues](https://github.com/fabiolrocha/prateleira/issues) com o título `[QA] Tela - resumo` (exemplo: `[QA] Despensa - filtro Vencidos mostra produto no prazo`) e informe:

- tela
- passos para reproduzir
- resultado esperado
- resultado obtido
- aparelho e sistema (exemplo: Moto G84, Android 14)
- print ou gravação da tela

## Estrutura de pastas

```
sources/
├── components/   componentes visuais reaproveitados (botão, campo, card, selo, toast)
├── contexts/     estado global com Context API (usuário, ajustes, despensa, lista, toast)
├── models/       classes de domínio (ItemBase, Produto, ItemCompra)
├── routes/       navegadores (stack raiz, abas, stack da Despensa) e tipos das rotas
├── screens/      telas do app
├── services/     armazenamento, histórico em SQLite, notificações e Open Food Facts
└── utils/        funções de apoio para datas e estilos
```

## Fluxo de trabalho

O repositório segue Git Flow:

- `main`: versão entregue, marcada com tag (`v1.0.0`).
- `develop`: integração das partes.
- `feature/*`, `docs/*`, `bugfix/*`: cada mudança é feita em uma branch própria a partir de `develop`.

Cada branch entra em `develop` por pull request revisado. Quando `develop` está estável, abre-se um pull request de `develop` para `main`. Todos os merges usam "Create a merge commit", para o histórico mostrar as branches.

Mensagens de commit seguem o padrão `tipo: o que foi feito`, em português (`feat`, `fix`, `style`, `refactor`, `docs`, `chore`).

## Equipe

- Fábio ([fabiolrocha](https://github.com/fabiolrocha))
- Gustavo ([orbssexp](https://github.com/orbssexp))
- Caio ([CaiozinAlves](https://github.com/CaiozinAlves))
- Arthur ([10simoes](https://github.com/10simoes))

## Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE).
