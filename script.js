// Aurelian Pools site JS (lightweight, no dependencies)

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');
const year = document.querySelector('#year');
const contactForm = document.querySelector('#contactForm');
const quoteForm = document.querySelector('#quoteForm');
const formStatus = document.querySelector('#formStatus');

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

// Close the mobile menu only when clicking outside (and only if it's open)
document.addEventListener('click', (e) => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  if (!expanded) return;
  if (!nav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
});

// Smooth scroll for in-page links.
// On mobile, close the menu after selecting a link.
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (target){
      e.preventDefault();
      const isMobileMenuOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (isMobileMenuOpen) closeNav();

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    }
  });
});

// Demo form handlers (replace with real submit to email/CRM)
function handleFakeSubmit(form, statusEl){
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    if (statusEl){
      statusEl.textContent = "Thanks — request received. (Template form: connect this to email/CRM before launch.)";
    } else {
      alert("Thanks — request received. (Template form: connect this to email/CRM before launch.)");
    }

    console.log("Form submission (template):", data);
    form.reset();
  });
}

handleFakeSubmit(contactForm, formStatus);
handleFakeSubmit(quoteForm, null);
