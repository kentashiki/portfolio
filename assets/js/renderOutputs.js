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
  const priority = ["projectDetail", "page", "pdf", "demo", "github", "doi"];

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

function getOutputLinks(links = {}, root) {
  const labels = {
    pdf: "View paper",
    poster: "View poster",
    conference: "Conference site",
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

      if (author === "Kenta Shiki") {
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

export function renderOutputCard(output, root) {
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
  const outputLinks = getOutputLinks(output.links, root);
  const cardHref = primaryLink && !isSameDocumentUrl(primaryLink.href) ? primaryLink.href : "";
  const title = `<h3 class="output-card-title">${escapeHtml(output.title)}</h3>`;

  return `
    <article
      id="output-${escapeHtml(output.slug)}"
      class="output-card${cardHref ? " output-card--interactive" : ""}"
      ${cardHref ? `data-card-href="${escapeHtml(cardHref)}"` : ""}
      ${cardHref ? 'tabindex="0" role="link"' : ""}
    >
      ${title}
      ${renderAuthors(output.authors, output.equalContributionCount)}
      ${venue}
      <div class="output-card-tags">${tags}</div>
      ${
        outputLinks.length
          ? `
            <div class="output-card-links">
              ${outputLinks
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
