/* ============================================================
   script.js — Jiya John Portfolio
============================================================ */

// ── Navbar scroll shrink ──────────────────────────────────
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.height     = window.scrollY > 20 ? '56px' : '';
  navbar.style.background = window.scrollY > 20 ? 'rgba(10,3,30,.88)' : '';
}, { passive: true });

// ── Navbar active link on scroll ─────────────────────────
const navLinks     = document.querySelectorAll('.nav-link:not(.disabled)');
const pageSections = document.querySelectorAll('section[id]');

pageSections.forEach(sec =>
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting)
        navLinks.forEach(l =>
          l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`)
        );
    });
  }, { threshold: 0.4 }).observe(sec)
);

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ── Hero chip parallax ───────────────────────────────────
const heroEl = document.querySelector('.hero');
const chips  = document.querySelectorAll('.role-chip');
if (heroEl) {
  heroEl.addEventListener('mousemove', e => {
    const { clientWidth: w, clientHeight: h } = heroEl;
    const cx = (e.clientX / w - 0.5) * 2;
    const cy = (e.clientY / h - 0.5) * 2;
    chips.forEach((c, i) => {
      const d = 0.6 + (i % 3) * 0.4;
      c.style.transform = `translate(${cx*8*d}px,${cy*5*d}px)`;
    });
  });
  heroEl.addEventListener('mouseleave', () =>
    chips.forEach(c => (c.style.transform = ''))
  );
}

// ── Projects carousel ────────────────────────────────────
const CATEGORIES = [
  { id: 'web',      label: 'Web Developer'     },
  { id: 'software', label: 'Software Engineer' },
  { id: 'security', label: 'Info Security'     },
  { id: 'aiml',     label: 'AI / ML'           },
  { id: 'data',     label: 'Data Analytics'    },
];

const slotPrev   = document.getElementById('slotPrev');
const slotActive = document.getElementById('slotActive');
const slotNext   = document.getElementById('slotNext');
const prevBtn    = document.getElementById('prevBtn');
const nextBtn    = document.getElementById('nextBtn');

let current     = 0;   // starts on "web dev"
let isAnimating = false;
const N         = CATEGORIES.length;
const mod       = n => ((n % N) + N) % N;

function getPanel(idx) {
  return document.querySelector(`.proj-panel[data-cat="${CATEGORIES[idx].id}"]`);
}

function renderSlots() {
  slotPrev.textContent   = CATEGORIES[mod(current - 1)].label;
  slotActive.textContent = CATEGORIES[current].label;
  slotNext.textContent   = CATEGORIES[mod(current + 1)].label;
  slotPrev.onclick = () => slideTo(mod(current - 1), 'left');
  slotNext.onclick = () => slideTo(mod(current + 1), 'right');
}

function slideTo(newIdx, direction) {
  if (isAnimating || newIdx === current) return;
  isAnimating = true;

  const oldPanel = getPanel(current);
  const newPanel = getPanel(newIdx);

  const outClass = direction === 'right' ? 'anim-out-left'  : 'anim-out-right';
  const inClass  = direction === 'right' ? 'anim-in-right'  : 'anim-in-left';

  // 1. Animate old panel out (it stays display:block via CSS rule)
  oldPanel.classList.add(outClass);

  oldPanel.addEventListener('animationend', () => {
    // 2. Fully hide old panel
    oldPanel.classList.remove('active', outClass);

    // 3. Update current index & slots
    current = newIdx;
    renderSlots();

    // 4. Show & animate new panel in
    newPanel.classList.add('active', inClass);

    newPanel.addEventListener('animationend', () => {
      newPanel.classList.remove(inClass);
      isAnimating = false;
    }, { once: true });

  }, { once: true });
}

prevBtn.addEventListener('click', () => slideTo(mod(current - 1), 'left'));
nextBtn.addEventListener('click', () => slideTo(mod(current + 1), 'right'));

// Keyboard support
document.addEventListener('keydown', e => {
  const r = document.getElementById('projects')?.getBoundingClientRect();
  if (!r || r.top >= window.innerHeight || r.bottom <= 0) return;
  if (e.key === 'ArrowRight') nextBtn.click();
  if (e.key === 'ArrowLeft')  prevBtn.click();
});

// Init
renderSlots();
