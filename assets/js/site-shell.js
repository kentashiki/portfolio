const PRIMARY_NAV_ITEMS = [
  { key: "home", label: "Home", href: "" },
  { key: "about", label: "About", href: "about/" },
  { key: "news", label: "News", href: "news/" },
  { key: "projects", label: "Projects", href: "projects/" },
  { key: "outputs", label: "Outputs", href: "outputs/" },
  { key: "awards", label: "Awards", href: "awards/" },
  { key: "contact", label: "Contact", href: "#contact" },
];

const FOOTER_LINKS = [
  { key: "home", label: "Home", href: "" },
  { key: "about", label: "About", href: "about/" },
  { key: "news", label: "News", href: "news/" },
  { key: "projects", label: "Projects", href: "projects/" },
  { key: "outputs", label: "Outputs", href: "outputs/" },
  { key: "awards", label: "Awards", href: "awards/" },
  { key: "contact", label: "Contact", href: "#contact" },
];

function buildSectionPath(root, href) {
  return `${root}${href}`;
}

function buildAssetPath(root, href) {
  return `${root}${href}`;
}

function buildHomePath(root) {
  return root || "./";
}

function buildContactPath(root) {
  return root ? `${root}index.html#contact` : "#contact";
}

function resolveNavHref(root, href) {
  if (href === "#contact") {
    return buildContactPath(root);
  }

  if (!href) {
    return buildHomePath(root);
  }

  return buildSectionPath(root, href);
}

function getActiveNavKeys(currentSection, pageKey, hash) {
  const activeKeys = new Set();

  if (currentSection === "home") {
    activeKeys.add(hash === "#contact" ? "contact" : "home");
  }

  if (currentSection === "about" || pageKey === "history") {
    activeKeys.add("about");
  }

  if (currentSection === "news") {
    activeKeys.add("news");
  }

  if (pageKey === "projects" || pageKey === "focuspeed") {
    activeKeys.add("projects");
  }

  if (pageKey === "outputs") {
    activeKeys.add("outputs");
  }

  if (pageKey === "awards") {
    activeKeys.add("awards");
  }

  return activeKeys;
}

function renderHeader(root, currentSection, locale, pageKey, hash) {
  const activeKeys = getActiveNavKeys(currentSection, pageKey, hash);
  const menuLabel = "Toggle navigation menu";

  const navMarkup = PRIMARY_NAV_ITEMS
    .map((item) => {
      const currentAttr = activeKeys.has(item.key) ? ' aria-current="page"' : "";

      return `<li class="nav-item"><a href="${resolveNavHref(root, item.href)}"${currentAttr}>${item.label}</a></li>`;
    })
    .join("");

  return `
    <header class="site-header">
      <div class="logo">
        <a href="${buildHomePath(root)}">
          <img
            src="${buildAssetPath(root, "assets/images/favicon.png")}"
            alt="Kenta Shiki Logo"
          />
          <span class="logo-name">Kenta Shiki</span>
        </a>
      </div>
      <button
        class="nav-toggle"
        aria-label="${menuLabel}"
        aria-expanded="false"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div class="header-controls">
        <nav>
          <ul class="nav-list">${navMarkup}</ul>
        </nav>
      </div>
    </header>
  `;
}

function renderFooter(root, currentSection, locale, pageKey, hash) {
  const year = new Date().getFullYear();
  const activeKeys = getActiveNavKeys(currentSection, pageKey, hash);
  const footerMarkup = FOOTER_LINKS
    .map(({ key, label, href }) => {
      const currentAttr = activeKeys.has(key) ? ' aria-current="page"' : "";

      return `<a href="${resolveNavHref(root, href)}"${currentAttr}>${label}</a>`;
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
  const locale = body.dataset.locale || "en";
  const pageKey = body.dataset.page || currentSection || "home";
  const hash = window.location.hash;
  const headerMount = document.querySelector("[data-site-header]");
  const footerMount = document.querySelector("[data-site-footer]");

  if (headerMount) {
    headerMount.outerHTML = renderHeader(root, currentSection, locale, pageKey, hash);
  }

  if (footerMount) {
    footerMount.outerHTML = renderFooter(root, currentSection, locale, pageKey, hash);
  }
});
