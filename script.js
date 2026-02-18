// Aurelian Pools site JS (modal + mobile nav)

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');
const year = document.querySelector('#year');

const modal = document.querySelector('#requestModal');
const requestSelection = document.querySelector('#requestSelection');

year.textContent = new Date().getFullYear();

function closeNav(){
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
}

function openNav(){
  nav.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Close menu');
}

navToggle?.addEventListener('click', (e) => {
  e.stopPropagation();
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  expanded ? closeNav() : openNav();
});

document.addEventListener('click', (e) => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  if (expanded && !nav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
});

// Smooth scroll for in-page links; close nav if open.
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    // Back to top: scroll to true top for reliability
    if (id === '#top'){
      e.preventDefault();
      if (navToggle.getAttribute('aria-expanded') === 'true') closeNav();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      history.replaceState(null, '', id);
      return;
    }

    const target = document.querySelector(id);
    if (target){
      e.preventDefault();
      if (navToggle.getAttribute('aria-expanded') === 'true') closeNav();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    }
  });
});

// Modal helpers
function openModal(kind, selection){
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Preselect the chosen option if it exists; otherwise default based on what they clicked.
  const options = Array.from(requestSelection.options).map(o => o.textContent.trim());
  if (options.includes(selection)){
    requestSelection.value = selection;
  } else {
    requestSelection.value = (kind === 'specialty') ? 'New Pool Startup' : 'Premium';
  }

  const firstInput = modal.querySelector('input, select, textarea');
  firstInput?.focus();
}

function closeModal(){
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.open-modal').forEach(btn => {
  btn.addEventListener('click', () => {
    const kind = btn.getAttribute('data-kind') || 'plan';
    const selection = btn.getAttribute('data-selection') || 'Basic';
    openModal(kind, selection);
  });
});

modal.addEventListener('click', (e) => {
  const shouldClose = e.target?.getAttribute?.('data-close') === 'true';
  if (shouldClose) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false'){
    closeModal();
  }
});



// Top slideshow (auto + manual)
(function(){
  const slides = Array.from(document.querySelectorAll('.slideshow-slide'));
  if (!slides.length) return;

  const viewport = document.querySelector('.slideshow-viewport');

  let idx = 0;
  const intervalMs = 4500;
  let timer = null;

  function show(i){
    slides[idx].classList.remove('is-active');
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('is-active');
  }

  function next(){ show(idx + 1); }
  function prev(){ show(idx - 1); }

  function start(){
    stop();
    timer = setInterval(next, intervalMs);
  }
  function stop(){
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Set viewport height based on the *tallest* image ratio so every photo fits (object-fit: contain).
  function updateHeight(){
    if (!viewport) return;
    const vw = viewport.clientWidth || viewport.getBoundingClientRect().width;
    if (!vw) return;

    let maxRatio = 0.5625; // fallback ~16:9
    for (const img of slides){
      const w = img.naturalWidth || 0;
      const h = img.naturalHeight || 0;
      if (w > 0 && h > 0){
        maxRatio = Math.max(maxRatio, h / w);
      }
    }
    viewport.style.setProperty('--slideH', Math.round(vw * maxRatio * 0.75) + 'px');
  }

  // Wait for images to load (including cached)
  let pending = slides.length;
  slides.forEach(img => {
    if (img.complete) {
      pending -= 1;
      if (pending <= 0) updateHeight();
    } else {
      img.addEventListener('load', () => {
        pending -= 1;
        if (pending <= 0) updateHeight();
      }, { once:true });
    }
  });

  window.addEventListener('resize', updateHeight);

  // Sleek navigation: click/tap the photo to advance
  viewport?.addEventListener('click', () => { next(); start(); });


  viewport?.addEventListener('mouseenter', stop);
  viewport?.addEventListener('mouseleave', start);

  start();
})();
