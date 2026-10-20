/* Intro "a folha de flash": a moldura da folha se desenha em preto grosso, o nome é contornado e o preto sólido
   preenche letra a letra (blackwork); uma camada ocre desliza para fora e vira a sombra deslocada do letreiro old
   school; dois brilhos estalam; o preto sobe de baixo e leva a folha embora.
   Não há logo oficial em vetor: o nome usa a Alfa Slab One, a mesma fonte dos títulos do site, convertida em paths
   (assim a intro não espera a fonte carregar). Trocar por vetor oficial quando existir.
   Infraestrutura igual à do site do Mano Deyvid: decisão no <head>, cobertura CSS com failsafe, dois rAF antes de
   tocar, fim natural + duas travas, pular por Esc/Tab/Enter/rolagem/roda/toque/clique/aba oculta, uma vez por sessão.
   Roteiro de tempos: bloco "INTRO" no fim de css/style.css. */
(function () {
  'use strict';
  var raiz = document.documentElement;
  if (!raiz.classList.contains('intro-ativa')) return;

  var DURACAO = 2700;   // fim da coreografia (ms): o preto começa a subir
  var COBRE = 300;      // o preto cobre a folha; depois a cortina sobe e o hero entra (--rise-start)
  var SAIDA = 750;      // cobrir + subir
  var CHAVE = 'modelo-blackwork-intro';
  var overlay = null, feito = false, timers = [];

  // Alfa Slab One, corpo 100: [viewBox, [d da letra, ...]]
  var PALAVRAS = [["-0.6 -81.2 278.4 84.6",["M76.6 -77.8L76.6 -53.6L59.4 -53.6L59.4 -61.4L53 -61.4L53 -16.4L60 -16.4L60 0L18 0L18 -16.4L25 -16.4L25 -61.4L18.6 -61.4L18.6 -53.6L1.4 -53.6L1.4 -77.8L76.6 -77.8Z","M118 0L80 0L80 -16.4L85 -16.4L85 -61.4L80 -61.4L80 -77.8L118 -77.8L118 -61.4L113 -61.4L113 -16.4L118 -16.4L118 0Z","M196.6 -77.8L196.6 -53.6L179.4 -53.6L179.4 -61.4L173 -61.4L173 -16.4L180 -16.4L180 0L138 0L138 -16.4L145 -16.4L145 -61.4L138.6 -61.4L138.6 -53.6L121.4 -53.6L121.4 -77.8L196.6 -77.8Z","M237.6 1.4Q219.3 1.4 209.4 -8.2Q199.4 -17.8 199.4 -38.9L199.4 -38.9Q199.4 -60 209.4 -69.6Q219.3 -79.2 237.6 -79.2L237.6 -79.2Q255.9 -79.2 265.9 -69.6Q275.8 -60 275.8 -38.9L275.8 -38.9Q275.8 -17.8 265.9 -8.2Q255.9 1.4 237.6 1.4L237.6 1.4ZM237.6 -16.4Q241 -16.4 242.7 -18.2Q244.4 -20 244.4 -23.8L244.4 -23.8L244.4 -54Q244.4 -57.8 242.7 -59.6Q241 -61.4 237.6 -61.4L237.6 -61.4Q234.2 -61.4 232.5 -59.6Q230.8 -57.8 230.8 -54L230.8 -54L230.8 -23.8Q230.8 -19.9 232.5 -18.2Q234.2 -16.4 237.6 -16.4L237.6 -16.4Z"]],["0 -79.8 444.6 81.8",["M48.1 0L2 0L2 -16.4L7 -16.4L7 -61.4L2 -61.4L2 -77.8L61.8 -77.8L61.8 -51.9L44.1 -51.9L44.1 -61.4L35 -61.4L35 -44.8L50.1 -44.8L50.1 -33.4L35 -33.4L35 -16.4L48.1 -16.4L48.1 0Z","M132.7 0L65.2 0L65.2 -16.4L70.2 -16.4L70.2 -61.4L65.2 -61.4L65.2 -77.8L132.7 -77.8L132.7 -47.6L110.3 -47.6L110.3 -61.4L98.2 -61.4L98.2 -45.6L107 -45.6L107 -34.2L98.2 -34.2L98.2 -16.4L110.3 -16.4L110.3 -32.2L132.7 -32.2L132.7 0Z","M136.5 0L136.5 -16.4L141.5 -16.4L141.5 -61.4L136.5 -61.4L136.5 -77.8L182.4 -77.8Q195.3 -77.8 202.1 -72.5Q208.9 -67.2 208.9 -55.3L208.9 -55.3Q208.9 -48.6 206.2 -43.7Q203.5 -38.8 198.5 -36.9L198.5 -36.9L198.6 -35.9Q208.2 -34.4 208.2 -24.1L208.2 -24.1L208.2 -16.4L212.9 -16.4L212.9 0L181.2 0L181.2 -23.5Q181.2 -27.4 180.1 -29.4Q178.9 -31.4 176.5 -32.1Q174 -32.8 169.5 -32.8L169.5 -32.8L169.5 -16.4L176.1 -16.4L176.1 0L136.5 0ZM169.5 -45L174.9 -45Q177.8 -45 179.3 -46.6Q180.7 -48.1 180.7 -51.4L180.7 -51.4L180.7 -55Q180.7 -58.3 179.3 -59.8Q177.8 -61.4 174.9 -61.4L174.9 -61.4L169.5 -61.4L169.5 -45Z","M216.5 0L216.5 -16.4L221.5 -16.4L221.5 -61.4L216.5 -61.4L216.5 -77.8L262.4 -77.8Q275.3 -77.8 282.1 -72.5Q288.9 -67.2 288.9 -55.3L288.9 -55.3Q288.9 -48.6 286.2 -43.7Q283.5 -38.8 278.5 -36.9L278.5 -36.9L278.6 -35.9Q288.2 -34.4 288.2 -24.1L288.2 -24.1L288.2 -16.4L292.9 -16.4L292.9 0L261.2 0L261.2 -23.5Q261.2 -27.4 260.1 -29.4Q258.9 -31.4 256.5 -32.1Q254 -32.8 249.5 -32.8L249.5 -32.8L249.5 -16.4L256.1 -16.4L256.1 0L216.5 0ZM249.5 -45L254.9 -45Q257.8 -45 259.3 -46.6Q260.7 -48.1 260.7 -51.4L260.7 -51.4L260.7 -55Q260.7 -58.3 259.3 -59.8Q257.8 -61.4 254.9 -61.4L254.9 -61.4L249.5 -61.4L249.5 -45Z","M353 -77.8L369.9 -16.4L373.9 -16.4L373.9 0L334.7 0L334.7 -16.4L340.7 -16.4L339.1 -24.4L325.5 -24.4L323.9 -16.4L329.9 -16.4L329.9 0L295.7 0L295.7 -16.4L299.7 -16.4L316.6 -77.8L353 -77.8ZM331.8 -54.9L327.7 -35L336.9 -35L332.8 -54.9L331.8 -54.9Z","M422.7 -16.4L422.7 -24.6L442.6 -24.6L442.6 0L376.5 0L376.5 -14.4L407.3 -61.4L396.9 -61.4L396.9 -53.2L377 -53.2L377 -77.8L441 -77.8L441 -63.4L410.3 -16.4L422.7 -16.4Z"]]];
  var BRILHO = '<path d="M12 0C13 8 16 11 24 12C16 13 13 16 12 24C11 16 8 13 0 12C8 11 11 8 12 0Z"/>';

  function libera() {
    raiz.classList.remove('intro-ativa', 'intro-saindo');
    raiz.style.removeProperty('--rise-start');
  }
  function limpa() {
    timers.forEach(clearTimeout);
    document.removeEventListener('keydown', aoTeclar, true);
    document.removeEventListener('visibilitychange', aoOcultar);
    document.removeEventListener('wheel', aoGesto, true);
    document.removeEventListener('touchstart', aoGesto, true);
    document.removeEventListener('pointerdown', aoGesto, true);
    window.removeEventListener('scroll', aoGesto);
  }
  function termina(natural) {
    if (feito) return;
    feito = true;
    limpa();
    try { sessionStorage.setItem(CHAVE, '1'); } catch (e) { /* storage bloqueado */ }
    if (natural) { raiz.classList.add('intro-saindo'); raiz.classList.remove('intro-ativa'); } else libera();
    if (!overlay) return;
    overlay.classList.add(natural ? 'mi-saindo' : 'mi-pulada');
    if (!natural) overlay.style.cssText = 'opacity:0;transition:opacity .25s';
    // continua capturando cliques até sair do DOM
    setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, natural ? SAIDA + 40 : 300);
    if (natural) setTimeout(libera, SAIDA + 2200);   // depois da última entrada do hero (tinta da folha, --rise-start + 2,2 s)
  }
  var ROLAGEM = { ' ': 1, PageDown: 1, PageUp: 1, ArrowDown: 1, ArrowUp: 1, End: 1, Home: 1 };
  function aoTeclar(e) {
    if (ROLAGEM[e.key]) { e.preventDefault(); termina(false); }
    else if (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Enter') termina(false);
  }
  function aoOcultar() { if (document.hidden) termina(false); }
  function aoGesto(e) {
    if (e.type === 'pointerdown' && e.pointerType === 'touch') return;
    if (e.cancelable && (e.type === 'wheel' || e.type === 'touchstart')) e.preventDefault();
    termina(false);
  }

  function palco() {
    if (!PALAVRAS.length) throw new Error('vetores do nome ausentes');
    var i = 0;
    var palavras = PALAVRAS.map(function (p) {
      var vb = p[0].split(' ');
      var traco = '', tinta = '', sombra = '';
      p[1].forEach(function (d) {
        // cada contorno da letra é traçado em paralelo, todos no mesmo tempo (pathLength=1)
        d.split(/(?=M)/).forEach(function (c) { traco += '<path class="mi-traco" pathLength="1" style="--i:' + i + '" d="' + c + '"/>'; });
        tinta += '<path class="mi-letra" style="--i:' + i + '" d="' + d + '"/>';
        sombra += '<path d="' + d + '"/>';
        i++;
      });
      return '<svg class="mi-palavra" viewBox="' + p[0] + '" style="--vw:' + vb[2] + ';--vh:' + vb[3] + '" aria-hidden="true" focusable="false">' +
        '<g class="mi-sombra">' + sombra + '</g><g class="mi-tinta">' + tinta + '</g><g class="mi-stencil">' + traco + '</g></svg>';
    }).join('');
    return '<div class="mi-palco">' +
      '<span class="mi-moldura-sombra"></span>' +
      '<i class="mi-borda mi-borda--t"></i><i class="mi-borda mi-borda--r"></i><i class="mi-borda mi-borda--b"></i><i class="mi-borda mi-borda--l"></i>' +
      '<p class="mi-num">Nº 01</p>' +
      '<div class="mi-nome">' + palavras + '</div>' +
      '<p class="mi-papel">Blackwork &amp; Old School</p>' +
      '<svg class="mi-brilho mi-brilho--a" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + BRILHO + '</svg>' +
      '<svg class="mi-brilho mi-brilho--b" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + BRILHO + '</svg>' +
      '</div>';
  }

  try {
    if (performance.now() > 3000 || window.pageYOffset > 4) throw new Error('chegou tarde');
    overlay = document.createElement('div');
    overlay.className = 'mi-intro';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = palco();
    document.body.appendChild(overlay);

    document.addEventListener('keydown', aoTeclar, true);
    document.addEventListener('visibilitychange', aoOcultar);
    document.addEventListener('wheel', aoGesto, { capture: true, passive: false });
    document.addEventListener('touchstart', aoGesto, { capture: true, passive: false });
    document.addEventListener('pointerdown', aoGesto, true);
    window.addEventListener('scroll', aoGesto, { passive: true });

    var toca = function () {
      if (feito || overlay.classList.contains('mi-tocando')) return;
      overlay.classList.add('mi-tocando');
      // o site entra quando a cortina preta começa a subir, contando do relógio real da página
      raiz.style.setProperty('--rise-start', ((performance.now() + DURACAO + COBRE) / 1000).toFixed(2) + 's');
      timers.push(setTimeout(function () { termina(true); }, DURACAO));
    };
    requestAnimationFrame(function () { requestAnimationFrame(toca); });
    timers.push(setTimeout(toca, 250));                                                         // aba sem rAF
    timers.push(setTimeout(function () { if (!overlay.classList.contains('mi-tocando')) termina(false); }, 1500));
    timers.push(setTimeout(function () { termina(false); }, DURACAO + 2000));
  } catch (erro) {
    termina(false);
  }
})();
