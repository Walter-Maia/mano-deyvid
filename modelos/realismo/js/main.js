/* ==========================================================================
   ÍRIS VALENÇA (site modelo) — main.js
   Menu · Styles · FAQ · Nav · Cursor · Movimento ligado à rolagem · Efeitos que se repetem. Sem dependências.
   Regra geral: sem JS todo o conteúdo aparece; com movimento reduzido tudo nasce no estado final;
   o que está na tela no carregamento não é escondido; os efeitos de entrada se repetem a cada volta à tela.
   ========================================================================== */
(() => {
  'use strict';
  const doc = document;
  const raiz = doc.documentElement;
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ponteiroFino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const temIO = 'IntersectionObserver' in window;
  const semMovimento = () => reduz.matches || !temIO;

  /* ------------------------------------------------------------------
     04 · TEMAS — troca de imagem por hover/tap
  ------------------------------------------------------------------ */
  (function initStyles() {
    const list = doc.getElementById('stylesList');
    if (!list) return;
    const items = list.querySelectorAll('.styles__item');
    const imgs = doc.querySelectorAll('.styles__img');
    const activate = style => {
      items.forEach(b => {
        const on = b.getAttribute('data-style') === style;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      imgs.forEach(f => f.classList.toggle('is-active', f.getAttribute('data-style-img') === style));
    };
    items.forEach(btn => {
      const style = btn.getAttribute('data-style');
      if (ponteiroFino) {
        btn.addEventListener('mouseenter', () => activate(style));
        btn.addEventListener('focus', () => activate(style));
      }
      btn.addEventListener('click', () => activate(style));
    });
  })();

  /* ------------------------------------------------------------------
     07 · FAQ — hover troca imagem, clique abre resposta
  ------------------------------------------------------------------ */
  (function initFaq() {
    const listEl = doc.getElementById('faqList');
    if (!listEl) return;
    const media = doc.querySelectorAll('.faq__img');
    const swapImage = key => media.forEach(f => f.classList.toggle('is-active', f.getAttribute('data-img') === key));
    listEl.querySelectorAll('.faq__item').forEach(item => {
      const btn = item.querySelector('.faq__q');
      const key = item.getAttribute('data-faq-img');
      if (ponteiroFino && key) {
        btn.addEventListener('mouseenter', () => swapImage(key));
        btn.addEventListener('focus', () => swapImage(key));
      }
      btn.addEventListener('click', () => {
        const open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (key) swapImage(key);
      });
    });
  })();

  /* ------------------------------------------------------------------
     NAV — estado ativo por seção
  ------------------------------------------------------------------ */
  (function initNav() {
    const links = doc.querySelectorAll('.nav__link');
    if (!links.length || !temIO) return;
    const map = {};
    links.forEach(a => { map[a.getAttribute('data-section')] = a; });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || !map[entry.target.id]) return;
        links.forEach(a => { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        map[entry.target.id].classList.add('is-active');
        map[entry.target.id].setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-40% 0px -50% 0px' });
    ['hero', 'work', 'styles', 'about', 'process', 'faq', 'contact'].forEach(id => {
      const el = doc.getElementById(id);
      if (el) observer.observe(el);
    });
  })();

  /* ------------------------------------------------------------------
     NAV MOBILE — menu compacto: foco vai para o primeiro item, Tab fica preso no menu, Esc fecha e devolve o foco
  ------------------------------------------------------------------ */
  (function initMobileNav() {
    const toggle = doc.getElementById('mnavToggle');
    const menu = doc.getElementById('mnavMenu');
    const cta = doc.querySelector('.mnav__cta');
    if (!toggle || !menu) return;
    const links = [...menu.querySelectorAll('a')];
    function setOpen(open, devolveFoco = true) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      menu.hidden = !open;
      doc.body.style.overflow = open ? 'hidden' : '';
      if (open) links[0].focus();
      else if (devolveFoco) toggle.focus();
    }
    toggle.setAttribute('aria-label', 'Abrir menu');
    toggle.addEventListener('click', () => setOpen(menu.hidden));
    links.forEach(a => a.addEventListener('click', () => {
      setOpen(false, false);
      const alvo = doc.querySelector(a.getAttribute('href'));
      if (alvo) {
        alvo.setAttribute('tabindex', '-1');
        alvo.focus({ preventScroll: true });
        alvo.addEventListener('blur', () => alvo.removeAttribute('tabindex'), { once: true });
      }
    }));
    doc.addEventListener('keydown', e => {
      if (menu.hidden) return;
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab') return;
      // o menu vem depois da barra no DOM: a ordem do Tab é controlada aqui (links → botão → CTA → links)
      const ordem = [...links, toggle, cta].filter(Boolean);
      const i = ordem.indexOf(doc.activeElement);
      e.preventDefault();
      if (i === -1) { ordem[0].focus(); return; }
      ordem[(i + (e.shiftKey ? -1 : 1) + ordem.length) % ordem.length].focus();
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', e => { if (e.matches && !menu.hidden) setOpen(false, false); });
  })();

  /* ------------------------------------------------------------------
     CURSOR contextual (somente desktop, sem movimento reduzido). O quadro só roda enquanto o ponto está se movendo.
  ------------------------------------------------------------------ */
  (function initCursor() {
    if (!ponteiroFino) return;
    const cursor = doc.getElementById('cursor');
    const label = doc.getElementById('cursorLabel');
    if (!cursor || !label) return;
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      const k = reduz.matches ? 1 : 0.22;
      cx += (x - cx) * k;
      cy += (y - cy) * k;
      cursor.style.transform = `translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px) translate(-50%,-50%)`;
      raf = (Math.abs(x - cx) > 0.2 || Math.abs(y - cy) > 0.2) ? requestAnimationFrame(loop) : 0;
    };
    doc.addEventListener('mousemove', e => {
      x = e.clientX; y = e.clientY;
      cursor.classList.add('is-on');
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    doc.addEventListener('mouseleave', () => cursor.classList.remove('is-on'));
    const rotula = (el, texto) => {
      el.addEventListener('mouseenter', () => { label.textContent = texto || el.getAttribute('data-cursor'); cursor.classList.add('has-label'); });
      el.addEventListener('mouseleave', () => cursor.classList.remove('has-label'));
    };
    doc.querySelectorAll('[data-cursor]').forEach(el => rotula(el));
    doc.querySelectorAll('.gcard img').forEach(el => rotula(el, 'VER'));
  })();

  /* ------------------------------------------------------------------
     MOVIMENTO LIGADO À ROLAGEM
     Onde o navegador tem linhas do tempo de rolagem (animation-timeline: Chrome, Edge), o CSS faz o parallax, a faixa,
     a galeria presa, a agulha de leitura e a linha dos passos no compositor; aqui só ficam as medidas (variáveis CSS, no
     redimensionamento) e os números acesos dos passos. Nos outros navegadores, um único requestAnimationFrame por quadro
     faz tudo: lê todas as posições antes de escrever, só das camadas perto da tela (IntersectionObserver com rootMargin),
     e escreve só transform.
  ------------------------------------------------------------------ */
  const rolagemNoCss = !!(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const progressoNaTela = (r, vh) => clamp((vh - r.top) / (vh + r.height), 0, 1);
  const camadas = [];
  const TIPOS = {
    // fotos em moldura fixa: a imagem sobra 7% em cima e embaixo e desce mais devagar que a página
    foto: (el, r, vh) => { el.style.transform = `translate3d(0,${((progressoNaTela(r, vh) - 0.5) * 0.12 * r.height).toFixed(1)}px,0)`; },
    // desenhos (olho, gota, pena, círculos, pincel): cada um numa velocidade (data-vel), com um giro leve
    flash: (el, r, vh) => {
      const d = 0.5 - progressoNaTela(r, vh);
      const v = Number(el.dataset.vel) || 1;
      el.style.transform = `translate3d(0,${(d * 150 * v).toFixed(1)}px,0) rotate(${(d * 26 * v).toFixed(2)}deg)`;
    },
    // moldura em espectro dos temas: na diagonal, contra a foto
    moldura: (el, r, vh) => { const d = (0.5 - progressoNaTela(r, vh)) * 44; el.style.transform = `translate3d(${(-d * 0.5).toFixed(1)}px,${d.toFixed(1)}px,0)`; }
  };
  const medidaDe = (el, tipo) => (tipo === 'flash' ? el.closest('section') : el.parentElement);

  // galeria: no desktop a faixa anda para o lado enquanto a página desce, presa na tela
  const galeria = doc.querySelector('[data-galeria]');
  const trilho = galeria && galeria.querySelector('.gallery__track');
  const telaLarga = window.matchMedia('(min-width: 1024px)');
  let presa = false, distGaleria = 0;
  function medeGaleria() {
    if (!galeria) return;
    const deve = movendo && telaLarga.matches;
    if (deve !== presa) {
      presa = deve;
      galeria.classList.toggle('galeria-presa', presa);
      if (!presa) {
        galeria.style.height = '';
        trilho.style.transform = '';
        trilho.style.removeProperty('--dist');
      }
    }
    if (!presa) return;
    distGaleria = Math.max(0, trilho.scrollWidth - window.innerWidth);
    galeria.style.height = (window.innerHeight + distGaleria) + 'px';
    // o CSS anda do começo (x = 0) ao fim (x = −dist)
    if (rolagemNoCss) trilho.style.setProperty('--dist', distGaleria.toFixed(1));
  }
  // setas do teclado com a galeria presa: andam um cartão por vez
  if (trilho) trilho.addEventListener('keydown', e => {
    if (!presa || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
    e.preventDefault();
    const passo = (trilho.firstElementChild ? trilho.firstElementChild.offsetWidth : 300) + 40;
    window.scrollBy({ top: e.key === 'ArrowRight' ? passo : -passo, behavior: reduz.matches ? 'instant' : 'smooth' });
  });

  // faixa: as duas linhas andam em sentidos opostos, até 60% da largura da tela (o CSS usa o mesmo valor)
  const faixa = doc.querySelector('[data-faixa]');
  const linhasDaFaixa = faixa ? [...faixa.querySelectorAll('[data-faixa-linha]')] : [];
  let larguras = [];
  const medeFaixa = () => { larguras = linhasDaFaixa.map(l => Math.min(Math.max(0, l.scrollWidth - window.innerWidth), window.innerWidth * 0.6)); };

  // processo: a linha em espectro cresce enquanto os passos atravessam a tela e acende cada número
  const passos = doc.querySelector('[data-passos]');
  const linhaDosPassos = passos && passos.querySelector('.process__linha');
  const listaDePassos = passos ? [...passos.querySelectorAll('.pstep')] : [];
  let marcos = [];
  const medePassos = () => {
    if (!passos) return;
    const h = Math.max(1, passos.offsetHeight);
    marcos = listaDePassos.map(s => (s.offsetTop + s.offsetHeight * 0.45) / h);
  };

  let pedido = 0;
  let movendo = false;
  function quadro() {
    pedido = 0;
    if (!movendo) return;
    const vh = window.innerHeight;
    // leituras (com o CSS fazendo as camadas, só a lista dos passos é lida)
    const lidas = rolagemNoCss ? [] : camadas.filter(c => c.perto).map(c => [c, c.medida.getBoundingClientRect()]);
    const rGaleria = !rolagemNoCss && presa && galeria.perto ? galeria.getBoundingClientRect() : null;
    const rFaixa = !rolagemNoCss && faixa && faixa.perto ? faixa.getBoundingClientRect() : null;
    const rPassos = passos && passos.perto ? passos.getBoundingClientRect() : null;
    // escritas
    lidas.forEach(([c, r]) => TIPOS[c.tipo](c.el, r, vh));
    if (rGaleria) {
      const p = clamp(-rGaleria.top / Math.max(1, rGaleria.height - vh), 0, 1);
      const x = -distGaleria * p;
      trilho.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    }
    if (rFaixa) {
      const p = progressoNaTela(rFaixa, vh);
      linhasDaFaixa.forEach((l, i) => {
        const x = Number(l.dataset.faixaLinha) < 0 ? -larguras[i] * p : -larguras[i] * (1 - p);
        l.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      });
    }
    if (rPassos) {
      // começa quando o topo da lista passa de 80% da tela e termina quando o fim chega a 60% (igual ao animation-range do CSS)
      const k = clamp((vh * 0.8 - rPassos.top) / (vh * 0.2 + rPassos.height), 0, 1);
      if (!rolagemNoCss) linhaDosPassos.style.transform = `scaleY(${k.toFixed(3)})`;
      listaDePassos.forEach((s, i) => s.classList.toggle('aceso', k >= marcos[i]));
    }
  }
  const agenda = () => { if (!pedido) pedido = requestAnimationFrame(quadro); };
  const remede = () => { medeGaleria(); medeFaixa(); medePassos(); agenda(); };
  // com o CSS fazendo as camadas, nada roda por quadro durante a rolagem
  if (!rolagemNoCss) window.addEventListener('scroll', agenda, { passive: true });
  let larguraAnterior = window.innerWidth, alturaAnterior = window.innerHeight;
  window.addEventListener('resize', () => {
    // no celular e no tablet a barra do navegador muda a altura ao rolar: só remede quando a mudança é real
    if (!ponteiroFino && window.innerWidth === larguraAnterior && Math.abs(window.innerHeight - alturaAnterior) < 120) { agenda(); return; }
    larguraAnterior = window.innerWidth; alturaAnterior = window.innerHeight;
    remede();
  }, { passive: true });

  let perto = null;
  function ligaMovimento() {
    if (semMovimento() || movendo) return;
    movendo = true;
    raiz.classList.add('movendo');
    if (!perto) {
      perto = new IntersectionObserver(entradas => {
        entradas.forEach(e => {
          e.target.perto = e.isIntersecting;
          // no modo CSS, as animações ligadas à rolagem só existem nas seções perto da tela (classe .perto)
          if (rolagemNoCss) e.target.classList.toggle('perto', e.isIntersecting);
          camadas.forEach(c => { if (c.medida === e.target) c.perto = e.isIntersecting; });
        });
        agenda();
      }, { rootMargin: '30% 0px' });
      doc.querySelectorAll('[data-parallax]').forEach(el => {
        const tipo = el.dataset.parallax;
        if (!TIPOS[tipo]) return;
        // a velocidade de cada desenho flash vai para o CSS como --v
        if (tipo === 'flash') el.style.setProperty('--v', Number(el.dataset.vel) || 1);
        const medida = medidaDe(el, tipo);
        if (!medida) return;
        if (!rolagemNoCss) camadas.push({ el, tipo, medida, perto: false });
        perto.observe(medida);
      });
      [galeria, faixa].forEach(el => { if (el) perto.observe(el); });
      if (rolagemNoCss && passos) perto.observe(passos);
      if (passos && !rolagemNoCss) perto.observe(passos);
      // números dos passos: acendem quando cruzam uma linha a 70% da altura da tela (a linha do CSS passa ali). A área
      // observada vai muito acima da tela: um salto (âncora, tecla End) de baixo para cima dela também troca o estado.
      if (passos && rolagemNoCss) {
        const acende = new IntersectionObserver(es => es.forEach(e => { if (movendo) e.target.classList.toggle('aceso', e.isIntersecting); }), { rootMargin: '10000% 0px -30% 0px' });
        listaDePassos.forEach(s => acende.observe(s));
      }
    }
    if (passos) passos.classList.add('passos-vivos');
    remede();
    // a galeria presa aumenta a página: se a visita chegou por âncora, volta ao alvo
    if (presa && location.hash) {
      const alvo = doc.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (alvo && galeria.compareDocumentPosition(alvo) & Node.DOCUMENT_POSITION_FOLLOWING) alvo.scrollIntoView();
    }
  }
  function desligaMovimento() {
    movendo = false;
    raiz.classList.remove('movendo');
    camadas.forEach(c => { c.el.style.transform = ''; });
    linhasDaFaixa.forEach(l => { l.style.transform = ''; });
    if (passos) { passos.classList.remove('passos-vivos'); linhaDosPassos.style.transform = ''; listaDePassos.forEach(s => s.classList.remove('aceso')); }
    medeGaleria();
  }
  ligaMovimento();
  telaLarga.addEventListener('change', remede);
  reduz.addEventListener('change', () => { if (reduz.matches) desligaMovimento(); else ligaMovimento(); agenda(); });
  // a fonte dos títulos muda a largura da faixa e a altura dos passos
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(remede);
  window.addEventListener('load', remede);

  /* ------------------------------------------------------------------
     EFEITOS QUE SE REPETEM: cada bloco volta ao estado inicial (.armada) quando sai inteiro da tela e toca (.tocando)
     quando volta, rolando para baixo ou para cima. Os que entram juntos tocam em sequência (90 ms entre eles).
  ------------------------------------------------------------------ */
  const LIMIARES = Array.from({ length: 21 }, (_, i) => i / 20);
  const efeitos = new Map();
  // quem sai pelo topo é armado deslocado para cima (na volta, entra descendo); quem sai por baixo entra subindo.
  // Armado para baixo, um bloco que saiu pelo topo voltaria para dentro da tela e piscaria sem parar na borda.
  const arma = (f, peloTopo) => { clearTimeout(f.timer); f.estado = 'armado'; f.el.style.setProperty('--de', peloTopo ? -1 : 1); f.op.arma(f.el); };
  const conclui = f => { clearTimeout(f.timer); f.estado = 'final'; f.op.conclui(f.el); f.el.style.removeProperty('--de'); };
  const toca = (f, ordem) => {
    f.estado = 'tocando';
    f.op.toca(f.el, ordem);
    f.timer = setTimeout(() => { if (f.estado === 'tocando') conclui(f); }, f.op.duracao + ordem * 90);
  };
  // blocos mais altos que a tela tocam com uma fração menor visível
  // a altura vem da própria entrada do observador (ler getBoundingClientRect aqui forçaria um layout a cada limiar)
  const limiar = (f, altura) => Math.max(0.05, Math.min(f.op.limiar, 0.6 * window.innerHeight / Math.max(1, altura)));
  const observador = temIO ? new IntersectionObserver(entradas => {
    const agora = [];
    entradas.forEach(e => {
      const f = efeitos.get(e.target);
      if (!f) return;
      if (reduz.matches) { if (f.estado !== 'final') conclui(f); return; }
      // só arma quando o bloco sai por completo da tela
      if (!e.isIntersecting) { if (f.estado !== 'armado') arma(f, e.boundingClientRect.bottom <= 0); return; }
      if (f.estado === 'armado' && (e.intersectionRatio >= limiar(f, e.boundingClientRect.height) || e.intersectionRect.height >= 0.5 * window.innerHeight)) agora.push(f);
    });
    agora.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    agora.forEach((f, i) => toca(f, Math.min(i, 5)));
  }, { threshold: LIMIARES }) : null;
  const repete = (el, op) => {
    if (!el || semMovimento()) return;
    efeitos.set(el, { el, op, estado: 'final', timer: 0 });
    observador.observe(el);
  };
  const porClasses = (armada, ativa, extra = {}) => Object.assign({
    limiar: 0.25, duracao: 1500,
    arma: el => { el.classList.remove(ativa); el.classList.add(armada); },
    toca: el => { el.classList.add(ativa); el.classList.remove(armada); },
    conclui: el => { el.classList.remove(armada, ativa); }
  }, extra);
  // com movimento reduzido ligado no meio da visita, tudo vai para o estado final
  reduz.addEventListener('change', () => { if (reduz.matches) efeitos.forEach(f => conclui(f)); });

  // blocos que sobem e aparecem; o atraso em sequência vai no próprio elemento
  doc.querySelectorAll('.reveal').forEach(el => repete(el, porClasses('armada', 'tocando', {
    limiar: 0.2, duracao: 1700,
    toca: (alvo, ordem) => { alvo.style.transitionDelay = ordem ? ordem * 90 + 'ms' : ''; alvo.classList.add('tocando'); alvo.classList.remove('armada'); },
    conclui: alvo => { alvo.classList.remove('armada', 'tocando'); alvo.style.transitionDelay = ''; }
  })));
  doc.querySelectorAll('.revela-grupo').forEach(el => repete(el, porClasses('armada', 'tocando', { limiar: 0.25, duracao: 1800 })));
  // traços que se desenham e fotos que abrem em cortina
  doc.querySelectorAll('[data-desenha]').forEach(el => repete(el, porClasses('armada', 'tocando', { limiar: 0.5, duracao: 1800 })));
  doc.querySelectorAll('[data-revela-foto]').forEach(el => repete(el, porClasses('armada', 'tocando', { limiar: 0.2, duracao: 2000 })));

  /* Títulos H2: cada palavra ganha uma máscara e sobe; as da mesma linha sobem juntas (--l). <em>, <br> e SVG são mantidos. */
  (function titulos() {
    const lista = [...doc.querySelectorAll('[data-titulo]')];
    if (!lista.length || semMovimento()) return;
    const divide = no => {
      [...no.childNodes].forEach(filho => {
        if (filho.nodeType === 3) {
          if (!filho.textContent.trim()) return;
          const frag = doc.createDocumentFragment();
          filho.textContent.split(/(\s+)/).forEach(parte => {
            if (!parte) return;
            if (/^\s+$/.test(parte)) { frag.appendChild(doc.createTextNode(parte)); return; }
            const w = doc.createElement('span');
            const dentro = doc.createElement('span');
            w.className = 'w'; dentro.className = 'w-in'; dentro.textContent = parte;
            w.appendChild(dentro); frag.appendChild(w);
          });
          no.replaceChild(frag, filho);
        } else if (filho.nodeType === 1 && filho.tagName !== 'BR' && !(filho instanceof SVGElement)) divide(filho);
      });
    };
    const numera = () => lista.forEach(h => {
      let topo = null; let linha = -1;
      h.querySelectorAll('.w').forEach(w => {
        const t = w.getBoundingClientRect().top;
        if (topo === null || Math.abs(t - topo) > 4) { linha++; topo = t; }
        w.style.setProperty('--l', Math.min(linha, 8));
      });
    });
    lista.forEach(divide);
    numera();
    lista.forEach(h => repete(h, porClasses('titulo-armado', 'titulo-tocando', { limiar: 0.6, duracao: 2000 })));
    // a quebra de linha muda com a largura e com a chegada da fonte: renumera as linhas
    let largura = window.innerWidth; let espera = 0;
    window.addEventListener('resize', () => {
      clearTimeout(espera);
      espera = setTimeout(() => { if (window.innerWidth !== largura) { largura = window.innerWidth; numera(); } }, 200);
    });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(numera);
  })();

  /* Motivos: o número em stencil e o filete fazem parte do próprio bloco .reveal (ver CSS) */
})();
