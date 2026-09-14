/* ==========================================================================
   MANO DEYVID — main.js
   Intro · GSAP reveals · Galeria horizontal · Styles swap · FAQ · Nav · Cursor
   ========================================================================== */
(function () {
  'use strict';

  var docEl = document.documentElement;
  docEl.classList.add('js');

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';

  if (hasGsap && typeof window.ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ------------------------------------------------------------------
     00 · INTRO — assinatura do artista
  ------------------------------------------------------------------ */
  var intro = document.getElementById('intro');
  function closeIntro() {
    if (intro) intro.classList.add('is-done');
    runHeroReveal();
  }
  if (prefersReducedMotion) {
    if (intro) intro.remove();
  } else {
    // 700ms–1400ms: tempo de leitura da assinatura
    window.setTimeout(closeIntro, 1300);
  }

  /* ------------------------------------------------------------------
     01 · HERO — reveal inicial
  ------------------------------------------------------------------ */
  function runHeroReveal() {
    if (!hasGsap || prefersReducedMotion) return;
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero .reveal-word', { yPercent: 110, duration: 0.9, stagger: 0.12 }, 0.15)
      .from('.hero .reveal-line span', { opacity: 0, y: 12, duration: 0.6 }, 0.1)
      .from('.hero .reveal-fade', { opacity: 0, y: 16, duration: 0.7, stagger: 0.1 }, 0.55)
      .from('.hero__media', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power4.out' }, 0.35)
      .from('.hero__footer', { opacity: 0, duration: 0.6 }, 0.9);
  }
  if (prefersReducedMotion) {
    // sem intro: nada a esperar
  } else if (!hasGsap) {
    // fallback: intro fecha, conteúdo já visível via CSS
  }

  /* ------------------------------------------------------------------
     Reveals genéricos por scroll (fora do hero)
  ------------------------------------------------------------------ */
  if (hasGsap && !prefersReducedMotion && window.ScrollTrigger) {
    gsap.utils.toArray('section:not(.hero) .reveal-word').forEach(function (el) {
      gsap.from(el, {
        yPercent: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
    gsap.utils.toArray('section:not(.hero) .reveal-fade').forEach(function (el) {
      gsap.from(el, {
        opacity: 0,
        y: 18,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' }
      });
    });
    gsap.utils.toArray('.reveal-mask').forEach(function (el) {
      gsap.from(el, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 1.1,
        ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      });
    });
  }

  /* ------------------------------------------------------------------
     03 · GALERIA HORIZONTAL (desktop: pin + scrub / mobile: scroll-snap via CSS)
  ------------------------------------------------------------------ */
  if (hasGsap && window.ScrollTrigger && !prefersReducedMotion) {
    ScrollTrigger.matchMedia({
      '(min-width: 1024px)': function () {
        var track = document.getElementById('galleryTrack');
        var pin = document.querySelector('.gallery__pin');
        if (!track || !pin) return;

        var getDistance = function () {
          return Math.max(0, track.scrollWidth - window.innerWidth);
        };

        gsap.to(track, {
          x: function () { return -getDistance(); },
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: function () { return '+=' + getDistance(); },
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1
          }
        });
      }
    });
  }

  /* ------------------------------------------------------------------
     04 · STYLES — troca de imagem por hover/tap
  ------------------------------------------------------------------ */
  (function initStyles() {
    var list = document.getElementById('stylesList');
    if (!list) return;
    var items = list.querySelectorAll('.styles__item');
    var imgs = document.querySelectorAll('.styles__img');

    function activate(style) {
      items.forEach(function (b) {
        var on = b.getAttribute('data-style') === style;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      imgs.forEach(function (f) {
        f.classList.toggle('is-active', f.getAttribute('data-style-img') === style);
      });
    }

    items.forEach(function (btn) {
      var style = btn.getAttribute('data-style');
      if (finePointer) {
        btn.addEventListener('mouseenter', function () { activate(style); });
        btn.addEventListener('focus', function () { activate(style); });
      }
      btn.addEventListener('click', function () { activate(style); });
    });
  })();

  /* ------------------------------------------------------------------
     07 · FAQ — hover troca imagem, clique abre resposta
  ------------------------------------------------------------------ */
  (function initFaq() {
    var listEl = document.getElementById('faqList');
    if (!listEl) return;
    var items = listEl.querySelectorAll('.faq__item');
    var media = document.querySelectorAll('.faq__img');

    function swapImage(key) {
      media.forEach(function (f) {
        f.classList.toggle('is-active', f.getAttribute('data-img') === key);
      });
    }

    items.forEach(function (item) {
      var btn = item.querySelector('.faq__q');
      var key = item.getAttribute('data-faq-img');

      if (finePointer && key) {
        btn.addEventListener('mouseenter', function () { swapImage(key); });
        btn.addEventListener('focus', function () { swapImage(key); });
      }

      btn.addEventListener('click', function () {
        var open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  })();

  /* ------------------------------------------------------------------
     NAV — estado ativo por seção + esconder na intro do hero
  ------------------------------------------------------------------ */
  (function initNav() {
    var links = document.querySelectorAll('.nav__link');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    links.forEach(function (a) { map[a.getAttribute('data-section')] = a; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('is-active'); });
          var id = entry.target.id;
          if (map[id]) map[id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    ['hero', 'work', 'styles', 'about', 'faq', 'contact'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  })();

  /* ------------------------------------------------------------------
     NAV MOBILE — menu compacto
  ------------------------------------------------------------------ */
  (function initMobileNav() {
    var toggle = document.getElementById('mnavToggle');
    var menu = document.getElementById('mnavMenu');
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.hidden = !open;
      document.body.style.overflow = open ? 'hidden' : '';
    }
    setOpen(false);

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  })();

  /* ------------------------------------------------------------------
     CURSOR contextual (somente desktop, sem reduced motion)
  ------------------------------------------------------------------ */
  (function initCursor() {
    if (!finePointer || prefersReducedMotion) return;
    var cursor = document.getElementById('cursor');
    var label = document.getElementById('cursorLabel');
    if (!cursor || !label) return;

    var x = 0, y = 0, cx = 0, cy = 0, raf = null;

    function loop() {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      raf = requestAnimationFrame(loop);
    }

    document.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      cursor.classList.add('is-on');
      if (raf === null) raf = requestAnimationFrame(loop);
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      cursor.classList.remove('is-on');
    });

    // labels contextuais: [data-cursor="OPEN|VIEW|DRAG"]
    document.querySelectorAll('[data-cursor]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        label.textContent = el.getAttribute('data-cursor');
        cursor.classList.add('has-label');
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('has-label');
      });
    });
    document.querySelectorAll('.gcard img').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        label.textContent = 'VIEW';
        cursor.classList.add('has-label');
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('has-label');
      });
    });
  })();

  /* ------------------------------------------------------------------
     MOTIVOS — linha vermelha cresce ao entrar na viewport
  ------------------------------------------------------------------ */
  (function initReasons() {
    var reasons = document.querySelectorAll('.reason');
    if (!reasons.length || !('IntersectionObserver' in window)) {
      reasons.forEach(function (r) { r.classList.add('is-inview'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    reasons.forEach(function (r) { obs.observe(r); });

    if (hasGsap && window.ScrollTrigger && !prefersReducedMotion) {
      gsap.utils.toArray('.reason__num').forEach(function (num) {
        gsap.from(num, {
          yPercent: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: num, start: 'top 88%' }
        });
      });
    }
  })();

})();
