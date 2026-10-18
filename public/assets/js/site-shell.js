const PRIMARY_NAV_ITEMS = [
  { key: "about", label: "About", href: "about/" },
  { key: "news", label: "News", href: "news/" },
  { key: "work", label: "Work", href: "work/" },
  { key: "outputs", label: "Outputs", href: "outputs/" },
  { key: "awards", label: "Awards", href: "awards/" },
  { key: "contact", label: "Contact", href: "contact/" },
];

function buildSectionPath(root, href) {
  return `${root}${href}`;
}

function buildHomePath(root, locale) {
  if (locale === "ja") {
    return `${root}ja/`;
  }

  return root || "./";
}

function getLanguagePath(root, locale) {
  const { pathname, search, hash } = window.location;
  const siteRootPath = new URL(root || "./", window.location.href).pathname;
  const relativePath = pathname.startsWith(siteRootPath)
    ? pathname.slice(siteRootPath.length)
    : pathname.replace(/^\//, "");
  if (locale !== "ja" && relativePath === "about/history.html") {
    return `${siteRootPath}ja/about/${search}#background`;
  }
  const targetRelativePath = locale === "ja"
    ? relativePath.replace(/^ja\/?/, "")
    : `ja/${relativePath}`;
  const targetPath = `${siteRootPath}${targetRelativePath}`.replace(/\/\/{2,}/g, "/");

  return `${targetPath}${search}${hash}`;
}

function renderLanguageSwitch(locale, variant = "desktop") {
  const isJapanese = locale === "ja";
  const mobileTargetLabel = isJapanese ? "EN" : "JP";
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
    ? `<a href="${targetPath}" lang="en" aria-label="言語を英語に切り替える">EN</a>`
    : `<span class="language-switch__current" lang="en" aria-current="true">EN</span>`;
  const japaneseOption = isJapanese
    ? `<span class="language-switch__current" lang="ja" aria-current="true">JP</span>`
    : `<a href="${targetPath}" lang="ja" aria-label="Switch language to Japanese">JP</a>`;

  return `
    <div class="language-switch language-switch--desktop" aria-label="Language selector">
      ${englishOption}
      <span class="language-switch__separator" aria-hidden="true">/</span>
      ${japaneseOption}
    </div>
  `;
}

function resolveNavHref(root, href, locale) {
  if (!href) {
    return buildHomePath(root, locale);
  }

  return buildSectionPath(root, locale === "ja" ? `ja/${href}` : href);
}

function getActiveNavKeys(currentSection, pageKey) {
  const activeKeys = new Set();

  if (currentSection === "home") {
    activeKeys.add("home");
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

  if (currentSection === "contact") {
    activeKeys.add("contact");
  }

  return activeKeys;
}

function renderHeader(root, currentSection, locale, pageKey) {
  const activeKeys = getActiveNavKeys(currentSection, pageKey);
  const menuLabel = locale === "ja" ? "ナビゲーションメニューを開閉" : "Toggle navigation menu";

  const navMarkup = PRIMARY_NAV_ITEMS
    .map((item) => {
      const currentAttr = activeKeys.has(item.key) ? ' aria-current="page"' : "";

      return `<li class="nav-item"><a href="${resolveNavHref(root, item.href, locale)}"${currentAttr}>${item.label}</a></li>`;
    })
    .join("");

  return `
    <a class="skip-link" href="#main-content">${locale === "ja" ? "本文へ移動" : "Skip to content"}</a>
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
        aria-controls="primary-navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div class="header-controls">
        <nav id="primary-navigation" aria-label="${locale === "ja" ? "メインナビゲーション" : "Main navigation"}">
          <ul class="nav-list">${navMarkup}</ul>
        </nav>
        ${renderLanguageSwitch(locale, "desktop")}
      </div>
    </header>
  `;
}

function renderFooter(root, locale) {
  const year = new Date().getFullYear();
  return `
    <footer class="site-footer">
      <a href="${buildHomePath(root, locale)}">Kenta Shiki</a>
      <small>&copy; ${year} Kenta Shiki. All rights reserved.</small>
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
    footerMount.outerHTML = renderFooter(root, locale);
  }
});
