/* Intro "camadas de cor": como na impressão em quatro cores, a imagem nasce de chapas separadas. O nome é desenhado em
   contorno; três cópias (ciano, magenta, amarelo) chegam de direções diferentes, fora de registro, e convergem; somadas
   em "screen" viram quase branco, e o branco gelo assenta por cima.
   O nome usa a Anton, a mesma fonte dos títulos do site, convertida em paths (a intro não espera a fonte carregar).
   Trocar por um logo em vetor quando existir.
   Infraestrutura igual à do site base: decisão no <head>, cobertura CSS com failsafe, dois rAF antes de tocar, fim
   natural + duas travas, pular por Esc/Tab/Enter/rolagem/roda/toque/clique/aba oculta, uma vez por sessão.
   Roteiro de tempos: bloco "INTRO" no fim de css/style.css. */
(function () {
  'use strict';
  var raiz = document.documentElement;
  if (!raiz.classList.contains('intro-ativa')) return;

  var DURACAO = 2750;   // fim da coreografia (ms); igual ao --rise-start do CSS
  var SAIDA = 750;      // a cortina sobe
  var CHAVE = 'modelo-realismo-intro';
  var overlay = null, feito = false, timers = [];

  // Anton, corpo 100, em caixa alta: [viewBox, [d da letra, ...]]. As duas palavras dividem a mesma faixa vertical
  // (do acento do Í à cedilha do Ç), para que as linhas de base fiquem alinhadas lado a lado.
  var PALAVRAS = [["-2.3 -112.1 141.5 144.9",["M19.6 0L3 0L3 -85.9L19.6 -85.9L19.6 0ZM22.9 -93.1L-0.3 -88.5L-0.3 -99.4L22.9 -110.1L22.9 -93.1Z","M43.8 0L26.5 0L26.5 -85.9L52.8 -85.9Q59.4 -85.9 62.8 -82.9Q66.2 -79.9 67.3 -74.5Q68.5 -69.1 68.5 -61.9L68.5 -61.9Q68.5 -54.8 66.7 -50.6Q64.9 -46.4 60 -44.8L60 -44.8Q64 -44 65.6 -40.8Q67.3 -37.6 67.3 -32.5L67.3 -32.5L67.3 0L50.3 0L50.3 -33.6Q50.3 -37.4 48.8 -38.3Q47.3 -39.2 43.8 -39.2L43.8 -39.2L43.8 0ZM43.9 -70L43.9 -54.1L48.1 -54.1Q51.7 -54.1 51.7 -61.9L51.7 -61.9Q51.7 -66.9 50.9 -68.5Q50.1 -70 47.9 -70L47.9 -70L43.9 -70Z","M89.9 0L73.3 0L73.3 -85.9L89.9 -85.9L89.9 0Z","M117.2 0.8L117.2 0.8Q105.4 0.8 100.2 -5.1Q95 -10.9 95 -23.7L95 -23.7L95 -32.1L112 -32.1L112 -21.4Q112 -18.4 112.9 -16.7Q113.8 -15 116.1 -15L116.1 -15Q118.4 -15 119.3 -16.4Q120.2 -17.8 120.2 -20.9L120.2 -20.9Q120.2 -24.9 119.4 -27.5Q118.7 -30.2 116.7 -32.6Q114.8 -35 111.4 -38.2L111.4 -38.2L103.7 -45.6Q95 -53.7 95 -64.2L95 -64.2Q95 -75.2 100.1 -81Q105.2 -86.7 114.9 -86.7L114.9 -86.7Q126.7 -86.7 131.7 -80.4Q136.6 -74.1 136.6 -61.3L136.6 -61.3L119.1 -61.3L119.1 -67.2Q119.1 -68.9 118.1 -69.9Q117.1 -70.9 115.4 -70.9L115.4 -70.9Q113.4 -70.9 112.4 -69.8Q111.5 -68.6 111.5 -66.8L111.5 -66.8Q111.5 -65 112.5 -62.9Q113.4 -60.8 116.3 -58.1L116.3 -58.1L126.2 -48.5Q129.2 -45.7 131.7 -42.6Q134.2 -39.4 135.7 -35.2Q137.2 -31.1 137.2 -25L137.2 -25Q137.2 -12.9 132.7 -6.1Q128.3 0.8 117.2 0.8Z"]],["-0.9 -112.1 321.5 144.9",["M35.2 0L11.7 0L1.1 -86L17.5 -86L23.8 -27.5L29.4 -86L45.8 -86L35.2 0Z","M63 0L46.3 0L54.6 -85.9L83.8 -85.9L91.9 0L75.7 0L74.5 -13.9L64.1 -13.9L63 0ZM68.6 -71.3L65.3 -27.6L73.1 -27.6L69.4 -71.3L68.6 -71.3Z","M132.1 0L97.2 0L97.2 -85.9L114.4 -85.9L114.4 -14.6L132.1 -14.6L132.1 0Z","M172.5 0L137 0L137 -85.9L171.3 -85.9L171.3 -69.3L154.4 -69.3L154.4 -52.6L170.7 -52.6L170.7 -36.4L154.4 -36.4L154.4 -16.7L172.5 -16.7L172.5 0Z","M194.9 0L178.1 0L178.1 -85.9L195.8 -85.9L203.7 -44.8L203.7 -85.9L220.3 -85.9L220.3 0L203.5 0L194.9 -43L194.9 0Z","M247.9 0.8L247.9 0.8Q238.6 0.8 232.9 -5Q227.2 -10.8 227.2 -21.3L227.2 -21.3L227.2 -60.9Q227.2 -73.4 232.2 -80.1Q237.2 -86.7 248.3 -86.7L248.3 -86.7Q254.4 -86.7 259.2 -84.5Q264 -82.2 266.7 -77.8Q269.4 -73.3 269.4 -66.5L269.4 -66.5L269.4 -51.7L252.3 -51.7L252.3 -64.4Q252.3 -68.2 251.4 -69.6Q250.4 -70.9 248.3 -70.9L248.3 -70.9Q245.9 -70.9 245.1 -69.2Q244.3 -67.4 244.3 -64.6L244.3 -64.6L244.3 -21.5Q244.3 -18 245.3 -16.5Q246.4 -15 248.3 -15L248.3 -15Q250.5 -15 251.4 -16.8Q252.3 -18.7 252.3 -21.5L252.3 -21.5L252.3 -37L269.6 -37L269.6 -20.8Q269.6 -9.4 263.9 -4.3Q258.2 0.8 247.9 0.8ZM246.7 30.8L246.7 30.8Q241.7 30.8 237.1 28.9L237.1 28.9L237.1 18Q238.6 18.5 240 18.8Q241.5 19.1 242.8 19.1L242.8 19.1Q245.3 19.1 246.9 17.8Q248.5 16.5 248.5 13.3L248.5 13.3Q248.5 10.6 247.2 7.1Q245.8 3.6 243.5 0L243.5 0L251.3 0Q256.1 4.2 258.7 9.3Q261.3 14.4 261.3 18.9L261.3 18.9Q261.3 23.9 257.8 27.4Q254.3 30.8 246.7 30.8Z","M289.7 0L273 0L281.3 -85.9L310.4 -85.9L318.6 0L302.3 0L301.1 -13.9L290.8 -13.9L289.7 0ZM295.3 -71.3L292 -27.6L299.8 -27.6L296 -71.3L295.3 -71.3Z"]]];

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
    if (natural) setTimeout(libera, SAIDA + 1600);
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
    var palavras = PALAVRAS.map(function (p, n) {
      var vb = p[0].split(' ');
      var traco = '', letras = '';
      p[1].forEach(function (d) {
        // cada contorno da letra é desenhado em paralelo, todos no mesmo tempo (pathLength=1)
        d.split(/(?=M)/).forEach(function (c) { traco += '<path class="mi-traco" pathLength="1" style="--i:' + i + '" d="' + c + '"/>'; });
        letras += '<path style="--i:' + i + '" d="' + d + '"/>';
        i++;
      });
      // as três chapas usam as mesmas letras; o branco gelo é a última camada
      var chapa = function (cor) { return '<g class="mi-sep mi-sep--' + cor + '" style="--p:' + n + '">' + letras + '</g>'; };
      return '<svg class="mi-palavra" viewBox="' + p[0] + '" style="--vw:' + vb[2] + ';--vh:' + vb[3] + '" aria-hidden="true" focusable="false">' +
        '<g class="mi-contorno">' + traco + '</g>' + chapa('c') + chapa('m') + chapa('y') +
        '<g class="mi-tinta">' + letras.replace(/<path /g, '<path class="mi-letra" ') + '</g></svg>';
    }).join('');
    return '<div class="mi-palco"><div class="mi-nome">' + palavras + '</div>' +
      '<span class="mi-agulha"></span><p class="mi-papel">Realismo colorido</p></div>';
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
      // o site entra quando a cortina começa a subir, contando do relógio real da página
      raiz.style.setProperty('--rise-start', ((performance.now() + DURACAO) / 1000).toFixed(2) + 's');
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
