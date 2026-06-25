/* Ledger Partners — script.js */

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

/* ============================================================
   WORK SECTION — smooth lerp-driven horizontal scroll
   ============================================================ */
const workSection = document.getElementById('workSection');
const workStickyOuter = document.getElementById('workStickyOuter');
const workTrack = document.getElementById('workTrack');
const workHeading = document.querySelector('.work-heading');
const workCards = document.querySelectorAll('.work-card');

if (workHeading) {
  const headingObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { workHeading.classList.add('visible'); headingObs.disconnect(); }
    });
  }, { threshold: 0.25 });
  headingObs.observe(workHeading);
}

let targetTx = 0;
let currentTx = 0;

function computeTarget() {
  if (!workSection || !workTrack || !workCards.length) return;
  const titleH = workSection.querySelector('.work-title-wrap').offsetHeight;
  const sectionTop = window.scrollY + workSection.getBoundingClientRect().top;
  const scrolled = window.scrollY - sectionTop - titleH;
  const viewW = window.innerWidth;
  const firstCard = workCards[0];
  const firstCenter = firstCard.offsetLeft + firstCard.offsetWidth / 2;
  const initialOffset = viewW / 2 - firstCenter;
  const lastCard = workCards[workCards.length - 1];
  const lastCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2;
  const finalOffset = viewW / 2 - lastCenter;
  const scrollRange = workSection.offsetHeight - workStickyOuter.offsetHeight - titleH;
  const progress = Math.min(Math.max(scrolled / scrollRange, 0), 1);
  targetTx = initialOffset + (finalOffset - initialOffset) * progress;
}

function updateActiveCard(tx) {
  const viewW = window.innerWidth;
  const centerX = viewW / 2 - tx;
  let closest = 0, closestD = Infinity;
  workCards.forEach((card, i) => {
    const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - centerX);
    if (dist < closestD) { closestD = dist; closest = i; }
  });
  workCards.forEach((card, i) => card.classList.toggle('work-card--active', i === closest));
}

function animateWork() {
  currentTx += (targetTx - currentTx) * 0.085;
  if (workTrack) workTrack.style.transform = `translateX(${currentTx}px)`;
  updateActiveCard(currentTx);
  requestAnimationFrame(animateWork);
}

window.addEventListener('scroll', computeTarget, { passive: true });
window.addEventListener('resize', () => { computeTarget(); });

computeTarget();
currentTx = targetTx;
if (workTrack) workTrack.style.transform = `translateX(${currentTx}px)`;
updateActiveCard(currentTx);
requestAnimationFrame(animateWork);

/* ============================================================
   SERVICES GRID — inject hover background image
   ============================================================ */
document.querySelectorAll('.sg-cell').forEach(cell => {
  const img = cell.dataset.img;
  const hover = cell.querySelector('.sg-hover');
  if (img && hover) hover.style.backgroundImage = `url('${img}')`;
});

/* ============================================================
   WHY SECTION — staggered fade-in
   ============================================================ */
const whyLines = document.querySelectorAll('.why-line');
if (whyLines.length) {
  const whyObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), delay);
        whyObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  whyLines.forEach(l => whyObs.observe(l));
}

/* ============================================================
   TESTIMONIAL SLIDER
   ============================================================ */
const slides = document.querySelectorAll('.testimonial-slide');
const dotsWrap = document.getElementById('sliderDots');
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');
const logos = document.querySelectorAll('.logo-strip img');
let current = 0;
let autoInterval = null;

if (slides.length && dotsWrap) {
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsWrap.appendChild(dot);
  });
}

function focusLogo(idx) {
  logos.forEach((logo, i) => {
    logo.style.filter = i === idx ? 'none' : 'grayscale(1) blur(1px)';
    logo.style.opacity = i === idx ? '1' : '0.35';
  });
}

function goTo(idx) {
  if (!slides.length) return;
  slides[current].classList.remove('active');
  if (dotsWrap) dotsWrap.children[current].classList.remove('active');
  current = (idx + slides.length) % slides.length;
  slides[current].classList.add('active');
  if (dotsWrap) dotsWrap.children[current].classList.add('active');
  focusLogo(current % logos.length);
}

if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

function startAuto() { autoInterval = setInterval(() => goTo(current + 1), 5500); }
function resetAuto() { clearInterval(autoInterval); startAuto(); }
focusLogo(0);
startAuto();

/* ---------- Footer year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---------- Scroll-reveal ---------- */
const revealEls = document.querySelectorAll('.insight-card, .services-header, .why-header, .cta-band-inner');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = `opacity 0.6s ease ${(i % 4) * 0.08}s, transform 0.6s ease ${(i % 4) * 0.08}s`;
  io.observe(el);
});

/* ---------- Footer WhatsApp lead form ---------- */
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

/* ============================================================
   WORK SECTION — mobile prev/next nav
   ============================================================ */
(function () {
  const workPrev = document.getElementById('workPrev');
  const workNext = document.getElementById('workNext');
  const workCounter = document.getElementById('workCounter');
  const workSticky = document.getElementById('workSticky');
  const mobileCards = document.querySelectorAll('.work-card');
  if (!workPrev || !workSticky || !mobileCards.length) return;

  let activeIdx = 0;
  const total = mobileCards.length;

  function scrollToCard(idx) {
    activeIdx = Math.max(0, Math.min(idx, total - 1));
    const card = mobileCards[activeIdx];
    const scrollLeft = card.offsetLeft - (workSticky.offsetWidth / 2) + (card.offsetWidth / 2);
    workSticky.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    if (workCounter) workCounter.textContent = `${activeIdx + 1} / ${total}`;
    workPrev.disabled = activeIdx === 0;
    workNext.disabled = activeIdx === total - 1;
  }

  workPrev.addEventListener('click', () => scrollToCard(activeIdx - 1));
  workNext.addEventListener('click', () => scrollToCard(activeIdx + 1));
  scrollToCard(0);
})();