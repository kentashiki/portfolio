import { escapeHtml, humanizeSlug } from "./content.js";

const LINK_LABELS = {
  conference: "Official Site",
  officialSite: "Official Site",
  paper: "Paper",
  pdf: "Paper",
  poster: "Poster",
  video: "Video",
  demo: "Demo",
  github: "GitHub",
  doi: "DOI",
  page: "Details",
  projectDetail: "Project",
};

const JA_LINK_LABELS = {
  conference: "公式サイト",
  officialSite: "公式サイト",
  paper: "論文",
  pdf: "論文",
  poster: "ポスター",
  video: "動画",
  demo: "デモ",
  github: "GitHub",
  doi: "DOI",
  page: "詳細",
  projectDetail: "プロジェクト",
};

const LINK_ICONS = {
  conference: "external",
  officialSite: "external",
  paper: "fileText",
  pdf: "fileText",
  poster: "image",
  video: "play",
  demo: "monitor",
  github: "github",
  doi: "link",
  page: "arrow",
  projectDetail: "arrow",
};

const ICON_SVGS = {
  arrow: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path></svg>`,
  external: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>`,
  fileText: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><path d="M14 2v6h6"></path><path d="M8 13h8"></path><path d="M8 17h6"></path><path d="M8 9h2"></path></svg>`,
  github: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.1-1.3-.3-2.6-1.1-3.6.1-.4.5-1.8-.1-3.4 0 0-1-.3-3.5 1.3a12.2 12.2 0 0 0-6.3 0C6.5 1.7 5.5 2 5.5 2c-.6 1.6-.2 3-.1 3.4A5.2 5.2 0 0 0 4.3 9c0 3.5 3 5.5 6 5.5a4.8 4.8 0 0 0-1 3.5v4"></path><path d="M9 18c-4.5 2-5-2-7-2"></path></svg>`,
  image: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"></path></svg>`,
  link: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10 13a5 5 0 0 0 7.1 0l2.8-2.8a5 5 0 0 0-7.1-7.1l-1.6 1.6"></path><path d="M14 11a5 5 0 0 0-7.1 0l-2.8 2.8a5 5 0 0 0 7.1 7.1l1.6-1.6"></path></svg>`,
  monitor: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="4" width="18" height="13" rx="2"></rect><path d="M8 21h8"></path><path d="M12 17v4"></path></svg>`,
  play: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="m10 9 5 3-5 3z"></path></svg>`,
};

export function getLinkActionLabel(key, locale = "en") {
  const labels = locale === "ja" ? JA_LINK_LABELS : LINK_LABELS;

  return labels[key] || LINK_LABELS[key] || humanizeSlug(key);
}

export function renderLinkAction({ className = "output-link", href, key, label, external = false }) {
  const iconName = LINK_ICONS[key] || "external";
  const classes = [className, "link-action", key ? `link-action--${key}` : ""].filter(Boolean).join(" ");

  return `
    <a class="${escapeHtml(classes)}" href="${escapeHtml(href)}"${
      external ? ' target="_blank" rel="noopener noreferrer"' : ""
    }>
      <span class="link-action__icon">${ICON_SVGS[iconName]}</span>
      <span class="link-action__label">${escapeHtml(label || getLinkActionLabel(key))}</span>
    </a>
  `;
}
