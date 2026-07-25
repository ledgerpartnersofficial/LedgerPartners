/* nexterp.js */
(function () {
  'use strict';

/* ---------- Navbar scroll ---------- */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ---------- Nav active link ---------- */
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function () {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

/* ---------- Mobile hamburger ---------- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

/* BACK TO TOP */
const btt = document.getElementById('backToTop');
if (btt) {
  window.addEventListener('scroll', () => btt.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* FOOTER YEAR */
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();

/* ---------- Hero: fade to white + ambient grid ---------- */
const heroFade = document.getElementById('heroFade');
const heroEl = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
  if (!heroFade || !heroEl) return;
  const heroH = heroEl.offsetHeight;
  const sy = window.scrollY;
  const start = heroH * 0.08;
  const end = heroH * 0.65;
  const ratio = Math.min(Math.max((sy - start) / (end - start), 0), 1);
  heroFade.style.opacity = ratio;
  if (heroContent) {
    heroContent.style.transform = `translateY(${-ratio * 36}px)`;
    heroContent.style.opacity = Math.max(1 - ratio * 1.6, 0);
  }
}, { passive: true });

const dataGrid = document.getElementById('heroDataGrid');
if (dataGrid) {
  const labels = ['$2.4T','285K','98.5%','ATM-7','$480','SYNC','TXN','LIVE','24/7','#1','CASH','NET','$1.2B','PROC','GBL','SEC','↑2.1%','ATM','FIN','ISO','EMV','AML','KYC','$94','DEPL','99.1','EUR','USD','GBP','JPY','API','CLR'];
  for (let i = 0; i < 32; i++) {
    const cell = document.createElement('div');
    cell.className = 'hero-data-cell';
    cell.textContent = labels[i % labels.length];
    cell.style.setProperty('--dur', (3 + Math.random() * 5).toFixed(1) + 's');
    cell.style.setProperty('--del', (Math.random() * 4).toFixed(1) + 's');
    dataGrid.appendChild(cell);
  }
}

/* SCROLL REVEAL */
const revealSelectors = [
  '.erp-hero-content',
  '.why-inner > *',
  '.modules-header',
  '.tabs-wrap',
  '.stories-header',
  '.story-card',
  '.industries-header',
  '.industry-card',
  '.process-header',
  '.process-step',
  '.whyus-text',
  '.whyus-card',
  '.erp-cta-content'
];
const revealEls = document.querySelectorAll(revealSelectors.join(','));
revealEls.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const parent = entry.target.parentElement;
    const siblings = [...parent.querySelectorAll('.reveal:not(.revealed)')];
    const idx = siblings.indexOf(entry.target);
    entry.target.style.transitionDelay = Math.max(0, idx * 70) + 'ms';
    entry.target.classList.add('revealed');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
revealEls.forEach(el => observer.observe(el));

/* TABS */
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const panel = document.getElementById('tab-' + target);
    if (panel) panel.classList.add('active');
  });
});

/* NEWSLETTER */
const btn = document.querySelector('.newsletter-row button');
const inp = document.querySelector('.newsletter-row input');
if (btn && inp) {
  btn.addEventListener('click', () => {
    if (!inp.value.trim().includes('@')) {
      inp.style.borderColor = 'rgba(255,80,80,.5)';
      inp.focus();
      setTimeout(() => inp.style.borderColor = '', 1400);
      return;
    }
    btn.textContent = 'Done ✓';
    btn.style.background = '#22c55e';
    inp.value = '';
    inp.disabled = btn.disabled = true;
  });
}


/* STORY CARDS — video playback on hover (if video inside) */
document.querySelectorAll('.story-card').forEach(card => {
  const vid = card.querySelector('video');
  if (!vid) return;
  card.addEventListener('mouseenter', () => vid.play().catch(() => {}));
  card.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
});

/* FOOTER — WhatsApp lead form */
const waLeadForm = document.getElementById('waLeadForm');
if (waLeadForm) {
  waLeadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name  = document.getElementById('waName')?.value.trim()  || '';
    const email = document.getElementById('waEmail')?.value.trim() || '';
    const phone = document.getElementById('waPhone')?.value.trim() || '';
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !phone) {
      [document.getElementById('waName'), document.getElementById('waEmail'), document.getElementById('waPhone')].forEach(el => {
        if (el && !el.value.trim()) el.style.borderColor = '#e05252';
      });
      return;
    }
    const text = [
      '*New enquiry via Ledger Partners*',
      `Name: ${name}`,
      `Email: ${email}`,
      `WhatsApp: ${phone}`,
    ].join('\n');
    window.open(`https://wa.me/7907948414?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    waLeadForm.reset();
  });
  waLeadForm.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', () => el.style.borderColor = '');
  });
}
})();
/* ---------- Nexterp animated demo widget (replaces video in Why section) ---------- */
(function () {
  const stage = document.getElementById('erpStage');
  if (!stage) return;

  const slides = stage.querySelectorAll('.erp-slide');
  const pbar = document.getElementById('erpPbar');
  const dotsEl = document.getElementById('erpDots');
  const total = slides.length;
  const DURATION = 2500; // 1.5s per slide
  let current = 0, startTime = null, raf = null, paused = false;

  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'erp-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dotsEl.appendChild(d);
  });
  const dots = dotsEl.querySelectorAll('.erp-dot');

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    startTime = null;
  }

  function tick(ts) {
    if (paused) {
      raf = requestAnimationFrame(tick);
      return;
    }
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const pct = Math.min(elapsed / DURATION, 1);
    if (pbar) pbar.style.width = (pct * 100) + '%';
    if (pct < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      goTo((current + 1) % total);
      raf = requestAnimationFrame(tick);
    }
  }

  raf = requestAnimationFrame(tick);
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // Pause on hover so people can actually read a slide
  stage.addEventListener('mouseenter', () => { paused = true; });
  stage.addEventListener('mouseleave', () => { paused = false; startTime = null; });
})();