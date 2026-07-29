import {
  escapeHtml,
  humanizeSlug,
  isSameDocumentUrl,
  resolveUrl,
  sortByYearThenTitle,
  toTagKey,
} from "./utils/content.js";
import { createGroupedAxisView } from "./utils/grouped-axis-view.js";
import { getLinkActionLabel, renderLinkAction } from "./utils/link-actions.js?v=20260728b";

const AWARD_AXES = [
  { key: "type", label: "Type" },
  { key: "year", label: "Year" },
  { key: "region", label: "Region" },
];

const JA_AWARD_AXES = [
  { key: "type", label: "種別" },
  { key: "year", label: "年" },
  { key: "region", label: "地域" },
];

const REGION_ORDER = ["international", "domestic", "not-region-specific"];
const AWARD_TYPE_ORDER = ["competition-award"];

function formatTypeLabel(value, locale = "en") {
  if (value === "competition-award") {
    return locale === "ja" ? "コンテスト受賞" : "Competition Award";
  }

  return humanizeSlug(value);
}

function renderNames(names = [], equalContributionCount = 0, className = "award-card-recipients") {
  if (!names.length) {
    return "";
  }

  const markup = names
    .map((name, index) => {
      const marker = index < equalContributionCount
        ? '<span class="equal-contribution-marker" aria-hidden="true">*</span>'
        : "";

      if (name === "Kenta Shiki" || name === "志貴 健太") {
        return `<span class="author-highlight">${escapeHtml(name)}${marker}</span>`;
      }

      return `${escapeHtml(name)}${marker}`;
    })
    .join(", ");

  const note = equalContributionCount > 0
    ? '<span class="equal-contribution-note">*Equal contribution</span>'
    : "";

  return `<p class="${escapeHtml(className)}">${markup}${note}</p>`;
}

function getAwardLinks(links = {}, root, locale = "en", showProjectLink = false) {
  return Object.entries(links)
    .filter(([, href]) => href)
    .map(([key, href]) => {
      const resolvedHref = resolveUrl(root, href);
      const sameDocument = isSameDocumentUrl(resolvedHref);
      const isPdf = key === "pdf";

      return {
        key,
        href: resolvedHref,
        label: getLinkActionLabel(key, locale),
        external: /^https?:\/\//.test(href) || isPdf,
        sameDocument,
      };
    })
    .filter(
      (link) =>
        !link.sameDocument &&
        link.key !== "page" &&
        (showProjectLink || link.key !== "projectDetail")
    );
}

export function renderAwardCard(award, root, options = {}) {
  const { locale = "en", showProjectLink = false } = options;
  const tags = (award.tags || [])
    .map((tag) => {
      const label = typeof tag === "object" && tag !== null ? tag.label : tag;
      const key = typeof tag === "object" && tag !== null ? tag.key : tag;

      return `<span class="research-tag" data-tag="${escapeHtml(toTagKey(key))}">${escapeHtml(label)}</span>`;
    })
    .join("");
  const awardLinks = getAwardLinks(award.links, root, locale, showProjectLink);
  const title = `<h3 class="output-card-title">${escapeHtml(award.title)}</h3>`;

  return `
    <article
      id="award-${escapeHtml(award.slug)}"
      class="award-card"
    >
      ${title}
      <p class="award-card-issuer">${escapeHtml(award.issuer)}</p>
      ${renderNames(award.recipients, award.equalContributionCount)}
      <div class="award-card-tags">${tags}</div>
      ${
        awardLinks.length
          ? `
            <div class="award-card-links">
              ${awardLinks
                .map((link) => renderLinkAction(link))
                .join("")}
            </div>
          `
          : ""
      }
    </article>
  `;
}

function getAxisValues(award, axis) {
  if (axis === "type") {
    return award.type ? [award.type] : [];
  }

  if (axis === "year") {
    return award.year ? [String(award.year)] : [];
  }

  if (axis === "region") {
    return [award.region || "not-region-specific"];
  }

  return [];
}

function formatAxisValue(axis, value, locale = "en") {
  if (axis === "type") {
    return formatTypeLabel(value, locale);
  }

  if (axis === "region") {
    if (value === "domestic") {
      return locale === "ja" ? "国内（日本）" : "Domestic (Japan)";
    }

    if (value === "international") {
      return locale === "ja" ? "国際" : "International";
    }

    if (value === "not-region-specific") {
      return locale === "ja" ? "地域区分なし" : "Not region-specific";
    }
  }

  return value;
}

function sortGroupEntries(axis, entries, locale = "en") {
  return entries.sort((a, b) => {
    if (axis === "type") {
      const aIndex = AWARD_TYPE_ORDER.indexOf(a.value);
      const bIndex = AWARD_TYPE_ORDER.indexOf(b.value);
      const safeA = aIndex === -1 ? AWARD_TYPE_ORDER.length : aIndex;
      const safeB = bIndex === -1 ? AWARD_TYPE_ORDER.length : bIndex;
      if (safeA !== safeB) {
        return safeA - safeB;
      }
    }

    if (axis === "year") {
      return Number(b.value) - Number(a.value);
    }

    if (axis === "region") {
      const aIndex = REGION_ORDER.indexOf(a.value);
      const bIndex = REGION_ORDER.indexOf(b.value);
      const safeA = aIndex === -1 ? REGION_ORDER.length : aIndex;
      const safeB = bIndex === -1 ? REGION_ORDER.length : bIndex;
      if (safeA !== safeB) {
        return safeA - safeB;
      }
    }

    return formatAxisValue(axis, a.value, locale).localeCompare(formatAxisValue(axis, b.value, locale));
  });
}

function renderAwardSection({ label, items }, { root, locale }) {
  return `
    <section class="output-subsection">
      <h2 class="output-subsection-title">${escapeHtml(label)}</h2>
      <div class="awards-list">
        ${items
          .slice()
          .sort((a, b) => Number(b.year || 0) - Number(a.year || 0) || a.title.localeCompare(b.title))
          .map((award) => renderAwardCard(award, root, { locale, showProjectLink: true }))
          .join("")}
      </div>
    </section>
  `;
}

export function renderAwards(container, awards, options = {}) {
  const { root = "", defaultAxis = "type", locale = "en" } = options;
  const items = sortByYearThenTitle([...awards]);

  createGroupedAxisView({
    container,
    items,
    root,
    locale,
    defaultAxis,
    axes: locale === "ja" ? JA_AWARD_AXES : AWARD_AXES,
    toolbarLabel: locale === "ja" ? "受賞歴の分類方法を選択" : "Choose how to organize awards",
    getAxisValues,
    sortEntries: (axis, entries) => sortGroupEntries(axis, entries, locale),
    formatAxisValue: (axis, value) => formatAxisValue(axis, value, locale),
    renderSection: (entry, context) => renderAwardSection(entry, { ...context, locale }),
  });
}
