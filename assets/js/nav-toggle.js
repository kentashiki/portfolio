document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = header ? header.querySelector('nav') : null;
  const navLinks = document.querySelectorAll('header nav a');

  if (!header || !toggle || !nav) return;

  const closeMenu = () => {
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = header.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (header.classList.contains('nav-open')) {
        closeMenu();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (
      header.classList.contains('nav-open') &&
      !nav.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && header.classList.contains('nav-open')) {
      closeMenu();
    }
  });
});
