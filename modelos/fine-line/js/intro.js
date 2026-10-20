/* Intro "o traço fino": a agulha atravessa a folha de papel, o nome é contornado em grafite fino letra a letra, a tinta
   grafite entra suave, um raminho se desenha ao lado e "Fine Line Tattoo" aparece. A cortina de papel sobe e o site entra.
   Não há logo oficial em vetor: o nome usa a Cormorant Garamond itálico, a mesma fonte dos títulos do site, convertida em
   paths (assim a intro não espera a fonte carregar). Trocar por vetor oficial quando existir. [PREENCHER]
   Infraestrutura igual à do site do Mano Deyvid: decisão no <head>, cobertura CSS com failsafe, dois rAF antes de tocar,
   fim natural + duas travas, pular por Esc/Tab/Enter/rolagem/roda/toque/clique/aba oculta, uma vez por sessão.
   Roteiro de tempos: bloco "Intro" no fim de css/style.css. */
(function () {
  'use strict';
  var raiz = document.documentElement;
  if (!raiz.classList.contains('intro-ativa')) return;

  var DURACAO = 2750;   // fim da coreografia (ms); igual ao --rise-start do CSS
  var SAIDA = 750;      // a cortina sobe
  var CHAVE = 'modelo-fine-line-intro';
  var overlay = null, feito = false, timers = [];

  // Cormorant Garamond itálico 500, corpo 100: [viewBox, [d da letra, ...]]
  var PALAVRAS = [["-1 -64.5 119.6 67.8",["M43.2 0L1.3 0Q1 0 1 -0.6Q1 -1.2 1.3 -1.2L1.3 -1.2Q4.3 -1.2 5.9 -1.7Q7.4 -2.2 8.2 -3.7Q8.9 -5.2 9.4 -8.1L9.4 -8.1L17.6 -54.4Q18.4 -58.7 17.3 -60Q16.2 -61.3 11.9 -61.3L11.9 -61.3Q11.7 -61.3 11.7 -61.9Q11.7 -62.5 11.9 -62.5L11.9 -62.5Q14 -62.5 16.6 -62.3Q19.2 -62.2 22.1 -62.2L22.1 -62.2Q25.2 -62.2 28 -62.3Q30.7 -62.5 32.8 -62.5L32.8 -62.5Q33 -62.5 33 -61.9Q33 -61.3 32.8 -61.3L32.8 -61.3Q29.8 -61.3 28.2 -60.7Q26.6 -60.2 25.9 -58.7Q25.2 -57.2 24.6 -54.3L24.6 -54.3L16.5 -8.5Q15.8 -4.4 16.8 -3.2Q17.7 -1.9 21.5 -1.9L21.5 -1.9L29.3 -1.9Q35.6 -1.9 39.8 -5.6Q44 -9.2 47 -15.8L47 -15.8Q47 -16 47.6 -15.9Q48.2 -15.8 48.1 -15.5L48.1 -15.5Q47.3 -12.7 46.4 -8.7Q45.4 -4.8 44.8 -1.5L44.8 -1.5Q44.5 0 43.2 0L43.2 0Z","M60.7 0.9L60.7 0.9Q58 0.9 57.2 -1.3Q56.3 -3.6 57.4 -8.9L57.4 -8.9L61.5 -29.7Q62.6 -35.3 59.8 -35.3L59.8 -35.3Q58.7 -35.3 57 -34.1Q55.3 -33 53.3 -30.9L53.3 -30.9Q53 -30.5 52.6 -30.9Q52.1 -31.4 52.5 -31.7L52.5 -31.7Q56 -35.7 58.8 -37.6Q61.6 -39.5 64.2 -39.5L64.2 -39.5Q67 -39.5 67.8 -37.3Q68.6 -35.1 67.6 -30.2L67.6 -30.2L63.5 -8.9Q62.9 -5.9 63.4 -4.6Q63.9 -3.4 65 -3.4L65 -3.4Q66.1 -3.4 67.8 -4.5Q69.4 -5.7 71.3 -7.6L71.3 -7.6Q71.7 -8 72.1 -7.5Q72.5 -7.1 72.1 -6.8L72.1 -6.8Q68.9 -3 66.2 -1Q63.4 0.9 60.7 0.9ZM67.1 -50.9L67.1 -50.9Q64.9 -50.9 63.7 -52.1Q62.4 -53.3 62.4 -55.6L62.4 -55.6Q62.4 -57.7 63.7 -58.9Q64.9 -60.1 67.1 -60.1L67.1 -60.1Q69.4 -60.1 70.6 -58.9Q71.8 -57.7 71.8 -55.6L71.8 -55.6Q71.8 -50.9 67.1 -50.9Z","M82.7 1.3L82.7 1.3Q79.4 1.3 77.7 -1.1Q75.9 -3.5 76.6 -9.1L76.6 -9.1Q77.4 -14.4 80.1 -19.8Q82.8 -25.2 86.7 -29.8Q90.5 -34.4 94.9 -37.1Q99.3 -39.9 103.3 -39.9L103.3 -39.9Q105.2 -39.9 107.1 -39.2Q109 -38.5 110.4 -36.9Q111.7 -35.4 111.9 -32.8L111.9 -32.8L107.1 -35.7Q108.5 -35.9 110.2 -37.3Q111.9 -38.8 112.7 -40.7L112.7 -40.7Q112.9 -41 113.5 -40.8Q114 -40.7 113.9 -40.5L113.9 -40.5L108.1 -8.9Q107.1 -3.4 109.4 -3.4L109.4 -3.4Q110.5 -3.4 112.2 -4.6Q113.8 -5.8 115.7 -7.7L115.7 -7.7Q116 -8 116.4 -7.6Q116.8 -7.2 116.5 -6.9L116.5 -6.9Q113.3 -3.2 110.6 -1.2Q107.9 0.9 105.3 0.9L105.3 0.9Q102.6 0.9 101.8 -1.3Q101 -3.6 101.9 -8.9L101.9 -8.9L104.3 -22.9L106.1 -24.6Q103.4 -16.8 99.5 -11Q95.5 -5.1 91.2 -1.9Q86.8 1.3 82.7 1.3ZM87.2 -4.4L87.2 -4.4Q89.9 -4.4 92.7 -6.4Q95.5 -8.5 98.1 -11.9Q100.6 -15.3 102.5 -19.3Q104.3 -23.3 105 -26.9L105 -26.9Q105.8 -30.9 104.4 -33.4Q102.9 -36 99.4 -35.9L99.4 -35.9Q96.1 -35.9 92.8 -33.1Q89.5 -30.3 86.9 -25.5Q84.3 -20.8 83.4 -14.7L83.4 -14.7Q82.6 -9.3 83.6 -6.8Q84.6 -4.4 87.2 -4.4Z"]],["-0.7 -64.5 322.7 67.9",["M46.4 0L46.4 0Q46.1 0 46.1 -0.6Q46.1 -1.2 46.4 -1.2L46.4 -1.2Q49.5 -1.2 51.1 -1.7Q52.6 -2.2 53.4 -3.7Q54.1 -5.2 54.5 -8.1L54.5 -8.1L62.1 -58.5L64.6 -61.3L33.2 -0.7Q33 -0.3 32.5 -0.4Q31.9 -0.4 31.7 -0.8L31.7 -0.8L20.5 -54.2Q19.8 -57.4 18.4 -58.9Q17 -60.4 15.5 -60.8Q13.9 -61.3 12.5 -61.3L12.5 -61.3Q12.2 -61.3 12.2 -61.9Q12.2 -62.5 12.5 -62.5L12.5 -62.5Q13.7 -62.5 15.3 -62.4Q16.8 -62.3 18.3 -62.3L18.3 -62.3Q20.2 -62.3 21.7 -62.4Q23.2 -62.5 23.9 -62.5L23.9 -62.5Q25 -62.5 25.7 -61.5Q26.3 -60.5 27 -57.3L27 -57.3L37 -10L32.7 -3.7L61.7 -60Q63.1 -62.5 65.1 -62.5L65.1 -62.5Q65.8 -62.5 67.3 -62.4Q68.8 -62.3 70.1 -62.3L70.1 -62.3Q72.3 -62.3 73.8 -62.4Q75.2 -62.5 76.7 -62.5L76.7 -62.5Q76.9 -62.5 76.9 -61.9Q76.9 -61.3 76.7 -61.3L76.7 -61.3Q73.1 -61.3 71.1 -60Q69 -58.8 68.4 -54.6L68.4 -54.6L61.5 -8.1Q60.9 -3.8 62 -2.5Q63 -1.2 67.3 -1.2L67.3 -1.2Q67.6 -1.2 67.6 -0.6Q67.6 0 67.3 0L67.3 0Q65.3 0 62.6 -0.1Q59.9 -0.2 56.9 -0.2L56.9 -0.2Q53.8 -0.2 51.2 -0.1Q48.6 0 46.4 0ZM1.6 0L1.6 0Q1.3 0 1.3 -0.6Q1.3 -1.2 1.6 -1.2L1.6 -1.2Q5.1 -1.2 7.3 -3.7Q9.5 -6.2 10.5 -11.4L10.5 -11.4L19.5 -60.2L21.5 -60L12.8 -11.6Q11.9 -6.3 13.1 -3.7Q14.2 -1.2 17.7 -1.2L17.7 -1.2Q18 -1.2 18 -0.6Q18 0 17.7 0L17.7 0Q16 0 14.1 -0.1Q12.1 -0.2 9.6 -0.2L9.6 -0.2Q7.5 -0.2 5.5 -0.1Q3.5 0 1.6 0Z","M89 1.4L89 1.4Q84 1.4 80.9 -1.4Q77.7 -4.2 76.7 -8.9Q75.6 -13.6 76.6 -19.3L76.6 -19.3Q77.8 -25.2 80.9 -29.8Q84 -34.5 88.5 -37.2Q92.9 -39.9 98 -39.9L98 -39.9Q103.3 -39.9 106.5 -37.1Q109.7 -34.3 110.8 -29.6Q111.8 -24.9 110.7 -19.3L110.7 -19.3Q109.4 -12.8 106 -8.1Q102.6 -3.5 98.1 -1Q93.6 1.4 89 1.4ZM92.5 -1.1L92.5 -1.1Q96.3 -1.1 99.4 -4.7Q102.5 -8.4 103.7 -14.9L103.7 -14.9Q104.4 -18.9 104.3 -22.8Q104.1 -26.8 103 -30.1Q101.9 -33.5 99.9 -35.5Q97.9 -37.5 94.9 -37.5L94.9 -37.5Q91.2 -37.5 88.1 -33.9Q84.9 -30.3 83.6 -23.6L83.6 -23.6Q82.8 -19.5 83 -15.5Q83.2 -11.6 84.4 -8.3Q85.5 -5 87.6 -3.1Q89.6 -1.1 92.5 -1.1Z","M147.3 0.9L147.3 0.9Q144.5 0.9 143.8 -1.4Q143.1 -3.7 144 -8.9L144 -8.9L146.9 -24.8Q149.1 -35.5 143.6 -35.5L143.6 -35.5Q140.5 -35.5 137.1 -31.4Q133.7 -27.4 130.7 -19.7Q127.7 -12 125.7 -0.9L125.7 -0.9L124.3 -1Q126.4 -12.7 129.9 -21.5Q133.3 -30.2 137.9 -35.1Q142.4 -39.9 147.4 -39.9L147.4 -39.9Q151.7 -39.9 153.2 -36.8Q154.7 -33.7 153.4 -26.7L153.4 -26.7L150.1 -8.9Q149.6 -5.9 150.1 -4.6Q150.6 -3.4 151.7 -3.4L151.7 -3.4Q152.8 -3.4 154.4 -4.6Q155.9 -5.8 157.9 -7.7L157.9 -7.7Q158.2 -8.1 158.6 -7.7Q159 -7.3 158.7 -6.9L158.7 -6.9Q155.5 -3.2 152.8 -1.2Q150.1 0.9 147.3 0.9ZM121.8 0.8L121.8 0.8Q120.2 0.8 119.7 0.6Q119.1 0.4 119.1 0.1L119.1 0.1Q119.1 -0.2 119.7 -2.5Q120.2 -4.8 120.6 -7.4L120.6 -7.4L124.7 -29.7Q125.7 -35.3 123.1 -35.3L123.1 -35.3Q122 -35.3 120.3 -34.1Q118.6 -33 116.5 -30.9L116.5 -30.9Q116.2 -30.5 115.8 -30.9Q115.4 -31.4 115.7 -31.7L115.7 -31.7Q119.2 -35.7 122.1 -37.6Q124.9 -39.5 127.6 -39.5L127.6 -39.5Q130.3 -39.5 131 -37.3Q131.8 -35.1 130.9 -30.2L130.9 -30.2L125.7 -0.9Q125.4 0.8 121.8 0.8Z","M172.7 1.2L172.7 1.2Q170.6 1.2 168.8 0.5Q166.9 -0.3 166 -2.3Q165.1 -4.3 165.7 -8L165.7 -8L169.9 -30.6Q170.6 -34.2 170 -35.1Q169.4 -36 166.5 -36L166.5 -36Q166.1 -36 166.2 -36.7Q166.3 -37.4 166.6 -37.4L166.6 -37.4Q170.5 -37.4 173.2 -39.7Q175.8 -42.1 177 -45.4L177 -45.4Q177.1 -45.8 178 -45.7Q178.8 -45.6 178.7 -45.3L178.7 -45.3L172.5 -10.6Q171.8 -6.7 173 -4.9Q174.1 -3.1 177.2 -3.1L177.2 -3.1Q179.8 -3.1 182.1 -4.3Q184.3 -5.5 186.5 -7.3L186.5 -7.3Q186.7 -7.5 187.1 -7.1Q187.5 -6.7 187.3 -6.5L187.3 -6.5Q182.7 -2.4 179.3 -0.6Q175.8 1.2 172.7 1.2ZM187.3 -34L187.3 -34Q187.1 -34 185.2 -34.3Q183.2 -34.6 180.6 -34.8Q177.9 -35.1 175.4 -35.1L175.4 -35.1L175.6 -37.6Q178.4 -37.6 181.4 -37.8Q184.3 -38 186.7 -38.2Q189 -38.4 189.9 -38.4L189.9 -38.4Q190.3 -38.4 190.5 -38.1Q190.7 -37.8 190.6 -37.4L190.6 -37.4Q190.4 -36.6 189.4 -35.3Q188.4 -34 187.3 -34Z","M205.8 1.2L205.8 1.2Q200.3 1.2 197.2 -1.6Q194.1 -4.4 193.2 -8.9Q192.2 -13.4 193.1 -18.5L193.1 -18.5Q193.8 -22.3 195.9 -26.1Q198 -29.9 201.1 -33Q204.2 -36.1 208.1 -38Q212 -39.9 216.4 -39.9L216.4 -39.9Q220.2 -39.9 222.1 -38.4Q223.9 -37 223.6 -34.5L223.6 -34.5Q223.2 -32.1 220.9 -29.8Q218.5 -27.5 214.8 -25.7Q211.1 -23.9 206.5 -22.6Q201.9 -21.3 197.1 -20.8L197.1 -20.8L197.3 -22.1Q204.8 -23.2 209.9 -25.6Q215 -28.1 215.8 -32.4L215.8 -32.4Q216.4 -34.9 215.1 -36.1Q213.7 -37.2 211.7 -37.2L211.7 -37.2Q208.7 -37.2 206.4 -35.1Q204.1 -33 202.6 -29.5Q201.1 -26 200.4 -21.8L200.4 -21.8Q199.4 -16.4 200.2 -12Q201 -7.7 203.5 -5.1Q206 -2.5 210.2 -2.5L210.2 -2.5Q212.5 -2.5 215.1 -3.2Q217.6 -3.9 220 -5.8L220 -5.8Q220.2 -6 220.6 -5.6Q220.9 -5.2 220.7 -4.9L220.7 -4.9Q216.9 -1.6 213.2 -0.2Q209.4 1.2 205.8 1.2Z","M235.6 0.9L235.6 0.9Q232.9 0.9 232.1 -1.3Q231.2 -3.6 232.3 -8.9L232.3 -8.9L236.4 -29.7Q237.5 -35.3 234.7 -35.3L234.7 -35.3Q233.6 -35.3 231.9 -34.1Q230.2 -33 228.2 -30.9L228.2 -30.9Q227.9 -30.5 227.5 -30.9Q227 -31.4 227.4 -31.7L227.4 -31.7Q230.9 -35.7 233.7 -37.6Q236.5 -39.5 239.1 -39.5L239.1 -39.5Q241.9 -39.5 242.7 -37.3Q243.5 -35.1 242.5 -30.2L242.5 -30.2L238.4 -8.9Q237.8 -5.9 238.3 -4.6Q238.8 -3.4 239.9 -3.4L239.9 -3.4Q241 -3.4 242.7 -4.5Q244.3 -5.7 246.2 -7.6L246.2 -7.6Q246.6 -8 247 -7.5Q247.4 -7.1 247 -6.8L247 -6.8Q243.8 -3 241.1 -1Q238.3 0.9 235.6 0.9ZM242 -50.9L242 -50.9Q239.8 -50.9 238.6 -52.1Q237.3 -53.3 237.3 -55.6L237.3 -55.6Q237.3 -57.7 238.6 -58.9Q239.8 -60.1 242 -60.1L242 -60.1Q244.3 -60.1 245.5 -58.9Q246.7 -57.7 246.7 -55.6L246.7 -55.6Q246.7 -50.9 242 -50.9Z","M261.3 -0.9L261.3 -0.9L260.3 -1Q261.2 -5.7 262.6 -11Q264 -16.3 265.8 -21.3Q267.6 -26.4 269.7 -30.5Q271.8 -34.6 274.1 -37.1Q276.3 -39.5 278.7 -39.5L278.7 -39.5Q280.1 -39.5 281.6 -38.7Q283 -38 283.9 -36.7Q284.8 -35.4 284.5 -33.8L284.5 -33.8Q284.3 -32.5 283.4 -31.6Q282.4 -30.7 280.9 -30.7L280.9 -30.7Q279.4 -30.7 278.6 -31.5Q277.7 -32.3 277.1 -33.1Q276.4 -33.9 275.3 -33.9L275.3 -33.9Q274 -33.9 272.4 -31.6Q270.8 -29.3 269.1 -25.6Q267.4 -21.9 265.9 -17.4Q264.3 -13 263.1 -8.6Q261.9 -4.3 261.3 -0.9ZM257.4 0.8L257.4 0.8Q255.8 0.8 255.3 0.6Q254.8 0.4 254.8 0.1L254.8 0.1Q254.8 -0.2 255.4 -2.6Q255.9 -5 256.3 -7.4L256.3 -7.4L259.9 -27.1Q260.5 -30.4 260.4 -32.1Q260.2 -33.8 259.6 -34.6Q259 -35.3 258.1 -35.3L258.1 -35.3Q256.9 -35.3 255.4 -34.1Q253.8 -33 252.2 -31.5L252.2 -31.5Q251.9 -31.2 251.5 -31.6Q251.1 -32 251.4 -32.3L251.4 -32.3Q254.6 -36 257.3 -37.7Q260 -39.5 262.6 -39.5L262.6 -39.5Q264.5 -39.5 265.6 -38.4Q266.6 -37.3 266.8 -34.7Q266.9 -32.1 266.1 -27.6L266.1 -27.6L261.3 -0.9Q261 0.8 257.4 0.8Z","M297.7 1.4L297.7 1.4Q292.7 1.4 289.6 -1.4Q286.4 -4.2 285.3 -8.9Q284.3 -13.6 285.3 -19.3L285.3 -19.3Q286.5 -25.2 289.6 -29.8Q292.7 -34.5 297.2 -37.2Q301.6 -39.9 306.7 -39.9L306.7 -39.9Q312 -39.9 315.2 -37.1Q318.4 -34.3 319.5 -29.6Q320.5 -24.9 319.4 -19.3L319.4 -19.3Q318.1 -12.8 314.7 -8.1Q311.3 -3.5 306.8 -1Q302.3 1.4 297.7 1.4ZM301.2 -1.1L301.2 -1.1Q305 -1.1 308.1 -4.7Q311.2 -8.4 312.4 -14.9L312.4 -14.9Q313.1 -18.9 313 -22.8Q312.8 -26.8 311.7 -30.1Q310.6 -33.5 308.6 -35.5Q306.6 -37.5 303.6 -37.5L303.6 -37.5Q299.9 -37.5 296.8 -33.9Q293.6 -30.3 292.3 -23.6L292.3 -23.6Q291.5 -19.5 291.7 -15.5Q291.9 -11.6 293.1 -8.3Q294.2 -5 296.3 -3.1Q298.3 -1.1 301.2 -1.1Z"]]];

  // raminho (quadro 52 × 64): caule e quatro folhas, desenhados em sequência (--r)
  var RAMO = ['M10 62C14 44 24 24 44 4', 'M16 46c-8-1-13-6-14-13 7 1 12 6 14 13Z', 'M20 38c6-5 14-6 20-2-6 5-14 6-20 2Z',
    'M28 26c-6-4-8-11-7-17 6 3 9 10 7 17Z', 'M33 19c6-3 12-2 16 2-6 3-12 3-16-2Z'];

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
    var palavras = PALAVRAS.map(function (p) {
      var vb = p[0].split(' ');
      var traco = '', tinta = '';
      p[1].forEach(function (d) {
        // cada contorno da letra é traçado em paralelo, todos no mesmo tempo (pathLength=1)
        d.split(/(?=M)/).forEach(function (c) { traco += '<path class="mi-traco" pathLength="1" style="--i:' + i + '" d="' + c + '"/>'; });
        tinta += '<path class="mi-letra" style="--i:' + i + '" d="' + d + '"/>';
        i++;
      });
      return '<svg class="mi-palavra" viewBox="' + p[0] + '" style="--vw:' + vb[2] + ';--vh:' + vb[3] + '" aria-hidden="true" focusable="false">' +
        '<g class="mi-contorno">' + traco + '</g><g class="mi-tinta">' + tinta + '</g></svg>';
    }).join('');
    var ramo = '<svg class="mi-ramo" viewBox="0 0 52 64" aria-hidden="true" focusable="false">' +
      RAMO.map(function (d, r) { return '<path pathLength="1" style="--r:' + r + '" d="' + d + '"/>'; }).join('') + '</svg>';
    return '<div class="mi-palco"><div class="mi-nome">' + palavras + ramo + '</div>' +
      '<span class="mi-agulha"></span><p class="mi-papel">Fine Line Tattoo</p></div>';
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
