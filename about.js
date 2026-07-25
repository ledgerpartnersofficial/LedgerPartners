(function () {
  'use strict';

  /* ── Navbar scroll shadow ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Nav active link ── */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ── Mobile hamburger ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
      const spans = hamburger.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity  = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity   = '';
        });
      });
    });
  }

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

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      revealEls.forEach(el => el.classList.add('visible'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            /* stagger siblings inside the same parent */
            const siblings = entry.target.parentElement
              ? [...entry.target.parentElement.children].filter(c =>
                  c.classList.contains('reveal') ||
                  c.classList.contains('reveal-left') ||
                  c.classList.contains('reveal-right'))
              : [];
            const idx = siblings.indexOf(entry.target);
            const delay = idx >= 0 ? idx * 80 : 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      revealEls.forEach(el => io.observe(el));
    }
  }

  /* ── Smooth scroll for hero arrow ── */
  const scrollBtn = document.querySelector('.hero-scroll-btn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(scrollBtn.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ── Ticker pause on focus (keyboard a11y) ── */
  const ticker = document.querySelector('.ticker-inner');
  if (ticker) {
    ticker.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('focus',  () => ticker.style.animationPlayState = 'paused');
      el.addEventListener('blur',   () => ticker.style.animationPlayState = '');
    });
  }

  /* ── Value item entrance stagger ── */
  /* (handled by reveal IO above; extra class hook for CSS if needed) */

  /* ── Team card — touch support for overlay ── */
  document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('touchstart', () => {
      document.querySelectorAll('.team-card').forEach(c => c.classList.remove('touch-active'));
      card.classList.toggle('touch-active');
    }, { passive: true });
  });

  /* ── Newsletter forms ── */
  function handleNewsletter(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input  = form.querySelector('input[type="email"]');
      const button = form.querySelector('button');
      const email  = input.value.trim();

      /* basic validation */
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        input.style.outline = '2px solid #e05252';
        input.focus();
        setTimeout(() => input.style.outline = '', 2000);
        return;
      }

      /* success state */
      const original = button.textContent;
      button.textContent = '✓ Subscribed!';
      button.disabled = true;
      input.disabled  = true;
      input.value     = '';

      setTimeout(() => {
        button.textContent = original;
        button.disabled    = false;
        input.disabled     = false;
        input.placeholder  = 'Enter your email';
      }, 3500);
    });

    /* clear error outline on type */
    form.querySelector('input')?.addEventListener('input', function () {
      this.style.outline = '';
    });
  }

  handleNewsletter('aboutNewslzetterForm');

  /* ── Footer WhatsApp lead form ── */
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

  /* ── Footer year ── */
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

})();