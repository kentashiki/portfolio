document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = header ? header.querySelector('nav') : null;
  const navLinks = document.querySelectorAll('header nav a');
  const submenuGroups = header ? header.querySelectorAll('.nav-item--group') : [];
  const desktopQuery = window.matchMedia('(min-width: 769px)');

  if (!header || !toggle || !nav) return;

  const closeSubmenus = (exceptGroup = null) => {
    submenuGroups.forEach((group) => {
      const button = group.querySelector('.nav-submenu-toggle');
      if (!button || group === exceptGroup) return;
      group.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    });
  };

  const closeMenu = () => {
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    closeSubmenus();
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

  submenuGroups.forEach((group) => {
    const button = group.querySelector('.nav-submenu-toggle');
    if (!button) return;

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!desktopQuery.matches) return;

      const willOpen = !group.classList.contains('is-open');
      closeSubmenus(group);
      group.classList.toggle('is-open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
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

    if (desktopQuery.matches && !event.target.closest('.nav-item--group')) {
      closeSubmenus();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSubmenus();

      if (header.classList.contains('nav-open')) {
        closeMenu();
      }
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && header.classList.contains('nav-open')) {
      closeMenu();
    }

    if (!desktopQuery.matches) {
      closeSubmenus();
    }
  });
});
