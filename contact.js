(function () {
  'use strict';

  /* ── Navbar scroll shadow ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealEls.forEach(el => el.classList.add('visible'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const siblings = entry.target.parentElement
              ? [...entry.target.parentElement.children].filter(c =>
                  c.classList.contains('reveal') || c.classList.contains('reveal-left') || c.classList.contains('reveal-right'))
              : [];
            const idx = siblings.indexOf(entry.target);
            setTimeout(() => entry.target.classList.add('visible'), idx >= 0 ? idx * 80 : 0);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(el => io.observe(el));
    }
  }

  /* ── Build WhatsApp message from form ── */
  function buildWAMessage() {
    const first   = document.getElementById('firstName')?.value.trim() || '';
    const last    = document.getElementById('lastName')?.value.trim()  || '';
    const email   = document.getElementById('email')?.value.trim()     || '';
    const phone   = document.getElementById('phone')?.value.trim()     || '';
    const subject = document.getElementById('subject')?.value          || '';
    const msg     = document.getElementById('message')?.value.trim()   || '';

    return [
      `*New enquiry via Ledger Partners*`,
      `Name: ${first} ${last}`.trim(),
      email   ? `Email: ${email}`   : '',
      phone   ? `Phone: ${phone}`   : '',
      subject ? `Topic: ${subject}` : '',
      msg     ? `\nMessage:\n${msg}` : '',
    ].filter(Boolean).join('\n');
  }

  /* ── Validate required fields, return true if OK ── */
  function validateForm() {
    let ok = true;
    ['firstName','lastName','email','subject','message'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('error');
      if (!el.value.trim()) { el.classList.add('error'); ok = false; }
    });
    const emailEl = document.getElementById('email');
    if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl.classList.add('error'); ok = false;
    }
    return ok;
  }

  /* ── Contact form — email submit ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      const email   = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value;
      const first   = document.getElementById('firstName').value.trim();
      const last    = document.getElementById('lastName').value.trim();
      const msg     = document.getElementById('message').value.trim();

      const body = `Name: ${first} ${last}\nEmail: ${email}\n\n${msg}`;
      window.location.href = `mailto:ledgerpartnersofficial@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const btn = document.getElementById('submitBtn');
      const orig = btn.textContent;
      btn.textContent = '✓ Opening mail…';
      btn.disabled = true;
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
    });

    /* clear errors on input */
    contactForm.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => el.classList.remove('error'));
    });
  }

  /* ── WhatsApp button ── */
  const waBtn = document.getElementById('waSubmit');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      if (!validateForm()) return;
      const text = buildWAMessage();
      const number = '7907948414'; // E.164 without +
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    });
  }

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
      window.open(`https://wa.me/18323084998?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
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