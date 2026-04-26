import { escapeHtml, resolveUrl, toTagKey } from "./utils/content.js";

function formatDate(dateString) {
  return dateString.replace(/-/g, ".");
}

function renderSummaryContent(summary, root) {
  if (!summary) {
    return "";
  }

  if (Array.isArray(summary)) {
    return summary
      .map((part) => {
        if (typeof part === "string") {
          return escapeHtml(part);
        }

        const href = resolveUrl(root, part.href || "");
        const external = /^https?:\/\//.test(part.href || "");
        return `<a href="${escapeHtml(href)}"${
          external ? ' target="_blank" rel="noopener noreferrer"' : ""
        }>${escapeHtml(part.text || "")}</a>`;
      })
      .join("");
  }

  return escapeHtml(summary);
}

function renderTags(tags = []) {
  if (!tags.length) {
    return "";
  }

  return `
    <div class="news-tags">
      ${tags
        .map(
          (tag) =>
            `<span class="update-tag" data-tag="${escapeHtml(toTagKey(tag))}">${escapeHtml(tag)}</span>`
        )
        .join("")}
    </div>
  `;
}

function renderNewsItem(item, root, detailed = false, summaryMode = "full") {
  const showSummary = detailed || summaryMode === "full";
  const showTags = detailed || summaryMode === "full";
  const summary = showSummary && item.summary
    ? `<p class="${detailed ? "update-description" : "news-summary"}">${renderSummaryContent(item.summary, root)}</p>`
    : "";

  if (detailed) {
    return `
      <article class="update-item">
        <div class="update-date">${escapeHtml(formatDate(item.date))}</div>
        <div class="update-content">
          <h3 class="update-title">${escapeHtml(item.title)}</h3>
          ${summary}
          ${showTags ? renderTags(item.tags) : ""}
        </div>
      </article>
    `;
  }

  return `
    <article class="news-item">
      <div class="news-date">${escapeHtml(formatDate(item.date))}</div>
      <div class="news-content">
        <h3>${escapeHtml(item.title)}</h3>
        ${summary}
        ${showTags ? renderTags(item.tags) : ""}
      </div>
    </article>
  `;
}

function getPageFromUrl(totalPages) {
  const params = new URLSearchParams(window.location.search);
  const page = Number.parseInt(params.get("page") || "1", 10);

  if (Number.isNaN(page)) {
    return 1;
  }

  return Math.min(Math.max(page, 1), totalPages);
}

function renderPagination(currentPage, totalPages) {
  if (totalPages <= 1) {
    return "";
  }

  return `
    <nav class="updates-pagination" aria-label="News pagination">
      ${Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return `
          <button
            class="updates-page-button${page === currentPage ? " is-active" : ""}"
            type="button"
            data-page="${page}"
            ${page === currentPage ? 'aria-current="page"' : ""}
          >
            ${page}
          </button>
        `;
      }).join("")}
    </nav>
  `;
}

export function renderNews(container, newsItems, options = {}) {
  if (!container) {
    return;
  }

  const {
    latest = false,
    limit,
    root = "",
    title = "News",
    showViewAll = false,
    detailed = false,
    summaryMode = "full",
    showHeader = true,
    pageSize,
  } = options;

  let items = [...newsItems].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (latest || typeof limit === "number") {
    items = items.slice(0, limit || items.length);
  }

  const paginationEnabled = typeof pageSize === "number" && pageSize > 0;
  const totalPages = paginationEnabled ? Math.max(1, Math.ceil(items.length / pageSize)) : 1;
  const currentPage = paginationEnabled ? getPageFromUrl(totalPages) : 1;
  const pageStart = (currentPage - 1) * (pageSize || items.length);
  const visibleItems = paginationEnabled ? items.slice(pageStart, pageStart + pageSize) : items;
  const bodyClass = detailed ? "updates-container" : "news-container";
  const listClass = detailed ? "updates-timeline" : "news-list";
  const viewAll = showViewAll
    ? `<a href="${escapeHtml(resolveUrl(root, "news/"))}" class="section-inline-link">View all news →</a>`
    : "";

  container.innerHTML = `
    ${showHeader ? `
      <div class="section-heading">
        <h2>${escapeHtml(title)}</h2>
        ${viewAll}
      </div>
    ` : ""}
    <div class="${bodyClass}">
      <div class="${listClass}">
        ${visibleItems.map((item) => renderNewsItem(item, root, detailed, summaryMode)).join("")}
      </div>
      ${paginationEnabled ? renderPagination(currentPage, totalPages) : ""}
    </div>
  `;

  container.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextPage = Number.parseInt(button.dataset.page || "1", 10);
      const url = new URL(window.location.href);

      if (nextPage <= 1) {
        url.searchParams.delete("page");
      } else {
        url.searchParams.set("page", String(nextPage));
      }

      window.history.pushState({}, "", url);
      renderNews(container, newsItems, options);
      container.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  if (paginationEnabled && !container.dataset.paginationBound) {
    window.addEventListener("popstate", () => {
      renderNews(container, newsItems, options);
    });
    container.dataset.paginationBound = "true";
  }
}
