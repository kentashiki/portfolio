const SITE_LINKS = [
  { key: "profile", label: "Profile", href: "profile/" },
  { key: "projects", label: "Projects", href: "projects/" },
  { key: "works", label: "Works", href: "works/" },
  { key: "updates", label: "Updates", href: "updates/" },
];

const PAGE_PATHS = {
  home: "",
  profile: "profile/",
  history: "profile/history.html",
  projects: "projects/",
  focuspeed: "projects/focuspeed/",
  works: "works/",
  updates: "updates/",
};

function buildSectionPath(root, locale, href) {
  const localePrefix = locale === "ja" ? "jp/" : "";
  return `${root}${localePrefix}${href}`;
}

function buildAssetPath(root, href) {
  return `${root}${href}`;
}

function buildHomePath(root, locale) {
  const localePrefix = locale === "ja" ? "jp/" : "";
  return `${root}${localePrefix}` || "./";
}

function buildContactPath(root, locale) {
  if (locale === "ja") {
    return `${root}jp/index.html#contact`;
  }

  return root ? `${root}index.html#contact` : "#contact";
}

function buildLanguagePath(root, locale, pageKey) {
  const pagePath = PAGE_PATHS[pageKey] || "";
  const localePrefix = locale === "ja" ? "jp/" : "";

  if (!pagePath) {
    return `${root}${localePrefix}` || "./";
  }

  return `${root}${localePrefix}${pagePath}`;
}

function renderHeader(root, currentSection, locale, pageKey) {
  const navItems = [
    ...SITE_LINKS,
    { key: "contact", label: "Contact", href: buildContactPath(root, locale) },
  ];
  const switchTargets = {
    en: buildLanguagePath(root, "en", pageKey),
    ja: buildLanguagePath(root, "ja", pageKey),
  };
  const menuLabel =
    locale === "ja" ? "ナビゲーションメニューを開閉" : "Toggle navigation menu";

  const navMarkup = navItems
    .map(({ key, label, href }) => {
      const isCurrent = key === currentSection;
      const resolvedHref =
        key === "contact" ? href : buildSectionPath(root, locale, href);
      const currentAttr = isCurrent ? ' aria-current="page"' : "";

      return `<li><a href="${resolvedHref}"${currentAttr}>${label}</a></li>`;
    })
    .join("");

  return `
    <header class="site-header">
      <div class="logo">
        <a href="${buildHomePath(root, locale)}">
          <img src="${buildAssetPath(root, "assets/images/favicon.png")}" alt="Kenta Shiki Logo" />
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
          <ul>${navMarkup}</ul>
        </nav>
        <div class="lang-switch" aria-label="Language switcher">
          <a href="${switchTargets.en}"${
            locale === "en" ? ' aria-current="page"' : ""
          }>EN</a>
          <span class="lang-divider">/</span>
          <a href="${switchTargets.ja}"${
            locale === "ja" ? ' aria-current="page"' : ""
          }>JP</a>
        </div>
      </div>
    </header>
  `;
}

function renderFooter(root, currentSection, locale) {
  const year = new Date().getFullYear();
  const footerItems = [
    ...SITE_LINKS,
    { key: "contact", label: "Contact", href: buildContactPath(root, locale) },
  ];

  const footerMarkup = footerItems
    .map(({ key, label, href }) => {
      const isCurrent = key === currentSection;
      const resolvedHref =
        key === "contact" ? href : buildSectionPath(root, locale, href);
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
  const locale = body.dataset.locale || "en";
  const pageKey = body.dataset.page || currentSection || "home";
  const headerMount = document.querySelector("[data-site-header]");
  const footerMount = document.querySelector("[data-site-footer]");

  if (headerMount) {
    headerMount.outerHTML = renderHeader(root, currentSection, locale, pageKey);
  }

  if (footerMount) {
    footerMount.outerHTML = renderFooter(root, currentSection, locale);
  }
});
