// =========================================================================
// Portfolio · Charles Raissiguier
// =========================================================================
(() => {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ----------------------------------------------------------------------
  // 0. Hero : séquence d'apparition au chargement (GSAP · progressive enhancement)
  // ----------------------------------------------------------------------
  // Timeline : eyebrow (0.0s) → title letters stagger 40ms (0.4s) → tagline
  // (1.2s) → CTA (1.8s) → pause silence (400ms) → badge "Disponible" (2.6s)
  // Fin totale ~3.1s. Easing : power3.out ≈ cubic-bezier(0.2, 0.8, 0.2, 1).
  //
  // Progressive enhancement : si GSAP n'a pas chargé OU prefers-reduced-motion,
  // on ne touche à rien → tous les éléments sont visibles par CSS naturel.
  // Aucune règle CSS ne les cache : le « hidden state » n'existe que si JS
  // peut ensuite les animer vers le visible.
  (function heroAnimate() {
    const titleEl = document.getElementById('hero-title');
    if (!titleEl) return;

    // Split chaque .title-line en <span class="hero-title-letter"> (Unicode-safe)
    titleEl.querySelectorAll('.title-line').forEach(line => {
      const text = line.textContent;
      line.textContent = '';
      for (const char of text) {
        const span = document.createElement('span');
        span.className = 'hero-title-letter';
        span.textContent = char === ' ' ? '\u00A0' : char;
        line.appendChild(span);
      }
    });

    // Bail out : reduced-motion ou GSAP absent → pas d'animation, éléments visibles
    if (prefersReduced || !window.gsap) return;

    // État initial invisible posé par JS uniquement (pas de CSS qui cache)
    gsap.set(['#hero-eyebrow', '#hero-tagline', '#hero-cta-wrap', '#hero-badge'],
             { opacity: 0 });
    gsap.set('#hero-eyebrow',   { y: 8 });
    gsap.set('#hero-tagline',   { y: 12 });
    gsap.set('#hero-cta-wrap',  { scale: 0.95, transformOrigin: 'left center' });
    gsap.set('#hero-badge',     { scale: 0.95, transformOrigin: 'left center' });
    gsap.set('.hero-title-letter',
             { opacity: 0, y: 12, filter: 'blur(8px)' });

    // Timeline orchestrée
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('#hero-eyebrow',
          { opacity: 1, y: 0, duration: 0.6 }, 0.0)
      .to('.hero-title-letter',
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.04 }, 0.4)
      .to('#hero-tagline',
          { opacity: 1, y: 0, duration: 0.5 }, 1.2)
      .to('#hero-cta-wrap',
          { opacity: 1, scale: 1, duration: 0.4 }, 1.8)
      .to('#hero-badge',
          { opacity: 1, scale: 1, duration: 0.5 }, 2.6);
  })();

  // ----------------------------------------------------------------------
  // 1. Navbar : transparent → opaque au scroll + active link
  // ----------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let navRafPending = false;

  const navUpdate = () => {
    navRafPending = false;
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 20);

    // Highlight active link
    const pos = y + 140;
    let current = '';
    for (let i = 0; i < sections.length; i++) {
      const sec = sections[i];
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        current = sec.id;
        break;
      }
    }
    for (let i = 0; i < navLinks.length; i++) {
      const a = navLinks[i];
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    }
  };
  const onScrollNav = () => {
    if (navRafPending) return;
    navRafPending = true;
    requestAnimationFrame(navUpdate);
  };
  window.addEventListener('scroll', onScrollNav, { passive: true });
  navUpdate();

  // ----------------------------------------------------------------------
  // 2. Reveals on scroll (IntersectionObserver renforcé, one-shot, seuil 20%)
  //    Classes gérées : .reveal, .reveal-num, .reveal-title, .reveal-stagger
  //    (Le hero est animé par GSAP — pas concerné ici.)
  // ----------------------------------------------------------------------
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-num, .reveal-title, .reveal-stagger'
  );
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.revealDelay || '0', 10);
          if (delay) {
            setTimeout(() => el.classList.add('in-view'), delay);
          } else {
            el.classList.add('in-view');
          }
          io.unobserve(el); // one-shot : pas de replay au re-scroll
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.2 });
    revealElements.forEach(el => io.observe(el));
  } else {
    // Fallback IO indispo : affiche immédiatement
    revealElements.forEach(el => el.classList.add('in-view'));
  }

  // ----------------------------------------------------------------------
  // 3. Contact form : validation + POST Formspree (fetch)
  // ----------------------------------------------------------------------
  const form = document.getElementById('contact-form');
  if (form) {
    const successBox = form.querySelector('#form-success');
    const failureBox = form.querySelector('#form-failure');

    const setError = (field, msg) => {
      const wrapper = field.closest('.form-field');
      if (!wrapper) return;
      wrapper.classList.toggle('error', Boolean(msg));
      const errEl = wrapper.querySelector('.form-error');
      if (errEl) errEl.textContent = msg || '';
    };

    form.querySelectorAll('input, textarea').forEach(f => {
      f.addEventListener('input', () => setError(f, ''));
      f.addEventListener('blur', () => {
        if (f.name === 'name' && f.value.trim().length < 2) {
          setError(f, 'Au moins 2 caractères.');
        } else if (f.name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) {
          setError(f, 'Adresse email invalide.');
        } else if (f.name === 'message' && f.value.trim().length < 10) {
          setError(f, 'Message trop court (10 caractères min).');
        } else {
          setError(f, '');
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset state
      if (successBox) successBox.classList.add('hidden');
      if (failureBox) failureBox.classList.add('hidden');

      // Validate
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const msg = form.message.value.trim();
      let ok = true;
      if (name.length < 2) { setError(form.name, 'Au moins 2 caractères.'); ok = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError(form.email, 'Adresse email invalide.'); ok = false; }
      if (msg.length < 10) { setError(form.message, 'Message trop court (10 caractères min).'); ok = false; }
      if (!ok) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const label = submitBtn.querySelector('.submit-label');
      submitBtn.disabled = true;
      if (label) label.textContent = 'Envoi…';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form),
        });

        if (res.ok) {
          form.reset();
          if (successBox) successBox.classList.remove('hidden');
        } else {
          if (failureBox) failureBox.classList.remove('hidden');
        }
      } catch (err) {
        if (failureBox) failureBox.classList.remove('hidden');
      } finally {
        if (label) label.textContent = 'Envoyer';
        submitBtn.disabled = false;
      }
    });
  }

  // ----------------------------------------------------------------------
  // 4. Curseur personnalisé (desktop pointer:fine, pas en reduced-motion)
  // ----------------------------------------------------------------------
  (function customCursor() {
    const dot = document.getElementById('cursor-dot');
    if (!dot) return;
    const canUse = !prefersReduced
      && window.matchMedia('(hover: hover)').matches
      && window.matchMedia('(pointer: fine)').matches;
    if (!canUse) return; // CSS masque déjà par @media, on évite les listeners

    let mx = 0, my = 0, rafPending = false;
    const update = () => {
      rafPending = false;
      dot.style.setProperty('--x', mx + 'px');
      dot.style.setProperty('--y', my + 'px');
    };
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!rafPending) { rafPending = true; requestAnimationFrame(update); }
    }, { passive: true });

    // Passe à 40px au survol d'un élément cliquable
    const hoverables = document.querySelectorAll(
      'a, button, input, textarea, label, .project-visual, .side-card'
    );
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => dot.classList.add('cursor-dot--hover'));
      el.addEventListener('mouseleave', () => dot.classList.remove('cursor-dot--hover'));
    });
  })();

  // ----------------------------------------------------------------------
  // 5. Footer : année automatique
  // ----------------------------------------------------------------------
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
