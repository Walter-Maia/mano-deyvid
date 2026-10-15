/* Intro "o stencil": a agulha passa, o nome é decalcado em traço vermelho como um stencil na pele, a tinta preenche
   letra a letra e o stencil fica deslocado, como impressão fora de registro. Ao fundo, a foto do Deyvid em sessão.
   Não há logo oficial em vetor: o nome usa a Pirata One, a mesma fonte dos títulos do site, convertida em paths
   (assim a intro não espera a fonte carregar). Trocar por vetor oficial quando existir.
   Infraestrutura igual à da Lizziara e da Liga ForDoctor: decisão no <head>, cobertura CSS com failsafe, dois rAF
   antes de tocar, fim natural + duas travas, pular por Esc/Tab/Enter/rolagem/roda/toque/clique/aba oculta,
   uma vez por sessão. Roteiro de tempos: bloco "Intro" no fim de css/style.css. */
(function () {
  'use strict';
  var raiz = document.documentElement;
  if (!raiz.classList.contains('intro-ativa')) return;

  var DURACAO = 2750;   // fim da coreografia (ms); igual ao --rise-start do CSS
  var SAIDA = 750;      // a cortina sobe
  var overlay = null, feito = false, timers = [];

  // Pirata One, corpo 100: [viewBox, [d da letra, ...]]
  var PALAVRAS = [["-3 -79.1 191.1 84.3",["M5 -10.2L5 -10.2L5 -60.7Q5 -64 3.6 -66.4Q2.2 -68.8 0.1 -68.8L0.1 -68.8L0.1 -71Q0.8 -71.1 11 -77.1L11 -77.1Q11.7 -76.9 12.7 -76.5Q13.7 -76.2 15.4 -74.6Q17 -73 17 -70.9L17 -70.9Q17.6 -71.2 20.4 -72.8L20.4 -72.8Q27.8 -77 29.6 -77Q31.3 -77 33.5 -75.2Q35.6 -73.4 36.7 -70.9L36.7 -70.9Q36.9 -71 40.8 -73L40.8 -73Q48.6 -77 50.2 -77L50.2 -77Q53.4 -77 56.2 -72.8Q59 -68.6 59 -65.1L59 -65.1L59 -14.8Q59 -9.3 63.9 -8.3L63.9 -8.3L63.9 -6.1L53 0Q50.8 -0.9 48.9 -2.9Q47 -5 47 -6.8L47 -6.8L47 -55.8Q47 -61.8 45.1 -64.1Q43.1 -66.5 38 -66.7L38 -66.7L38 -14.8Q38 -9.3 42.9 -8.3L42.9 -8.3L42.9 -6.1L32 0Q29.8 -0.9 27.9 -2.9Q26 -5 26 -6.8L26 -6.8L26 -55.8Q26 -62.1 24.2 -64.4Q22.3 -66.7 17 -66.7L17 -66.7L17 -15.4Q17 -11.7 17.8 -10.1Q18.6 -8.5 21.1 -8.5L21.1 -8.5L21.1 -5.4L0.6 3.2L-1 0Q1.2 0 3.2 -2.6L3.2 -2.6Q5 -5.1 5 -10.2Z","M100 -43.8L100 -43.8L100 -15.5Q100 -11.8 101.2 -10.4Q102.4 -8.9 104.9 -8.3L104.9 -8.3L104.9 -6.1L94 0Q91.8 -0.9 89.9 -2.9Q88 -5 88 -6.7L88 -6.7L75.5 0Q75.2 -0.2 74.6 -0.5Q74 -0.9 72.6 -2.1Q71.1 -3.2 70 -4.5L70 -4.5Q67 -7.8 67 -12L67 -12L67 -28.4Q67 -30 72.2 -32.5Q77.4 -35 82.6 -36.6L82.6 -36.6L87.9 -38.3Q87.9 -44 84.9 -46.2Q81.9 -48.5 73.3 -48.5L73.3 -48.5L73.3 -51.5Q88.8 -57 90.7 -57L90.7 -57Q94 -57 97 -52.7Q100 -48.4 100 -43.8ZM79 -15.6Q79 -13 80.6 -11.4Q82.1 -9.7 84 -9.7Q85.9 -9.7 88 -11.2L88 -11.2L88 -33.8Q85.5 -32.9 84.3 -32.3Q83 -31.7 81.6 -30.4L81.6 -30.4Q79 -28 79 -22.1L79 -22.1L79 -15.6Z","M110 -6.8L110 -6.8L110 -40.7Q110 -44 108.6 -46.4Q107.2 -48.8 105.1 -48.8L105.1 -48.8L105.1 -51Q105.8 -51.1 116 -57.1L116 -57.1Q116.7 -56.9 117.7 -56.5Q118.7 -56.2 120.4 -54.6Q122 -53 122 -50.9L122 -50.9Q122.6 -51.2 125.4 -52.8L125.4 -52.8Q132.8 -57 134.2 -57L134.2 -57Q137.4 -57 140.2 -52.8Q143 -48.6 143 -45.1L143 -45.1L143 -14.8Q143 -9.3 147.9 -8.3L147.9 -8.3L147.9 -6.1L137 0Q134.8 -0.9 132.9 -2.9Q131 -5 131 -6.8L131 -6.8L131 -35.8Q131 -41.4 129.8 -44.3Q128.5 -47.3 125.3 -47.3L125.3 -47.3L122 -46.7L122 -14.8Q122 -8.7 126.1 -7.9L126.1 -7.9L126.1 -5.7L116 0Q113.8 -0.9 111.9 -2.9Q110 -5 110 -6.8Z","M153 -14.6L153 -14.6L153 -47.8Q153 -48.5 164.4 -52.7Q175.8 -57 177.5 -57Q179.2 -57 182.7 -52.9Q186.1 -48.8 186.1 -45.5L186.1 -45.5L186.1 -9.3Q186.1 -8.5 175.2 -4.2Q164.2 0 161.8 0Q159.3 0 156.2 -4.3Q153 -8.6 153 -14.6ZM170.1 -9.2L170.1 -9.2Q172 -9.2 174 -10.8L174 -10.8L174 -40.3Q174 -47.7 168.9 -47.7L168.9 -47.7Q166.9 -47.7 165 -46.2L165 -46.2L165 -16.6Q165 -9.2 170.1 -9.2Z"]],["-1.1 -81 239.7 101",["M38.1 -65.5L38.1 -65.5L38.1 -9.3Q38.1 -8.5 27.2 -4.2Q16.2 0 13.8 0Q11.3 0 8.2 -4.3Q5 -8.6 5 -14.6L5 -14.6L5 -62.6Q5 -68 0.9 -68.9L0.9 -68.9L0.9 -71.1L11 -76.8Q13.2 -75.9 15.1 -73.9Q17 -71.8 17 -70L17 -70L29.4 -77Q31.2 -77 34.7 -72.9Q38.1 -68.8 38.1 -65.5ZM22.1 -9.2L22.1 -9.2Q24 -9.2 26 -10.8L26 -10.8L26 -58Q26 -65.1 20.9 -65.1L20.9 -65.1Q18.9 -65.1 17 -63.6L17 -63.6L17 -16.6Q17 -9.2 22.1 -9.2Z","M72.6 -57L72.6 -57Q73.1 -57 75.1 -55.4Q77.1 -53.9 79.1 -51.2Q81.1 -48.4 81.1 -45.8L81.1 -45.8L81.1 -29Q81.1 -27.2 75.8 -24.6Q70.5 -22 65.6 -20.3Q60.6 -18.7 60.2 -18.7L60.2 -18.7Q60.2 -11 66.9 -9.2L66.9 -9.2Q70.2 -8.4 74.8 -8.4L74.8 -8.4L74.8 -5.5Q58.4 0 57.3 0L57.3 0Q54.3 0 51.2 -4.2Q48.1 -8.5 48.1 -14.2L48.1 -14.2L48.1 -47.8Q48.1 -48.5 59.5 -52.7Q70.9 -57 72.6 -57ZM69.1 -41.1Q69.1 -43.9 67.8 -45.8Q66.5 -47.8 64.5 -47.8Q62.5 -47.8 60.1 -46.3L60.1 -46.3L60.1 -23.2Q69.1 -25.7 69.1 -34L69.1 -34L69.1 -41.1Z","M123.7 -50.3L123.7 -50.3L123.7 -10.6Q123.7 -6.8 120.3 0.3Q116.9 7.3 113.1 12.7Q109.3 18 107.9 18L107.9 18Q105.4 18 101.2 16.5Q97 15 94 13.5L94 13.5L91.1 12L91.1 9L94.5 9Q98.4 9 103.4 4.6Q108.4 0.1 111.7 -7.3L111.7 -7.3Q100.4 -2 98.7 -2L98.7 -2Q95.6 -2 93.1 -5.9Q90.7 -9.9 90.7 -14.8L90.7 -14.8L90.7 -42.3Q90.7 -47.8 85.8 -48.8L85.8 -48.8L85.8 -51L96.7 -57.1Q98.9 -56.2 100.8 -54.1Q102.7 -52.1 102.7 -50.3L102.7 -50.3L102.7 -23.2Q102.7 -16.2 104.9 -13.8Q107.1 -11.5 111.7 -11.5L111.7 -11.5L111.7 -42.3Q111.7 -48.4 107.6 -49.2L107.6 -49.2L107.6 -51.4L117.7 -57.1Q119.9 -56.2 121.8 -54.1Q123.7 -52.1 123.7 -50.3Z","M166.8 -43.3L166.8 -43.3L166.8 -9.3Q166.8 -8.4 156.1 -4.2Q145.4 0 142.3 0Q139.2 0 136.5 -4.7Q133.7 -9.4 133.7 -13L133.7 -13L133.7 -42.3Q133.7 -47.8 128.8 -48.8L128.8 -48.8L128.8 -51L139.7 -57.1Q141.9 -56.2 143.6 -54.3Q145.4 -52.4 145.7 -50.9L145.7 -50.9L157.9 -57Q160.9 -57 163.9 -52.7Q166.8 -48.4 166.8 -43.3ZM145.7 -13.4Q145.7 -10.9 147.1 -9.2Q148.5 -7.5 150.1 -7.5Q151.7 -7.5 154.7 -9L154.7 -9L154.7 -37.3Q154.7 -43.7 152.8 -45.6Q150.9 -47.5 145.7 -47.5L145.7 -47.5L145.7 -13.4Z","M188.7 -50.2L188.7 -50.2L188.7 -14.8Q188.7 -8.7 192.8 -7.9L192.8 -7.9L192.8 -5.7L182.7 0Q180.5 -0.9 178.6 -2.9Q176.7 -5 176.7 -6.8L176.7 -6.8L176.7 -42.2Q176.7 -48.3 172.6 -49.1L172.6 -49.1L172.6 -51.3L182.7 -57Q184.9 -56.1 186.8 -54Q188.7 -52 188.7 -50.2ZM175.2 -69.5L175.2 -69.5L175.2 -75.6Q175.2 -75.9 179.4 -77.4Q183.5 -79 184.1 -79Q184.8 -79 186 -77.3Q187.3 -75.6 187.3 -73.8L187.3 -73.8L187.3 -66.5Q187.3 -66.2 183.3 -64.6Q179.3 -63.1 178.4 -63.1Q177.5 -63.1 176.4 -64.9Q175.2 -66.6 175.2 -69.5Z","M217.5 -77L217.5 -77Q220.2 -77 226 -63.9Q231.8 -50.8 231.8 -45.8L231.8 -45.8L231.8 -15.3Q231.8 -13 233.1 -10.8Q234.3 -8.6 236.6 -8.3L236.6 -8.3L236.6 -6.1Q235.9 -6 225.7 0L225.7 0Q223.4 -1 221.6 -2.9Q219.7 -4.9 219.7 -6.6L219.7 -6.6Q209 0 207.2 0L207.2 0Q206.5 0 204.5 -1.5Q202.6 -3.1 200.6 -6.1Q198.7 -9 198.7 -12.1L198.7 -12.1L198.7 -47.8Q198.7 -48.8 215.6 -54.7L215.6 -54.7Q212 -62.6 209.8 -65.8Q207.6 -69 205.5 -69L205.5 -69L202.2 -69L202.2 -72Q213.3 -77 217.5 -77ZM215.8 -9.2L215.8 -9.2Q217.7 -9.2 219.7 -10.8L219.7 -10.8L219.7 -45.6Q219.7 -46.2 218.9 -48.2Q218 -50.1 217.6 -50.1L217.6 -50.1Q214.7 -50.1 211.7 -48.3L211.7 -48.3L210.7 -47.7L210.7 -16.6Q210.7 -9.2 215.8 -9.2Z"]]];

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
    try { sessionStorage.setItem('deyvid-intro', '1'); } catch (e) { /* storage bloqueado */ }
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
    var palavras = PALAVRAS.map(function (p) {
      var vb = p[0].split(' ');
      var traco = '', tinta = '';
      p[1].forEach(function (d) {
        // cada contorno da letra é decalcado em paralelo, todos no mesmo tempo (pathLength=1)
        d.split(/(?=M)/).forEach(function (c) { traco += '<path class="mi-traco" pathLength="1" style="--i:' + i + '" d="' + c + '"/>'; });
        tinta += '<path class="mi-letra" style="--i:' + i + '" d="' + d + '"/>';
        i++;
      });
      return '<svg class="mi-palavra" viewBox="' + p[0] + '" style="--vw:' + vb[2] + ';--vh:' + vb[3] + '" aria-hidden="true" focusable="false">' +
        '<g class="mi-stencil">' + traco + '</g><g class="mi-tinta">' + tinta + '</g></svg>';
    }).join('');
    return '<div class="mi-foto"><img src="assets/images/mano-trabalhando.jpg" alt="" decoding="async"></div>' +
      '<div class="mi-palco"><div class="mi-nome">' + palavras + '</div>' +
      '<span class="mi-agulha"></span><p class="mi-papel">Tattoo Artist</p></div>';
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
