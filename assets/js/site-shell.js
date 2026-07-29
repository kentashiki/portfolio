const PRIMARY_NAV_ITEMS = [
  { key: "home", label: "Home", href: "" },
  { key: "about", label: "About", href: "about/" },
  { key: "news", label: "News", href: "news/" },
  { key: "work", label: "Work", href: "work/" },
  { key: "outputs", label: "Outputs", href: "outputs/" },
  { key: "awards", label: "Awards", href: "awards/" },
  { key: "contact", label: "Contact", href: "#contact" },
];

const FOOTER_LINKS = [
  { key: "home", label: "Home", href: "" },
  { key: "about", label: "About", href: "about/" },
  { key: "news", label: "News", href: "news/" },
  { key: "work", label: "Work", href: "work/" },
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

function buildHomePath(root, locale) {
  if (locale === "ja") {
    return `${root}ja/`;
  }

  return root || "./";
}

function buildContactPath(root, locale) {
  if (locale === "ja") {
    return `${root}ja/index.html#contact`;
  }

  return root ? `${root}index.html#contact` : "#contact";
}

function getLanguagePath(root, locale) {
  const { pathname, search, hash } = window.location;
  const siteRootPath = new URL(root || "./", window.location.href).pathname;
  const relativePath = pathname.startsWith(siteRootPath)
    ? pathname.slice(siteRootPath.length)
    : pathname.replace(/^\//, "");
  const targetRelativePath = locale === "ja"
    ? relativePath.replace(/^ja\/?/, "")
    : `ja/${relativePath}`;
  const targetPath = `${siteRootPath}${targetRelativePath}`.replace(/\/\/{2,}/g, "/");

  return `${targetPath}${search}${hash}`;
}

function renderLanguageSwitch(locale, variant = "desktop") {
  const isJapanese = locale === "ja";
  const mobileTargetLabel = isJapanese ? "English" : "日本語";
  const targetLocale = isJapanese ? "en" : "ja";
  const targetPath = getLanguagePath(document.body.dataset.root || "", locale);

  if (variant === "mobile") {
    const ariaLabel = isJapanese
      ? "言語を英語に切り替える"
      : "Switch language to Japanese";

    return `
      <a
        class="language-switch language-switch--mobile"
        href="${targetPath}"
        lang="${targetLocale}"
        aria-label="${ariaLabel}"
      >${mobileTargetLabel}</a>
    `;
  }

  const englishOption = isJapanese
    ? `<a href="${targetPath}" lang="en">English</a>`
    : `<span class="language-switch__current" lang="en" aria-current="true">English</span>`;
  const japaneseOption = isJapanese
    ? `<span class="language-switch__current" lang="ja" aria-current="true">日本語</span>`
    : `<a href="${targetPath}" lang="ja">日本語</a>`;

  return `
    <div class="language-switch language-switch--desktop" aria-label="Language selector">
      ${englishOption}
      <span class="language-switch__separator" aria-hidden="true">/</span>
      ${japaneseOption}
    </div>
  `;
}

function resolveNavHref(root, href, locale) {
  if (href === "#contact") {
    return buildContactPath(root, locale);
  }

  if (!href) {
    return buildHomePath(root, locale);
  }

  return buildSectionPath(root, locale === "ja" ? `ja/${href}` : href);
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

  if (currentSection === "work" || pageKey === "work" || pageKey === "focuspeed") {
    activeKeys.add("work");
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

      return `<li class="nav-item"><a href="${resolveNavHref(root, item.href, locale)}"${currentAttr}>${item.label}</a></li>`;
    })
    .join("");

  return `
    <header class="site-header">
      <div class="logo">
        <a href="${buildHomePath(root, locale)}">
          <span class="logo-name">Kenta Shiki</span>
        </a>
      </div>
      ${renderLanguageSwitch(locale, "mobile")}
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
        ${renderLanguageSwitch(locale, "desktop")}
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

      return `<a href="${resolveNavHref(root, href, locale)}"${currentAttr}>${label}</a>`;
    })
    .join("");

  return `
    <footer>
      <div class="footer-left">
        <div>&copy; ${year} Kenta Shiki. All rights reserved.</div>
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
