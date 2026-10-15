# Prompt — agente de intro animada e movimento para o site do Mano Deyvid

Cole tudo abaixo como primeira mensagem de uma nova sessão do Claude Code aberta em `C:/Users/ODIN03/orca/mano-deyvid`.

---

Você vai trabalhar no site do **Mano Deyvid** (tatuador), em `C:/Users/ODIN03/orca/mano-deyvid`. É um site estático em HTML, CSS e JavaScript puro (`index.html`, `css/style.css`, `js/main.js`, fotos em `assets/images/`), versionado em https://github.com/Walter-Maia/mano-deyvid (branch `main`). Responda sempre em português do Brasil, de forma breve, e me dê notícias curtas do que está fazendo enquanto trabalha.

## O que eu quero

1. **Intro animada** que abre o site, criada a partir da identidade visual do Deyvid (logo, assinatura, cores, padrões, fotos do trabalho). Procure os arquivos da marca no repositório e em `C:/Users/ODIN03/orca/mano-deyvid` (PDF, SVG, PNG, AI). Se não houver logo ou identidade em vetor, **pare e me pergunte onde estão** antes de inventar uma marca. Nunca redesenhe o logo: use o vetor oficial.
2. **Animações e efeitos visuais em todo o site**, para deixá-lo mais interessante e dinâmico: parallax, efeitos de rolagem, títulos que sobem por linha, traços que se desenham, fotos que abrem em cortina, faixas que andam com a rolagem, tudo no clima de tatuagem (tinta, traço, stencil, agulha, black & grey) e coerente com a marca dele.
3. **Responsivo em qualquer resolução**, do celular dobrável (280 px) ao monitor QHD (2560 px), web e mobile.
4. Manter os textos, os links e os dados que já existem. Não invente prêmios, números, depoimentos, preços ou contatos. Se faltar algo, deixe marcado e me avise.

## Como trabalhar (o que funcionou no site da Dra. Lizziara)

O mesmo trabalho já foi feito em `C:/Users/ODIN03/orca/site-lizziara`. **Leia esse projeto antes de começar** e use-o como referência de padrão e de código:
- `assets/js/intro.js` e o bloco "Intro" no fim de `assets/css/style.css`;
- `assets/js/main.js`, com os efeitos de rolagem;
- `README.md`, seção "Identidade e movimento";
- `verification/ferramentas/`, com os scripts de extração e de QA.

Copie e adapte esses scripts; não os edite no projeto da Lizziara.

### Regras de movimento (inegociáveis)

- Sem JavaScript, todo o conteúdo aparece no estado final. O estado "sem classe" de cada elemento é o final; o JS só arma o estado inicial.
- Com `prefers-reduced-motion: reduce`, nada se move, nada fica escondido e não há intro.
- O que já está na tela ao carregar não é escondido.
- **Os efeitos se repetem**: cada bloco volta ao estado inicial quando sai inteiro da tela e toca de novo quando volta, rolando para baixo **e** para cima. Eu prefiro assim. Use um único IntersectionObserver com limiares de 0 a 1 e arme só quando o bloco sai por completo.
- Tudo que acompanha a rolagem anda só por `transform`/`translate`/`rotate`/`scale` (compositor). Use um único `requestAnimationFrame` por quadro: leia todas as posições antes de escrever, só para as camadas perto da tela (IntersectionObserver com `rootMargin`).
- Use as propriedades individuais (`translate`, `scale`, `rotate`) para a entrada e `transform` para o hover, para uma não anular a outra.
- Nada de animação em loop infinito que comece sozinha (risco WCAG 2.2.2, e eu não quero botão de pausa). Prefira movimento ligado à rolagem.
- Em listas com rolagem lateral (carrossel), revele o grupo inteiro, senão o cartão cortado na borda fica invisível e some a dica de que dá para deslizar.
- Não use eyebrow em caixa alta com bolinha antes: eu vetei por ter "cara de I.A.".

### Infraestrutura da intro (igual à da Lizziara e da Liga ForDoctor)

- Um script inline no `<head>`, depois do CSS, decide se a intro toca e adiciona `intro-ativa` no `<html>`. Ela não toca:
  - com movimento reduzido;
  - com âncora na URL;
  - com a página já rolada;
  - se já foi vista na sessão (`sessionStorage`).
- `?intro=1` força a intro e `?intro=0` desliga.
- `html.intro-ativa::before` cobre a página na cor da marca até o JS montar a intro. Tem um failsafe CSS que some sozinho em cerca de 4,8 s.
- `intro.js` carrega com `defer`, e o `onerror` remove a classe se o arquivo falhar. A intro começa depois de dois `requestAnimationFrame` e tem um fim natural mais duas travas (não começou em 1,5 s; passou da duração + 2 s).
- A pessoa pula a intro com Esc, Tab, Enter, rolagem, roda, toque ou clique. Pular também vale para a sessão.
- O hero entra quando a intro sai, usando `--rise-start` nos `animation-delay`.
- Duração total de no máximo cerca de 3,5 s. Escreva o roteiro de tempos comentado no CSS.

### Extrair os vetores da marca

- Não há Python nem poppler na máquina. Para PDF, use o pacote npm `mupdf` numa pasta temporária:
  - `toPixmap` para ver as páginas como PNG;
  - `DocumentWriter(buffer, 'svg', 'text=path')` para obter os paths.
- Meça as caixas no Edge headless e achate os `transform` nos dados do path, para os degradês `userSpaceOnUse` funcionarem.
- Cuidado: a regra global `svg{stroke:currentColor}` vaza para SVG aninhado e para o conteúdo de `<pattern>`. Zere o `stroke` nesses contêineres.
- Para um logo ou assinatura que "se escreve", use uma máscara com linhas centrais traçadas por você (`stroke-dasharray: 1` com `pathLength="1"`) sobre o vetor oficial preenchido.

## Ambiente (Windows)

- **Node:** use `C:/Users/ODIN03/AppData/Local/nvm/v24.6.0/node.exe` (o node do PATH é v14).
- **Edge headless:** `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`.
- **ffmpeg:** está no PATH. O filtro `drawtext` precisa de `fontfile`: copie `C:/Windows/Fonts/arial.ttf` para a pasta temporária e rode com `cwd` nela.
- **Lighthouse:** está no cache do npx (`%LOCALAPPDATA%/npm-cache/_npx/*/node_modules/lighthouse/cli/index.js`), com `CHROME_PATH` apontando para o Edge.
- **Heredoc no Bash:** converte `\\` em `\`. Escreva scripts com a ferramenta Write/Edit, não por heredoc.
- **Máquina carregada:** outros agentes e servidores rodam ao mesmo tempo, e o Edge pode demorar a abrir. Então:
  - Use portas próprias: servidor local entre **4300 e 4399**; depuração do Edge entre **9900 e 9999**. As faixas 4180–4199 e 9300–9900 são da Lizziara.
  - Faça o `launch` tentar de novo em outra porta e os scripts terminarem com `process.exit`.
  - Ao limpar processos travados, encerre só os seus: identifique pelo nome do seu perfil temporário do Edge (ex.: `deyvid-qa-edge-`). Nunca mate processos de outros projetos.
  - Rode o teste de desempenho com nada mais rodando. Registre a carga da CPU junto com os números, porque com a máquina ocupada eles variam.

## QA (com evidências, antes de me entregar)

Guarde scripts, capturas e vídeos numa pasta `verification/`. Adicione essa pasta ao `.gitignore`: o GitHub Pages publicaria tudo. Repare também na linha estranha `{css,js,assets/` do `.gitignore` atual e me diga o que ela faz. Teste no servidor local, não em `file://`.

1. **Responsividade em 18 telas:** 280×653@3, 320×568@2, 360×740@3, 375×667@2, 390×844@3, 414×896@2, 430×932@3, 844×390@3, 768×1024@2, 820×1180@2, 1024×768@2, 1180×820@2, 1280×800, 1366×768, 1440×900, 1600×900, 1920×1080 e 2560×1440. Em cada uma, verifique:
   - sem rolagem lateral;
   - nenhum texto cortado ou mais largo que a tela;
   - alvos de toque com pelo menos 24 px (relate os menores que 44);
   - sem palavra sozinha na última linha de títulos e botões (`text-wrap: pretty` nos H2 com `<br>`, `balance` nos curtos);
   - CTA visível na primeira tela;
   - imagens nítidas para a densidade da tela (meça a largura real do arquivo; com `srcset`, `naturalWidth` engana);
   - fontes carregadas e nenhuma imagem quebrada;
   - nenhum bloco preso escondido depois de rolar até ele;
   - nenhum erro de console;
   - captura da página inteira no estado final: com movimento reduzido, estique a janela até a altura da página, sem `captureBeyondViewport`.

   Confira telas muito largas: `calc((100vw - 1200px)/2)` dentro de um contêiner com largura máxima esmaga colunas em 2560 px.
2. **Intro:**
   - toca e limpa o estado;
   - não repete na sessão;
   - toca na primeira visita;
   - Esc, Tab (o foco vai para o primeiro item) e roda pulam;
   - não toca com movimento reduzido, com âncora, sem JS ou com `intro.js` bloqueado.

   Grave um vídeo da intro em 1440 e 390 (screencast do CDP + ffmpeg) e monte uma folha de quadros.
3. **Movimento:**
   - o hero entra e assenta;
   - os blocos tocam, armam ao sair e tocam de novo vindo de baixo e de cima;
   - as camadas de parallax mudam com a rolagem;
   - com movimento reduzido: zero animações rodando, nada armado, nada deslocado.
4. **Funcional:** menu, foco preso no menu do celular, Esc, links, carrossel/galeria, formulário ou WhatsApp, um único H1, IDs únicos, `alt` nas imagens e SVG decorativo com `aria-hidden`.
5. **Desempenho:**
   - Compare a versão original (`git archive HEAD` numa subpasta de `verification/`) com a nova.
   - CPU 4× mais lenta, gesto de rolagem real (`Input.synthesizeScrollGesture`) descendo e subindo.
   - Meça com `yDistance` = `scrollHeight − innerHeight` logo antes; se pedir mais do que a página tem, o gesto nunca termina.
   - Registre a thread principal em ms por segundo e os quadros acima de 34 ms.
   - Rode também o Lighthouse mobile nas duas versões.
6. Compare o texto visível antes e depois e confirme que só mudou o que você quis mudar.

Corrija o que os testes encontrarem e rode de novo. Quando um teste falhar por defeito do próprio teste, diga isso e corrija o teste.

## Entrega

- **Não faça commit nem push** sem eu pedir. Não publique nada nem rode deploy.
- Ao terminar, me mande um resumo curto:
  - o que mudou e por quê;
  - como é a intro (roteiro em segundos);
  - a lista de efeitos;
  - os resultados dos testes com números, original × novo;
  - os ajustes feitos durante o QA;
  - limitações: não testado no Safari (iOS e macOS), no Firefox, em aparelhos físicos nem com leitor de tela;
  - o que depende de decisão minha.
- Atualize o `README.md` do projeto (crie um, se não existir) com a seção "Identidade e movimento" e como rever a intro (`?intro=1`).
- Antes de começar a implementar, faça uma auditoria rápida:
  - leia o código e os assets;
  - capture o site atual em 390 e 1440;
  - liste os problemas que encontrou.

  Depois siga direto para a implementação, sem esperar aprovação, a não ser que falte a identidade visual.
