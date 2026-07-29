import { escapeHtml, resolveUrl, toTagKey } from "./utils/content.js";

function formatDate(dateString, locale = "en") {
  const [year, month, day] = String(dateString).split("-").map(Number);

  if (!year || !month || !day) {
    return String(dateString);
  }

  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
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

function renderTags(tags = [], limit) {
  if (!tags.length) {
    return "";
  }

  return `
    <div class="news-tags">
      ${tags
        .slice(0, limit)
        .map((tag) => {
          const label = typeof tag === "object" && tag !== null ? tag.label : tag;
          const key = typeof tag === "object" && tag !== null ? tag.key : tag;

          return `<span class="update-tag" data-tag="${escapeHtml(toTagKey(key))}">${escapeHtml(label)}</span>`;
        })
        .join("")}
    </div>
  `;
}

function getImageRenderData(image) {
  const width = Number.parseInt(image.width, 10);
  const height = Number.parseInt(image.height, 10);
  const hasDimensions = Number.isFinite(width) && Number.isFinite(height);

  return {
    width,
    height,
    dimensions: hasDimensions ? ` width="${width}" height="${height}"` : "",
    orientation: hasDimensions && height > width ? "portrait" : "landscape",
  };
}

function renderNewsImages(images, root, itemId, locale) {
  const validImages = (Array.isArray(images) ? images : [images]).filter(
    (image) => image?.src,
  );

  if (!validImages.length) {
    return "";
  }

  if (validImages.length === 1) {
    const image = validImages[0];
    const { dimensions, orientation } = getImageRenderData(image);

    return `
      <div class="update-images update-images--single">
        <figure class="update-image update-image--${orientation}">
          <img
            src="${escapeHtml(resolveUrl(root, image.src))}"
            alt="${escapeHtml(image.alt || "")}"
            loading="lazy"
            decoding="async"${dimensions}
          />
        </figure>
      </div>
    `;
  }

  const initialImage = validImages[0];
  const { dimensions, orientation } = getImageRenderData(initialImage);
  const labels = locale === "ja"
    ? {
        gallery: "画像ギャラリー",
        previous: "前の画像",
        next: "次の画像",
        show: (index) => `${index + 1}枚目の画像を表示`,
      }
    : {
        gallery: "Image gallery",
        previous: "Previous image",
        next: "Next image",
        show: (index) => `Show image ${index + 1}`,
      };

  return `
    <div
      class="update-gallery"
      data-news-gallery="${escapeHtml(itemId)}"
      role="region"
      aria-label="${labels.gallery}"
      tabindex="0"
    >
      <div class="update-gallery-stage">
        <figure class="update-gallery-main">
          <img
            class="update-gallery-image update-gallery-image--${orientation}"
            data-gallery-main-image
            src="${escapeHtml(resolveUrl(root, initialImage.src))}"
            alt="${escapeHtml(initialImage.alt || "")}"
            loading="lazy"
            decoding="async"${dimensions}
          />
        </figure>
        <button
          class="update-gallery-nav update-gallery-nav--previous"
          type="button"
          data-gallery-previous
          aria-label="${labels.previous}"
        >&#8249;</button>
        <button
          class="update-gallery-nav update-gallery-nav--next"
          type="button"
          data-gallery-next
          aria-label="${labels.next}"
        >&#8250;</button>
      </div>
      <div class="update-gallery-footer">
        <div class="update-gallery-thumbnails">
          ${validImages
            .map((image, index) => `
              <button
                class="update-gallery-thumbnail${index === 0 ? " is-active" : ""}"
                type="button"
                data-gallery-thumbnail="${index}"
                aria-label="${labels.show(index)}"
                aria-pressed="${index === 0 ? "true" : "false"}"
              >
                <img
                  src="${escapeHtml(resolveUrl(root, image.src))}"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </button>
            `)
            .join("")}
        </div>
        <div class="update-gallery-counter" data-gallery-counter aria-live="polite">
          1 / ${validImages.length}
        </div>
      </div>
    </div>
  `;
}

function bindNewsGalleries(container, items, root) {
  const itemsById = new Map(items.map((item) => [item.id, item]));

  container.querySelectorAll("[data-news-gallery]").forEach((gallery) => {
    const item = itemsById.get(gallery.dataset.newsGallery);
    const images = (item?.images || (item?.image ? [item.image] : [])).filter(
      (image) => image?.src,
    );

    if (images.length < 2) {
      return;
    }

    const mainImage = gallery.querySelector("[data-gallery-main-image]");
    const counter = gallery.querySelector("[data-gallery-counter]");
    const thumbnails = [...gallery.querySelectorAll("[data-gallery-thumbnail]")];
    let currentIndex = 0;
    let touchStartX = null;

    const showImage = (requestedIndex) => {
      currentIndex = (requestedIndex + images.length) % images.length;
      const image = images[currentIndex];
      const { width, height, orientation } = getImageRenderData(image);

      mainImage.setAttribute("src", resolveUrl(root, image.src));
      mainImage.setAttribute("alt", image.alt || "");
      mainImage.classList.toggle("update-gallery-image--portrait", orientation === "portrait");
      mainImage.classList.toggle("update-gallery-image--landscape", orientation === "landscape");

      if (Number.isFinite(width) && Number.isFinite(height)) {
        mainImage.setAttribute("width", width);
        mainImage.setAttribute("height", height);
      } else {
        mainImage.removeAttribute("width");
        mainImage.removeAttribute("height");
      }

      counter.textContent = `${currentIndex + 1} / ${images.length}`;
      thumbnails.forEach((thumbnail, index) => {
        const active = index === currentIndex;
        thumbnail.classList.toggle("is-active", active);
        thumbnail.setAttribute("aria-pressed", String(active));
      });
    };

    gallery.querySelector("[data-gallery-previous]").addEventListener("click", () => {
      showImage(currentIndex - 1);
    });
    gallery.querySelector("[data-gallery-next]").addEventListener("click", () => {
      showImage(currentIndex + 1);
    });
    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", () => {
        showImage(Number.parseInt(thumbnail.dataset.galleryThumbnail, 10));
      });
    });
    gallery.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        showImage(currentIndex + (event.key === "ArrowLeft" ? -1 : 1));
      }
    });
    gallery.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0]?.clientX ?? null;
    }, { passive: true });
    gallery.addEventListener("touchend", (event) => {
      if (touchStartX === null) {
        return;
      }

      const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
      const distance = touchEndX - touchStartX;
      touchStartX = null;

      if (Math.abs(distance) >= 50) {
        showImage(currentIndex + (distance < 0 ? 1 : -1));
      }
    }, { passive: true });
  });
}

function renderNewsItem(
  item,
  root,
  detailed = false,
  summaryMode = "full",
  locale = "en",
  showTags,
  tagLimit,
  tagPlacement,
  itemHref,
) {
  const showSummary = detailed || summaryMode === "full";
  const shouldShowTags = showTags ?? (detailed || summaryMode === "full");
  const tags = shouldShowTags ? renderTags(item.tags, tagLimit) : "";
  const summary = showSummary && item.summary
    ? `<p class="${detailed ? "update-description" : "news-summary"}">${renderSummaryContent(item.summary, root)}</p>`
    : "";
  const images = item.images || (item.image ? [item.image] : []);
  const imageGallery = detailed ? renderNewsImages(images, root, item.id, locale) : "";

  if (detailed) {
    return `
      <article class="update-item" id="${escapeHtml(item.id)}">
        <div class="update-meta">
          <div class="update-date">${escapeHtml(formatDate(item.date, locale))}</div>
          ${tags}
        </div>
        <div class="update-content">
          <h3 class="update-title">${escapeHtml(item.title)}</h3>
          ${summary}
          ${imageGallery}
        </div>
      </article>
    `;
  }

  const meta = tagPlacement === "with-date"
    ? `<div class="news-meta"><div class="news-date">${escapeHtml(formatDate(item.date, locale))}</div>${tags}</div>`
    : `<div class="news-date">${escapeHtml(formatDate(item.date, locale))}</div>`;
  const content = `
    ${meta}
    <div class="news-content">
      <h3>${escapeHtml(item.title)}</h3>
      ${summary}
      ${tagPlacement === "with-date" ? "" : tags}
    </div>
  `;

  return `
    <article class="news-item${tagPlacement === "with-date" ? " news-item--tagged-meta" : ""}">
      ${itemHref
        ? `<a class="news-item-link" href="${escapeHtml(itemHref)}">${content}</a>`
        : content}
    </article>
  `;
}

function getPageFromUrl(totalPages, items, pageSize) {
  const targetId = window.location.hash.slice(1);
  const targetIndex = targetId ? items.findIndex((item) => item.id === targetId) : -1;

  if (targetIndex >= 0) {
    return Math.floor(targetIndex / pageSize) + 1;
  }

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
    viewAllHref = "news/",
    detailed = false,
    summaryMode = "full",
    showTags,
    tagLimit,
    tagPlacement,
    showHeader = true,
    pageSize,
    locale = "en",
    itemHref,
  } = options;

  let items = [...newsItems].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (latest || typeof limit === "number") {
    items = items.slice(0, limit || items.length);
  }

  const paginationEnabled = typeof pageSize === "number" && pageSize > 0;
  const totalPages = paginationEnabled ? Math.max(1, Math.ceil(items.length / pageSize)) : 1;
  const currentPage = paginationEnabled ? getPageFromUrl(totalPages, items, pageSize) : 1;
  const pageStart = (currentPage - 1) * (pageSize || items.length);
  const visibleItems = paginationEnabled ? items.slice(pageStart, pageStart + pageSize) : items;
  const bodyClass = detailed ? "updates-container" : "news-container";
  const listClass = detailed ? "updates-timeline" : "news-list";
  const viewAll = showViewAll
    ? `<a href="${escapeHtml(resolveUrl(root, viewAllHref))}" class="section-inline-link">View all news →</a>`
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
        ${visibleItems
          .map((item) =>
            renderNewsItem(
              item,
              root,
              detailed,
              summaryMode,
              locale,
              showTags,
              tagLimit,
              tagPlacement,
              typeof itemHref === "function" ? itemHref(item) : undefined,
            ))
          .join("")}
      </div>
      ${paginationEnabled ? renderPagination(currentPage, totalPages) : ""}
    </div>
  `;

  if (detailed) {
    bindNewsGalleries(container, visibleItems, root);
  }

  const targetId = window.location.hash.slice(1);
  const target = targetId ? document.getElementById(targetId) : null;

  if (target) {
    requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  container.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextPage = Number.parseInt(button.dataset.page || "1", 10);
      const url = new URL(window.location.href);

      if (nextPage <= 1) {
        url.searchParams.delete("page");
      } else {
        url.searchParams.set("page", String(nextPage));
      }
      url.hash = "";

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
