const SITE_LINKS = [
  { key: "profile", label: "Profile", href: "profile/" },
  { key: "projects", label: "Projects", href: "projects/" },
  { key: "works", label: "Works", href: "works/" },
  { key: "updates", label: "Updates", href: "updates/" },
];

function buildSitePath(root, href) {
  return `${root}${href}`;
}

function buildContactPath(root) {
  return root ? `${root}index.html#contact` : "#contact";
}

function renderHeader(root, currentSection) {
  const navItems = [
    ...SITE_LINKS,
    { key: "contact", label: "Contact", href: buildContactPath(root) },
  ];

  const navMarkup = navItems
    .map(({ key, label, href }) => {
      const isCurrent = key === currentSection;
      const resolvedHref = key === "contact" ? href : buildSitePath(root, href);
      const currentAttr = isCurrent ? ' aria-current="page"' : "";

      return `<li><a href="${resolvedHref}"${currentAttr}>${label}</a></li>`;
    })
    .join("");

  return `
    <header class="site-header">
      <div class="logo">
        <a href="${root || "./"}">
          <img src="${buildSitePath(root, "assets/images/favicon.png")}" alt="Kenta Shiki Logo" />
        </a>
      </div>
      <button
        class="nav-toggle"
        aria-label="ナビゲーションメニューを開閉"
        aria-expanded="false"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav>
        <ul>${navMarkup}</ul>
      </nav>
    </header>
  `;
}

function renderFooter(root, currentSection) {
  const year = new Date().getFullYear();
  const footerItems = [
    ...SITE_LINKS,
    { key: "contact", label: "Contact", href: buildContactPath(root) },
  ];

  const footerMarkup = footerItems
    .map(({ key, label, href }) => {
      const isCurrent = key === currentSection;
      const resolvedHref = key === "contact" ? href : buildSitePath(root, href);
      const currentAttr = isCurrent ? ' aria-current="page"' : "";

      return `<a href="${resolvedHref}"${currentAttr}>${label}</a>`;
    })
    .join("");

  return `
    <footer>
      <div class="footer-left">
        <div>&copy; ${year} Kenta Shiki. All rights reserved.</div>
        <div class="footer-credit">
          Website created with the assistance of Claude (Anthropic AI) and
          ChatGPT (OpenAI)
        </div>
      </div>
      <div class="footer-links">${footerMarkup}</div>
    </footer>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const { body } = document;
  const root = body.dataset.root || "";
  const currentSection = body.dataset.section || "";
  const headerMount = document.querySelector("[data-site-header]");
  const footerMount = document.querySelector("[data-site-footer]");

  if (headerMount) {
    headerMount.outerHTML = renderHeader(root, currentSection);
  }

  if (footerMount) {
    footerMount.outerHTML = renderFooter(root, currentSection);
  }
});
