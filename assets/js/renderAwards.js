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

function renderNames(names = [], equalContributionCount = 0, className = "award-card-recipients") {
  if (!names.length) {
    return "";
  }

  const markup = names
    .map((name, index) => {
      const marker = index < equalContributionCount
        ? '<span class="equal-contribution-marker" aria-hidden="true">*</span>'
        : "";

      if (name === "Kenta Shiki") {
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

function getAwardPrimaryLink(links = {}, root) {
  const priority = ["projectDetail", "page", "conference", "pdf", "demo", "github", "doi"];

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

function getAwardLinks(links = {}, root) {
  const labels = {
    conference: "Conference site",
    pdf: "View paper",
    poster: "View poster",
    demo: "Live demo",
    github: "GitHub",
    doi: "DOI",
  };

  return Object.entries(links)
    .filter(([, href]) => href)
    .map(([key, href]) => {
      const resolvedHref = resolveUrl(root, href);
      const sameDocument = isSameDocumentUrl(resolvedHref);
      const isPdf = key === "pdf";

      return {
        key,
        href: resolvedHref,
        label: labels[key] || humanizeSlug(key),
        external: /^https?:\/\//.test(href) || isPdf,
        sameDocument,
      };
    })
    .filter((link) => !link.sameDocument && link.key !== "page" && link.key !== "projectDetail");
}

export function renderAwardCard(award, root) {
  const tags = (award.tags || [])
    .map(
      (tag) =>
        `<span class="research-tag" data-tag="${escapeHtml(toTagKey(tag))}">${escapeHtml(tag)}</span>`
    )
    .join("");
  const primaryLink = getAwardPrimaryLink(award.links, root);
  const awardLinks = getAwardLinks(award.links, root);
  const cardHref = primaryLink && !isSameDocumentUrl(primaryLink.href) ? primaryLink.href : "";
  const title = `<h3 class="output-card-title">${escapeHtml(award.title)}</h3>`;

  return `
    <article
      id="award-${escapeHtml(award.slug)}"
      class="award-card${cardHref ? " output-card--interactive" : ""}"
      ${cardHref ? `data-card-href="${escapeHtml(cardHref)}"` : ""}
      ${cardHref ? 'tabindex="0" role="link"' : ""}
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
                .map(
                  (link) => `
                    <a class="output-link" href="${escapeHtml(link.href)}"${
                      link.external ? ' target="_blank" rel="noopener noreferrer"' : ""
                    }>
                      ${escapeHtml(link.label)}
                    </a>
                  `
                )
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

  initClickableCards(container, ".output-card--interactive");
}

function initClickableCards(container, selector) {
  const cards = container.querySelectorAll(selector);

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) {
        return;
      }

      const href = card.dataset.cardHref;
      if (href) {
        window.location.href = href;
      }
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      const href = card.dataset.cardHref;
      if (href) {
        window.location.href = href;
      }
    });
  });
}
