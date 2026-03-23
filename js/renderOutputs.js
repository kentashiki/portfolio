import {
  escapeHtml,
  humanizeSlug,
  isSameDocumentUrl,
  resolveUrl,
  sortByYearThenTitle,
  toTagKey,
} from "./utils/content.js";
import { createGroupedAxisView } from "./utils/grouped-axis-view.js";

function formatTypeLabel(value) {
  if (value === "publication") {
    return "Publications";
  }

  if (value === "presentation") {
    return "Presentations";
  }

  if (value === "webapp") {
    return "Web App";
  }

  return humanizeSlug(value);
}

function getPrimaryLink(links = {}, root) {
  const priority = ["page", "pdf", "demo", "github", "doi"];

  for (const key of priority) {
    if (links[key]) {
      return {
        href: resolveUrl(root, links[key]),
        external: /^https?:\/\//.test(links[key]),
      };
    }
  }

  return null;
}

function renderAuthors(authors = []) {
  if (!authors.length) {
    return "";
  }

  const markup = authors
    .map((author) => {
      if (author === "Kenta Shiki") {
        return `<span class="author-highlight">${escapeHtml(author)}</span>`;
      }

      return escapeHtml(author);
    })
    .join(", ");

  return `<p class="output-card-authors">${markup}</p>`;
}

function renderOutputCard(output, root) {
  const tags = (output.tags || [])
    .map(
      (tag) =>
        `<span class="research-tag" data-tag="${escapeHtml(toTagKey(tag))}">${escapeHtml(tag)}</span>`
    )
    .join("");
  const venue = output.venue
    ? `<p class="output-card-venue">${escapeHtml(output.venue)}</p>`
    : "";
  const primaryLink = getPrimaryLink(output.links, root);
  const cardInner = `
    <article id="output-${escapeHtml(output.slug)}" class="output-card">
      <h3 class="output-card-title">${escapeHtml(output.title)}</h3>
      ${renderAuthors(output.authors)}
      ${venue}
      <div class="output-card-tags">${tags}</div>
    </article>
  `;

  if (!primaryLink) {
    return cardInner;
  }

  if (isSameDocumentUrl(primaryLink.href)) {
    return cardInner;
  }

  return `
    <a class="output-card-link" href="${escapeHtml(primaryLink.href)}"${
      primaryLink.external ? ' target="_blank" rel="noopener noreferrer"' : ""
    }>
      ${cardInner}
    </a>
  `;
}

const OUTPUT_AXES = [
  { key: "type", label: "Type" },
  { key: "region", label: "Region" },
  { key: "year", label: "Year" },
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

function formatAxisValue(axis, value) {
  if (axis === "type") {
    return formatTypeLabel(value);
  }

  if (axis === "region") {
    if (value === "domestic") {
      return "Domestic (Japan)";
    }

    if (value === "international") {
      return "International";
    }

    if (value === "not-region-specific") {
      return "Not region-specific";
    }
  }

  return value;
}

function sortGroupEntries(axis, entries) {
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

    return formatAxisValue(axis, a.value).localeCompare(formatAxisValue(axis, b.value));
  });
}

function renderOutputSection({ items, label }, { root }) {
  return `
      <section class="output-subsection">
        <h2 class="output-subsection-title">${escapeHtml(label)}</h2>
        <div class="outputs-grid">
          ${items
            .slice()
            .sort((a, b) => Number(b.year || 0) - Number(a.year || 0) || a.title.localeCompare(b.title))
            .map((item) => renderOutputCard(item, root))
            .join("")}
        </div>
      </section>
    `;
}

export function renderOutputs(container, outputs, options = {}) {
  const { root = "", defaultAxis = "type" } = options;
  const sorted = sortByYearThenTitle([...outputs]);

  createGroupedAxisView({
    container,
    items: sorted,
    root,
    defaultAxis,
    axes: OUTPUT_AXES,
    toolbarLabel: "Choose how to organize outputs",
    getAxisValues,
    sortEntries: sortGroupEntries,
    formatAxisValue,
    renderSection: renderOutputSection,
  });
}
