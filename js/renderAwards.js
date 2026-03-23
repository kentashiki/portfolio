import {
  escapeHtml,
  humanizeSlug,
  isSameDocumentUrl,
  resolveUrl,
  sortByYearThenTitle,
  toTagKey,
} from "./utils/content.js";
import { createGroupedAxisView } from "./utils/grouped-axis-view.js";

const AWARD_AXES = [
  { key: "type", label: "Type" },
  { key: "year", label: "Year" },
  { key: "region", label: "Region" },
];

const REGION_ORDER = ["international", "domestic", "not-region-specific"];
const AWARD_TYPE_ORDER = ["student-contest"];

function formatTypeLabel(value) {
  if (value === "student-contest") {
    return "Student Contest";
  }

  return humanizeSlug(value);
}

function renderAwardCard(award, root) {
  const tags = (award.tags || [])
    .map(
      (tag) =>
        `<span class="research-tag" data-tag="${escapeHtml(toTagKey(tag))}">${escapeHtml(tag)}</span>`
    )
    .join("");
  const primaryHref = award.links?.page ? resolveUrl(root, award.links.page) : "";
  const cardInner = `
    <article id="award-${escapeHtml(award.slug)}" class="award-card">
      <h3 class="output-card-title">${escapeHtml(award.title)}</h3>
      <p class="award-card-issuer">${escapeHtml(award.issuer)}</p>
      <div class="award-card-tags">${tags}</div>
    </article>
  `;

  if (!primaryHref) {
    return cardInner;
  }

  if (isSameDocumentUrl(primaryHref)) {
    return cardInner;
  }

  return `
    <a class="output-card-link" href="${escapeHtml(primaryHref)}">
      ${cardInner}
    </a>
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

    return formatAxisValue(axis, a.value).localeCompare(formatAxisValue(axis, b.value));
  });
}

function renderAwardSection({ label, items }, { root }) {
  return `
    <section class="output-subsection">
      <h2 class="output-subsection-title">${escapeHtml(label)}</h2>
      <div class="awards-list">
        ${items
          .slice()
          .sort((a, b) => Number(b.year || 0) - Number(a.year || 0) || a.title.localeCompare(b.title))
          .map((award) => renderAwardCard(award, root))
          .join("")}
      </div>
    </section>
  `;
}

export function renderAwards(container, awards, options = {}) {
  const { root = "", defaultAxis = "type" } = options;
  const items = sortByYearThenTitle([...awards]);

  createGroupedAxisView({
    container,
    items,
    root,
    defaultAxis,
    axes: AWARD_AXES,
    toolbarLabel: "Choose how to organize awards",
    getAxisValues,
    sortEntries: sortGroupEntries,
    formatAxisValue,
    renderSection: renderAwardSection,
  });
}
