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

if (hamburger && mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

/* ---------- Scroll reveal for new sections ---------- */
const daReveal = document.querySelectorAll(
  '.preview-da-text, .preview-da-art, .why-da-head, .why-da-card, .work-da-head, .work-da-card, .harder-da-text, .harder-da-art, .faq-da-head, .faq-da-item, .quotes-da-inner h2, .quote-da-card'
);
daReveal.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});
function daRevealCheck() {
  daReveal.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 60) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }
  });
}
daRevealCheck();
window.addEventListener('scroll', daRevealCheck, { passive: true });

/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.faq-da-item').forEach(item => {
  const q = item.querySelector('.faq-da-q');
  const icon = item.querySelector('.faq-da-icon');
  if (!q) return;
  q.addEventListener('click', () => {
    const willOpen = !item.classList.contains('open');
    document.querySelectorAll('.faq-da-item').forEach(other => {
      other.classList.remove('open');
      const otherIcon = other.querySelector('.faq-da-icon');
      if (otherIcon) otherIcon.textContent = '+';
    });
    if (willOpen) {
      item.classList.add('open');
      if (icon) icon.textContent = '−';
    }
  });
});

/* ---------- Our Work gallery — click-to-expand modal ---------- */
const workModal = document.getElementById('workModal');
const workModalBackdrop = document.getElementById('workModalBackdrop');
const workModalClose = document.getElementById('workModalClose');
const workModalImg = document.getElementById('workModalImg');
const workModalTitle = document.getElementById('workModalTitle');
const workModalDesc = document.getElementById('workModalDesc');

function openWorkModal(card) {
  if (!workModal || !workModalImg || !workModalTitle || !workModalDesc) return;
  const img = card.getAttribute('data-img') || '';
  const title = card.getAttribute('data-title') || '';
  const desc = card.getAttribute('data-desc') || '';

  workModalImg.style.backgroundImage = `url('${img}')`;
  workModalTitle.textContent = title;
  workModalDesc.textContent = desc;

  card.classList.add('expanding');
  setTimeout(() => card.classList.remove('expanding'), 320);

  workModal.classList.add('is-open');
  workModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeWorkModal() {
  if (!workModal) return;
  workModal.classList.remove('is-open');
  workModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.work-da-card').forEach(card => {
  card.addEventListener('click', () => openWorkModal(card));
});
if (workModalClose) workModalClose.addEventListener('click', closeWorkModal);
if (workModalBackdrop) workModalBackdrop.addEventListener('click', closeWorkModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && workModal && workModal.classList.contains('is-open')) closeWorkModal();
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