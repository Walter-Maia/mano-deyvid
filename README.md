# Mano Deyvid — Tattoo Artist

Site estático (HTML, CSS e JavaScript puro, sem dependências) do tatuador Mano Deyvid.

## Abrir

Abra `index.html` no navegador ou sirva a pasta do projeto com qualquer servidor estático, por exemplo:

```powershell
npx serve . -l 4300
```

A intro toca uma vez por sessão. **Para revê-la, abra a página com `?intro=1`** (por exemplo, http://127.0.0.1:4300/?intro=1). `?intro=0` desliga a intro.

## Arquivos

- `index.html`: conteúdo, links, metadados e SVGs decorativos (desenhos flash, telefone, pincelada).
- `css/style.css`: identidade, responsividade (280 a 2560 px), o bloco **MOVIMENTO** (efeitos de rolagem) e o bloco **INTRO** com o roteiro de tempos comentado.
- `js/intro.js`: intro "o stencil", uma vez por sessão.
- `js/main.js`: menu, estilos, FAQ, navegação, cursor, movimento ligado à rolagem e efeitos que se repetem.
- `assets/favicon.svg`: "MD" na Pirata One (a mesma marca de texto do cabeçalho).
- `assets/images/`: as fotos do site. `mano-personagem.jpg` (a ilustração) saiu da página a pedido e não é mais carregada; o arquivo continua na pasta.
- `backup/` (fora do git): cópia do `index.html`, `style.css` e `main.js` anteriores às animações. Para voltar, copie os três arquivos para o lugar original ou use `git checkout 573c656 -- index.html css js`.
- `modelos/`: quatro modelos de site feitos a partir deste (ver "Modelos de site" abaixo), a página que mostra todos e as capturas dela (`modelos/capas/`).
- `verification/` (fora do git): scripts de QA, capturas, vídeos e relatórios.

## Modelos de site (`modelos/`)

Quatro modelos de site para tatuadores e estúdios, feitos a partir deste site. A página `modelos/index.html` mostra todos (no GitHub Pages: `/modelos/`).

| Modelo | Pasta | Para quem | Intro |
|---|---|---|---|
| Lia Monteiro — Fine Line | `modelos/fine-line/` | tatuadora de traço fino, floral e botânico; tema claro, fotos em arco | "o traço fino": o nome é contornado a lápis e um raminho se desenha |
| Tito Ferraz — Blackwork & Old School | `modelos/blackwork/` | tatuador de preto sólido e tradicional; folha de flash, seção "Flash da semana" | "a folha de flash": contorno, preto sólido e sombra ocre deslocada |
| Casa Nanquim — Estúdio de Tatuagem | `modelos/estudio/` | estúdio com vários artistas; equipe, biossegurança, como chegar | "a gota de nanquim": a gota se espalha pela tela e o nome aparece dentro dela |
| Íris Valença — Realismo colorido | `modelos/realismo/` | tatuadora de realismo; galeria com etiquetas de museu, "Como nasce um realismo" | "camadas de cor": três chapas de cor convergem no nome |

- **Base comum:**
  - Cada pasta funciona sozinha, com caminhos relativos, e pode ser copiada para um cliente.
  - Todas usam a mesma base deste site: intro uma vez por sessão (`?intro=1` força e `?intro=0` desliga), efeitos de rolagem que se repetem, movimento reduzido respeitado e layout de 280 a 2560 px.
- **Conteúdo de exemplo:**
  - Os nomes são fictícios.
  - Os contatos são genéricos: `https://wa.me/` e `https://www.instagram.com/`, e também `https://maps.google.com/` no estúdio.
  - Não há depoimentos, números, prêmios nem preços.
  - O topo do `<body>` de cada `index.html` traz um comentário `[PREENCHER]` com o que trocar.
  - O rodapé diz que é um site modelo.
- **Fotos:**
  - Por enquanto, cada espaço de foto mostra uma moldura "Sua foto aqui" (`assets/images/*.svg`) com a proporção e o tamanho mínimo.
  - O `imagens.json` de cada modelo lista os espaços, com o texto alternativo e o prompt para gerar a foto. São 56 fotos ao todo (fine line 11, blackwork 18, estúdio 16, realismo 11), cerca de 14 créditos no GPT Image 2.5 do Higgsfield.
  - Para trocar uma moldura, salve a foto como `.jpg` com o mesmo nome dela e rode `node verification/ferramentas/modelos/troca-fotos.js modelos/<modelo>` (ferramenta local, fora do git).

## Identidade e movimento

**Base da identidade.** Não há logo nem assinatura em vetor no projeto. A intro e o favicon usam o que o site já tinha: o nome "Mano Deyvid" e o "MD" na Pirata One (fonte dos títulos), convertidos em paths a partir do arquivo da fonte, sem redesenho e sem criar marca nova. Cores: preto `#090909`, osso `#efe6e2`, carmim `#a51440` / `#8f1538` / `#741027`. Quando existir um logo oficial em vetor, ele substitui o nome em `js/intro.js` e o favicon.

**Intro "o stencil"** (`js/intro.js`, roteiro no fim de `css/style.css`). Fundo preto da marca, com a foto do Deyvid em sessão aparecendo ao fundo.

| Tempo | O que acontece |
|---|---|
| 0,00–0,55 s | A agulha passa e deixa uma linha carmim. |
| 0,15–1,53 s | O nome é decalcado em traço carmim, como o stencil transferido para a pele, letra a letra. |
| 0,95–1,94 s | A tinta (osso) preenche as letras. |
| 1,75–2,15 s | O stencil desliza por baixo e fica fora de registro, como impressão serigráfica. |
| 1,95–2,45 s | "Tattoo Artist" aparece. |
| 2,75–3,50 s | A cortina sobe e o hero entra. |

- Toca uma vez por sessão.
- Pula com Esc, Tab, Enter, rolagem, roda, toque ou clique, e pular também conta para a sessão.
- Não toca com movimento reduzido, com âncora na URL, com a página já rolada, sem JavaScript ou se `intro.js` não carregar. A cobertura preta some sozinha em 4,8 s, em qualquer caso.

**Efeitos** (todos se repetem: o bloco volta ao estado inicial quando sai inteiro da tela e toca de novo na volta, rolando para baixo ou para cima):

- **Hero:** a foto abre em cortina carmim e assenta; o título sobe linha a linha; a pincelada se desenha sob "fiéis." (a mesma do balão da ilustração); a linha da agulha se desenha no rodapé do hero. Com a rolagem, a foto desce mais devagar que a página.
- **Títulos H2:** sobem palavra a palavra, linha por linha. Em "pele.", "tattoo?" e "Bora tatuar?" a pincelada se desenha depois.
- **Galeria:**
  - No desktop, a faixa de trabalhos anda para o lado enquanto a página desce (presa na tela), com os cartões em alturas alternadas. As setas do teclado também andam a faixa.
  - No celular, a galeria usa rolagem lateral nativa, e o grupo inteiro aparece junto.
- **Faixa de estilos:** duas linhas andam com a rolagem em sentidos opostos, uma cheia e outra em contorno (stencil). Antes era um letreiro em loop infinito.
- **Estilos:** a lista sobe em sequência, a foto abre em cortina e a moldura carmim anda na diagonal com a rolagem.
- **Manifesto e CTA final:** os desenhos flash (caveira, estrela, raio, rosa) se desenham e andam em velocidades e giros próprios.
- **About:** a foto abre em cortina e anda dentro da moldura.
- **Motivos:** cada número nasce como stencil (só contorno) e recebe a tinta, e o filete carmim cresce.
- **Processo:** a linha da agulha cresce enquanto os passos atravessam a tela e acende cada número.
- **Contato:** o telefone flash se desenha. No hover ele toca três vezes e para (antes balançava sem parar).

**Regras:**
- Sem JavaScript, tudo aparece no estado final.
- Com `prefers-reduced-motion`, nada se move, nada fica escondido e não há intro.
- O que já está na tela ao carregar não é escondido.
- Não há animação em loop infinito.
- Tudo que acompanha a rolagem anda por `transform` e só nas seções perto da tela (IntersectionObserver com `rootMargin`). No Chrome e no Edge isso é feito por CSS, com linhas do tempo de rolagem (`animation-timeline`), no compositor, sem JavaScript por quadro. Nos navegadores sem esse recurso, um único `requestAnimationFrame` por quadro faz o mesmo, lendo todas as posições antes de escrever.
- A entrada usa `translate`/`scale`; o hover e o parallax usam `transform`.

O GSAP (cerca de 110 KB por CDN) saiu: tudo é CSS e JavaScript próprio.

## Verificação (15/10/2026)

Testes no Edge headless com servidor local (scripts em `verification/ferramentas/`, fora do git). Sem Safari, Firefox, aparelhos físicos ou leitor de tela.

- **Responsividade, 18 telas de 280 a 2560 px:**
  - sem rolagem lateral e sem texto cortado ou mais largo que a tela;
  - nenhuma palavra sozinha em títulos e botões;
  - CTA na primeira tela, fontes carregadas e nenhum bloco preso escondido;
  - alvos de toque: no celular e no tablet, todos com 44 px ou mais; no desktop, os links da barra inferior têm 32–34 px (uso com mouse);
  - fotos: nítidas em telas 1×, menos `processo-freehand.jpg` no recorte 3:4 dos estilos; em telas 2× e 3× ficam moles por causa do tamanho dos arquivos.
- **Intro:** 10 de 10. Toca e limpa o estado, não repete na sessão, toca na primeira visita, Esc, Tab e roda pulam, e não toca com movimento reduzido, com âncora, sem JS ou com `intro.js` bloqueado. Vídeos e folhas de quadros em `verification/intro/`.
- **Movimento:** 12 de 12 em 1440 e em 390, inclusive "com movimento reduzido nada roda, nada fica armado e nada fica deslocado".
- **Funcional:** 12 de 12. Menu, foco preso no menu do celular, Esc, links (7 de WhatsApp e 3 de Instagram, iguais aos originais), galeria, FAQ, estilos, um único H1, IDs únicos, `alt` nas imagens e SVG decorativo oculto.
- **Texto visível:** igual ao original, a não ser pelas mudanças combinadas (dados do About em texto simples, eyebrow do hero sem caixa alta forçada, faixa decorativa repetida e a ilustração removida do CTA final). Links e metadados idênticos.
- **Lighthouse mobile:**

| Versão | Desempenho | Acessib. | Boas práticas | SEO | LCP |
|---|---|---|---|---|---|
| Original | 83 | 96 | 96 | 100 | 3,3 s |
| Novo, com intro | 95 | 96 | 100 | 100 | 2,5 s |
| Novo, sem intro | 87 | 96 | 100 | 100 | 3,3 s |

- **Rolagem real com a CPU 4× mais lenta**, descendo e subindo a página inteira, com outros processos ocupando a máquina (carga anotada em cada rodada nos JSON de `verification/desempenho/`):
  - **Script:** caiu de 48–61 para 17–25 ms/s.
  - **Thread principal:** subiu de 444–602 para 611–733 ms/s.
  - **Quadros acima de 34 ms:**
    - no celular, 1–2% no novo contra 0,3–0,9% no original (uma rodada do novo deu 13%, com a CPU a 90%);
    - no desktop, 10–15% no novo contra 1–7% no original.
  - **Com movimento reduzido**, as duas versões custam o mesmo (390: 208 × 224 ms/s; 1440: 395 × 374 ms/s). A diferença vem dos efeitos, que agora são mais numerosos e se repetem na volta.

## Pendências — [PREENCHER]

1. **Logo oficial em vetor** (SVG, PDF ou AI), se existir: hoje a intro e o favicon usam o nome em Pirata One.
2. **Fotos em resolução maior.** Os arquivos atuais têm 416 a 674 px de largura e ficam moles em telas 2× e 3× (celulares e Macs). O ideal são originais com pelo menos 1200 px no lado maior.
3. **`og:image` com URL absoluta**, quando o domínio estiver definido (hoje é relativa e não funciona na pré-visualização do WhatsApp e do Instagram).
4. **Numeração das seções:** "[ — Por quê ]" é a única sem número (01–07 nas demais). O texto foi mantido como estava.
5. **"Artista premiado"** aparece sem citar o prêmio. O texto foi mantido; vale confirmar qual é, ou se é para continuar assim.
6. **Contraste do carmim nas seções escuras.** `#a51440` sobre o preto dá 2,56:1 (o mínimo é 4,5:1 para texto pequeno e 3:1 para títulos). Já era assim no site original. Corrigir pede um tom mais claro do carmim só sobre fundo escuro, por exemplo `#d1204f` nos títulos (3,7:1) e `#e8406c` nos rótulos pequenos (5:1).
