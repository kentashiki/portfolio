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

function formatTypeLabel(value, locale = "en") {
  if (value === "publication") {
    return locale === "ja" ? "論文" : "Publications";
  }

  if (value === "presentation") {
    return locale === "ja" ? "発表" : "Presentations";
  }

  if (value === "webapp") {
    return locale === "ja" ? "ウェブアプリ" : "Web App";
  }

  return humanizeSlug(value);
}

function getOutputLinks(links = {}, root, locale = "en", showProjectLink = false) {
  return Object.entries(links)
    .filter(([, href]) => href)
    .map(([key, href]) => {
      const resolvedHref = resolveUrl(root, href);
      const sameDocument = isSameDocumentUrl(resolvedHref);
      const isDocument = key === "paper" || key === "pdf" || key === "poster";

      return {
        key,
        href: resolvedHref,
        label: getLinkActionLabel(key, locale),
        external: /^https?:\/\//.test(href) || isDocument,
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

function renderAuthors(authors = [], equalContributionCount = 0) {
  if (!authors.length) {
    return "";
  }

  const markup = authors
    .map((author, index) => {
      const isEqualContribution = index < equalContributionCount;
      const marker = isEqualContribution
        ? '<span class="equal-contribution-marker" aria-hidden="true">*</span>'
        : "";

      if (author === "Kenta Shiki" || author === "志貴 健太") {
        return `<span class="author-highlight">${escapeHtml(author)}${marker}</span>`;
      }

      return `${escapeHtml(author)}${marker}`;
    })
    .join(", ");

  const note = equalContributionCount > 0
    ? '<span class="equal-contribution-note">*Equal contribution</span>'
    : "";

  return `<p class="output-card-authors">${markup}${note}</p>`;
}

export function renderOutputCard(output, root, options = {}) {
  const { locale = "en", showProjectLink = false } = options;
  const tags = (output.tags || [])
    .map((tag) => {
      const label = typeof tag === "object" && tag !== null ? tag.label : tag;
      const key = typeof tag === "object" && tag !== null ? tag.key : tag;

      return `<span class="research-tag" data-tag="${escapeHtml(toTagKey(key))}">${escapeHtml(label)}</span>`;
    })
    .join("");
  const venue = output.venue
    ? `<p class="output-card-venue">${escapeHtml(output.venue)}</p>`
    : "";
  const description = output.description
    ? `<p class="output-card-description">${escapeHtml(output.description)}</p>`
    : "";
  const outputLinks = getOutputLinks(output.links, root, locale, showProjectLink);
  const title = `<h3 class="output-card-title">${escapeHtml(output.title)}</h3>`;

  return `
    <article
      id="output-${escapeHtml(output.slug)}"
      class="output-card"
    >
      ${title}
      ${renderAuthors(output.authors, output.equalContributionCount)}
      ${venue}
      ${description}
      <div class="output-card-tags">${tags}</div>
      ${
        outputLinks.length
          ? `
            <div class="output-card-links">
              ${outputLinks
                .map((link) => renderLinkAction(link))
                .join("")}
            </div>
          `
          : ""
      }
    </article>
  `;
}

const OUTPUT_AXES = [
  { key: "type", label: "Type" },
  { key: "year", label: "Year" },
  { key: "region", label: "Region" },
];

const JA_OUTPUT_AXES = [
  { key: "type", label: "種別" },
  { key: "year", label: "年" },
  { key: "region", label: "地域" },
];

const TYPE_ORDER = [
  "publication",
  "presentation",
  "webapp",
];

const REGION_ORDER = ["international", "domestic", "not-region-specific"];

function getAxisValues(output, axis) {
  if (axis === "type") {
    return output.type ? [output.type] : [];
  }

  if (axis === "year") {
    return output.year ? [String(output.year)] : [];
  }

  if (axis === "region") {
    return [output.region || "not-region-specific"];
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
    if (axis === "year") {
      return Number(b.value) - Number(a.value);
    }

    if (axis === "type") {
      const aIndex = TYPE_ORDER.indexOf(a.value);
      const bIndex = TYPE_ORDER.indexOf(b.value);
      const safeA = aIndex === -1 ? TYPE_ORDER.length : aIndex;
      const safeB = bIndex === -1 ? TYPE_ORDER.length : bIndex;
      if (safeA !== safeB) {
        return safeA - safeB;
      }
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

function renderOutputSection({ items, label }, { root, locale }) {
  return `
      <section class="output-subsection">
        <h2 class="output-subsection-title">${escapeHtml(label)}</h2>
        <div class="outputs-grid">
          ${items
            .slice()
            .sort((a, b) => Number(b.year || 0) - Number(a.year || 0) || a.title.localeCompare(b.title))
            .map((item) => renderOutputCard(item, root, { locale, showProjectLink: true }))
            .join("")}
        </div>
      </section>
    `;
}

export function renderOutputs(container, outputs, options = {}) {
  const { root = "", defaultAxis = "type", locale = "en" } = options;
  const sorted = sortByYearThenTitle([...outputs]);

  createGroupedAxisView({
    container,
    items: sorted,
    root,
    defaultAxis,
    axes: locale === "ja" ? JA_OUTPUT_AXES : OUTPUT_AXES,
    toolbarLabel: locale === "ja" ? "成果物の分類方法を選択" : "Choose how to organize outputs",
    getAxisValues,
    sortEntries: (axis, entries) => sortGroupEntries(axis, entries, locale),
    formatAxisValue: (axis, value) => formatAxisValue(axis, value, locale),
    renderSection: (entry, context) => renderOutputSection(entry, { ...context, locale }),
  });
}
