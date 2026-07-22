document.documentElement.classList.add('js-enabled');

const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const main = document.querySelector('main');
const footer = document.querySelector('footer');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const projectCards = [...document.querySelectorAll('[data-category]')];
const filterStatus = document.querySelector('[data-filter-status]');
let menuReturnFocus = null;
const mobileMenuBreakpoint = 960;
let mobileMenuActive = window.innerWidth <= mobileMenuBreakpoint;

document.querySelector('[data-year]').textContent = new Date().getFullYear();

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 18);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

function setMenu(open, restoreFocus = true) {
  const mobileMenu = window.innerWidth <= mobileMenuBreakpoint;
  open = open && mobileMenu;
  if (open) menuReturnFocus = document.activeElement;
  menuToggle.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
  nav.inert = mobileMenu && !open;
  document.body.style.overflow = open ? 'hidden' : '';
  main.inert = open;
  footer.inert = open;

  if (open) {
    window.setTimeout(() => nav.querySelector('a')?.focus(), 0);
  } else if (restoreFocus && menuReturnFocus instanceof HTMLElement) {
    menuReturnFocus.focus();
  }
}

menuToggle.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

nav.addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});

document.addEventListener('keydown', event => {
  const menuOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  if (event.key === 'Escape' && menuOpen) setMenu(false);

  if (event.key === 'Tab' && menuOpen) {
    const focusable = [menuToggle, ...nav.querySelectorAll('a')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

window.addEventListener('resize', () => {
  const nextMobileState = window.innerWidth <= mobileMenuBreakpoint;
  if (nextMobileState !== mobileMenuActive) {
    mobileMenuActive = nextMobileState;
    setMenu(false, false);
  }
});

setMenu(false, false);

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;

    filterButtons.forEach(candidate => {
      const active = candidate === button;
      candidate.classList.toggle('is-active', active);
      candidate.setAttribute('aria-pressed', String(active));
    });

    projectCards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      const visible = selected === 'all' || categories.includes(selected);
      card.classList.toggle('is-hidden', !visible);
    });

    const visibleCount = projectCards.filter(card => !card.classList.contains('is-hidden')).length;
    filterStatus.textContent = `${visibleCount} project${visibleCount === 1 ? '' : 's'} shown.`;
  });
});

filterButtons.forEach((button, index) => {
  button.setAttribute('aria-pressed', String(index === 0));
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = [...document.querySelectorAll('.reveal')];

if (!reducedMotion && 'IntersectionObserver' in window) {
  document.body.classList.add('reveal-ready');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  revealItems.forEach(item => observer.observe(item));
}
