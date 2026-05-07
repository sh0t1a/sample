// ── Cursor ────────────────────────────────────────
const dot  = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});
(function tickRing() {
  rx += (mx - rx) * .12; ry += (my - ry) * .12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(tickRing);
})();

document.querySelectorAll('a,button,.gallery-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    ring.style.width  = '54px'; ring.style.height = '54px';
    ring.style.borderColor = 'rgba(200,169,110,.8)';
  });
  el.addEventListener('mouseleave', () => {
    ring.style.width  = '30px'; ring.style.height = '30px';
    ring.style.borderColor = 'rgba(200,169,110,.5)';
  });
});

// ── Nav on scroll ─────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Filter ────────────────────────────────────────
const items   = document.querySelectorAll('.gallery-item');
const btns    = document.querySelectorAll('.filter-btn');
const counter = document.getElementById('visibleCount');

function updateCount() {
  const visible = document.querySelectorAll('.gallery-item:not(.hidden)').length;
  counter.textContent = visible;
}

btns.forEach(btn => {
  btn.addEventListener('click', () => {
    btns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    items.forEach(item => {
      const match = f === 'all' || item.dataset.cat === f;
      item.classList.toggle('hidden', !match);
    });
    updateCount();
  });
});

// ── Lightbox ──────────────────────────────────────
const lb      = document.getElementById('lightbox');
const lbImg   = document.getElementById('lb-img');
const lbTitle = document.getElementById('lb-title');
const lbCat   = document.getElementById('lb-cat');
const lbCtr   = document.getElementById('lb-counter');
const lbClose = document.getElementById('lb-close');
const lbPrev  = document.getElementById('lb-prev');
const lbNext  = document.getElementById('lb-next');

let lbIndex = 0;
let lbItems = [];

function getVisibleItems() {
  return [...document.querySelectorAll('.gallery-item:not(.hidden)')];
}

function openLb(index) {
  lbItems = getVisibleItems();
  lbIndex = ((index % lbItems.length) + lbItems.length) % lbItems.length;
  showLb();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function showLb() {
  const el  = lbItems[lbIndex];
  const img = el.querySelector('img');
  lbImg.src             = img.src.replace(/\/\d+\/\d+$/, '/1600/1000');
  lbImg.alt             = img.alt;
  lbTitle.textContent   = el.dataset.title;
  lbCat.textContent     = el.dataset.cat.charAt(0).toUpperCase() + el.dataset.cat.slice(1);
  lbCtr.textContent     = `${lbIndex + 1} / ${lbItems.length}`;
}

function closeLb() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

items.forEach(item => {
  item.addEventListener('click', () => {
    lbItems = getVisibleItems();
    const vi = lbItems.indexOf(item);
    if (vi >= 0) openLb(vi);
  });
});

lbClose.addEventListener('click', closeLb);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });

lbPrev.addEventListener('click', e => {
  e.stopPropagation();
  lbIndex = lbIndex <= 0 ? lbItems.length - 1 : lbIndex - 1;
  showLb();
});
lbNext.addEventListener('click', e => {
  e.stopPropagation();
  lbIndex = lbIndex >= lbItems.length - 1 ? 0 : lbIndex + 1;
  showLb();
});

document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLb();
  if (e.key === 'ArrowLeft')  { lbIndex = lbIndex <= 0 ? lbItems.length - 1 : lbIndex - 1; showLb(); }
  if (e.key === 'ArrowRight') { lbIndex = lbIndex >= lbItems.length - 1 ? 0 : lbIndex + 1; showLb(); }
});

// ── Reveal on scroll ──────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('vis'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
