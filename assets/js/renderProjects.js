import {
  escapeHtml,
  formatProjectPeriod,
  isSameDocumentUrl,
  resolveUrl,
  toTagKey,
} from "./utils/content.js?v=20260728a";

const PROJECT_DISPLAY_ORDER = [
  "focuspeed",
  "virtual-softness-eeg",
  "olfactory-subjective-impressions-eeg",
  "ai-agent-response-selection",
  "biosword",
  "complirole",
  "visual-attention",
];

function sortProjects(items) {
  return [...items].sort((a, b) => {
    const aIndex = PROJECT_DISPLAY_ORDER.indexOf(a.slug);
    const bIndex = PROJECT_DISPLAY_ORDER.indexOf(b.slug);
    const safeA = aIndex === -1 ? PROJECT_DISPLAY_ORDER.length : aIndex;
    const safeB = bIndex === -1 ? PROJECT_DISPLAY_ORDER.length : bIndex;

    if (safeA !== safeB) {
      return safeA - safeB;
    }

    return (
      Number(b.start?.year || 0) - Number(a.start?.year || 0) ||
      (a.title || "").localeCompare(b.title || "")
    );
  });
}

function renderProjectLinks(links = {}, root, locale = "en") {
  const items = [
    ["page", locale === "ja" ? "詳細を見る" : "View details"],
    ["demo", "Live demo"],
    ["github", "GitHub"],
  ]
    .filter(([key]) => {
      if (!links[key]) {
        return false;
      }

      if (key === "page") {
        return !isSameDocumentUrl(resolveUrl(root, links[key]));
      }

      return true;
    })
    .map(
      ([key, label]) =>
        `<a class="project-link" href="${escapeHtml(resolveUrl(root, links[key]))}"${
          /^https?:\/\//.test(links[key]) ? ' target="_blank" rel="noopener noreferrer"' : ""
        }>${label}</a>`
    );

  if (!items.length) {
    return "";
  }

  return `<div class="project-links">${items.join("")}</div>`;
}

function renderRelatedProjectResults(project, outputs, awards, root, locale) {
  const relatedOutputs = outputs
    .filter((output) => output.projectSlug === project.slug)
    .sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
  const relatedAwards = awards
    .filter((award) => award.projectSlug === project.slug)
    .sort((a, b) => Number(b.year || 0) - Number(a.year || 0));

  if (!relatedOutputs.length && !relatedAwards.length) {
    return "";
  }

  const formatContext = (context, year) => {
    const contextText = String(context || "");
    const yearText = String(year || "");

    if (contextText && yearText && !contextText.includes(yearText)) {
      return `${contextText} · ${yearText}`;
    }

    return contextText || yearText;
  };

  const renderGroup = (items, type) => {
    if (!items.length) {
      return "";
    }

    const isOutput = type === "output";
    const label = isOutput
      ? locale === "ja" ? "関連する成果" : "Related Outputs"
      : locale === "ja" ? "受賞" : "Awards";
    const fallbackHref = isOutput
      ? locale === "ja" ? "ja/outputs/" : "outputs/"
      : locale === "ja" ? "ja/awards/" : "awards/";
    const listItems = items
      .map((item) => {
        const title = isOutput
          ? formatContext(item.venue, item.year) || item.title
          : item.title;
        const meta = isOutput ? "" : formatContext(item.issuer, item.year);
        const href = resolveUrl(root, item.links?.page || fallbackHref);

        return `
          <li class="project-related__item">
            <a class="project-related__link" href="${escapeHtml(href)}">
              <span class="project-related__title">${escapeHtml(title)}</span>
              ${meta ? `<span class="project-related__meta">${escapeHtml(meta)}</span>` : ""}
            </a>
          </li>
        `;
      })
      .join("");

    return `
      <div class="project-related__group">
        <h4 class="project-related__heading">${label}</h4>
        <ul class="project-related__list">${listItems}</ul>
      </div>
    `;
  };

  return `
    <div
      class="project-related"
      aria-label="${locale === "ja" ? "関連する成果と受賞" : "Related outputs and awards"}"
    >
      ${renderGroup(relatedOutputs, "output")}
      ${renderGroup(relatedAwards, "award")}
    </div>
  `;
}

function renderProjectCard(
  project,
  root,
  compact = false,
  locale = "en",
  outputs = [],
  awards = [],
) {
  const status = project.status === "active" ? '<span class="project-status">Active</span>' : "";
  const thumbnail = resolveUrl(root, project.thumbnail);
  const tags = project.tags
    .map((tag) => `<span class="research-tag" data-tag="${escapeHtml(toTagKey(tag))}">${escapeHtml(tag)}</span>`)
    .join("");
  const period = formatProjectPeriod(project, locale);
  const image = thumbnail
    ? `
      <div class="project-image">
        <img src="${escapeHtml(thumbnail)}" alt="${escapeHtml(project.title)} project image" />
      </div>
    `
    : `
      <div class="project-image project-image--placeholder" role="img" aria-label="No image available">
        <span>No Image</span>
      </div>
    `;
  const cardClass = [
    "project-card",
    compact ? "project-card--compact" : "",
    thumbnail ? "" : "project-card--no-image",
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <article id="project-${escapeHtml(project.slug)}" class="${cardClass}">
      <div class="project-heading">
        <h3 class="project-title">${escapeHtml(project.title)}</h3>
        <div class="project-header">
          <p class="project-year">${escapeHtml(period)}</p>
          ${status}
        </div>
      </div>
      <div class="project-content">
        ${image}
        <div class="project-details">
          <p class="project-description">${escapeHtml(project.summary)}</p>
          <div class="project-meta">${tags}</div>
          ${renderRelatedProjectResults(project, outputs, awards, root, locale)}
          ${renderProjectLinks(project.links, root, locale)}
        </div>
      </div>
    </article>
  `;
}

function renderThemeProjectGroup(theme, projects, root, compact, locale, outputs, awards) {
  if (!projects.length) {
    return "";
  }

  const keywords = (theme.tags || [])
    .map((tag) => `<li class="work-theme__keyword">${escapeHtml(tag)}</li>`)
    .join("");

  return `
    <section class="work-theme" id="theme-${escapeHtml(theme.slug)}">
      <div class="work-theme__heading">
        <div>
          <h2 class="work-theme__title">${escapeHtml(theme.title)}</h2>
        </div>
      </div>
      ${theme.summary ? `<p class="work-theme__summary">${escapeHtml(theme.summary)}</p>` : ""}
      ${
        keywords
          ? `<ul class="work-theme__keywords" aria-label="${
              locale === "ja" ? "テーマのキーワード" : "Theme keywords"
            }">${keywords}</ul>`
          : ""
      }
      <div class="work-theme__projects">
        ${projects
          .map((project) => renderProjectCard(project, root, compact, locale, outputs, awards))
          .join("")}
      </div>
    </section>
  `;
}

function renderGroupedProjects(items, themes, root, compact, locale, outputs, awards) {
  const groupedProjectSlugs = new Set();
  const themeSections = themes
    .map((theme) => {
      const themeProjects = sortProjects(
        items.filter((project) => {
          const belongsToTheme = project.themeSlugs?.includes(theme.slug);

          if (belongsToTheme) {
            groupedProjectSlugs.add(project.slug);
          }

          return belongsToTheme;
        })
      );

      return renderThemeProjectGroup(
        theme,
        themeProjects,
        root,
        compact,
        locale,
        outputs,
        awards,
      );
    })
    .filter(Boolean)
    .join("");

  const ungroupedProjects = sortProjects(items.filter((project) => !groupedProjectSlugs.has(project.slug)));
  const ungroupedSection = ungroupedProjects.length
    ? renderThemeProjectGroup(
        {
          slug: "other-work",
          title: locale === "ja" ? "その他のプロジェクト" : "Other Work",
          tags: [],
        },
        ungroupedProjects,
        root,
        compact,
        locale,
        outputs,
        awards,
      )
    : "";

  return `<div class="work-themes">${themeSections}${ungroupedSection}</div>`;
}

function renderCarousel(projects, root) {
  const cards = projects
    .map((project) => {
      const thumbnail = resolveUrl(root, project.thumbnail);
      const href = resolveUrl(root, project.links?.page || "work/");
      return `
        <a href="${escapeHtml(href)}" class="carousel-card">
          <div class="carousel-image">
            <img src="${escapeHtml(thumbnail)}" alt="${escapeHtml(project.title)} project image" />
          </div>
          <div class="carousel-caption">
            <h3>${escapeHtml(project.title)}</h3>
            <p>${escapeHtml(project.summary)}</p>
          </div>
        </a>
      `;
    })
    .join("");
  const dots = projects
    .map(
      (_, index) =>
        `<button type="button" class="dot${index === 0 ? " active" : ""}" data-carousel-dot="${index}" aria-label="Go to project ${index + 1}"></button>`
    )
    .join("");

  return `
    <div class="carousel-container" data-carousel>
      <button class="carousel-btn prev" type="button" data-carousel-prev aria-label="Previous project">‹</button>
      <div class="carousel-wrapper">
        <div class="carousel-track">
          ${cards}
        </div>
      </div>
      <button class="carousel-btn next" type="button" data-carousel-next aria-label="Next project">›</button>
    </div>
    <div class="carousel-dots">${dots}</div>
  `;
}

function initCarousel(container) {
  const carousel = container.querySelector("[data-carousel]");
  if (!carousel) {
    return;
  }

  const track = carousel.querySelector(".carousel-track");
  const cards = carousel.querySelectorAll(".carousel-card");
  const dots = container.querySelectorAll("[data-carousel-dot]");
  const prev = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  let currentIndex = 0;
  let autoSlideInterval = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let touchDeltaX = 0;
  let isHorizontalSwipe = false;
  let ignoreClicksUntil = 0;
  const autoSlideDelay = 7000;

  if (!track || !cards.length) {
    return;
  }

  const update = (index) => {
    currentIndex = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === currentIndex);
    });
  };

  const startAutoSlide = () => {
    if (cards.length < 2 || autoSlideInterval) {
      return;
    }

    autoSlideInterval = window.setInterval(() => {
      update(currentIndex + 1);
    }, autoSlideDelay);
  };

  const stopAutoSlide = () => {
    if (!autoSlideInterval) {
      return;
    }

    window.clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  };

  prev?.addEventListener("click", () => {
    update(currentIndex - 1);
    stopAutoSlide();
    startAutoSlide();
  });

  next?.addEventListener("click", () => {
    update(currentIndex + 1);
    stopAutoSlide();
    startAutoSlide();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      update(index);
      stopAutoSlide();
      startAutoSlide();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoSlide);
  carousel.addEventListener("mouseleave", startAutoSlide);

  track.addEventListener(
    "touchstart",
    (event) => {
      if (event.touches.length !== 1) {
        return;
      }

      const touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = performance.now();
      touchDeltaX = 0;
      isHorizontalSwipe = false;
      stopAutoSlide();
      track.classList.add("is-dragging");
    },
    { passive: true }
  );

  track.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches.length !== 1) {
        return;
      }

      const touch = event.touches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (!isHorizontalSwipe && Math.abs(deltaX) < 8) {
        return;
      }

      if (!isHorizontalSwipe && Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }

      isHorizontalSwipe = true;
      touchDeltaX = deltaX;
      track.style.transform = `translateX(calc(-${currentIndex * 100}% + ${touchDeltaX}px))`;
    },
    { passive: true }
  );

  const finishSwipe = (cancelled = false) => {
    track.classList.remove("is-dragging");

    if (cancelled || !isHorizontalSwipe) {
      update(currentIndex);
      touchDeltaX = 0;
      isHorizontalSwipe = false;
      startAutoSlide();
      return;
    }

    const elapsed = Math.max(performance.now() - touchStartTime, 1);
    const velocity = Math.abs(touchDeltaX) / elapsed;
    const distanceThreshold = Math.min(track.clientWidth * 0.18, 72);
    const shouldChangeSlide =
      Math.abs(touchDeltaX) >= distanceThreshold ||
      (Math.abs(touchDeltaX) >= 18 && velocity >= 0.35);

    if (shouldChangeSlide) {
      update(currentIndex + (touchDeltaX < 0 ? 1 : -1));
      ignoreClicksUntil = performance.now() + 400;
    } else {
      update(currentIndex);
    }

    touchDeltaX = 0;
    isHorizontalSwipe = false;
    startAutoSlide();
  };

  track.addEventListener("touchend", () => finishSwipe(), { passive: true });
  track.addEventListener("touchcancel", () => finishSwipe(true), { passive: true });
  track.addEventListener(
    "click",
    (event) => {
      if (performance.now() < ignoreClicksUntil) {
        event.preventDefault();
      }
    },
    true
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      update(currentIndex - 1);
    }

    if (event.key === "ArrowRight") {
      update(currentIndex + 1);
    }
  });

  update(0);
  startAutoSlide();
}

export function renderProjects(container, projects, options = {}) {
  if (!container) {
    return;
  }

  const {
    featuredOnly = false,
    limit,
    root = "",
    title = "Work",
    description = "",
    compact = false,
    showViewAll = false,
    viewAllHref = "work/",
    variant = "list",
    showHeader = true,
    groupedByTheme = false,
    themes = [],
    locale = "en",
    outputs = [],
    awards = [],
  } = options;

  let items = featuredOnly ? projects.filter((project) => project.featured) : [...projects];
  items = sortProjects(items);

  if (typeof limit === "number") {
    items = items.slice(0, limit);
  }

  const content =
    variant === "carousel"
      ? renderCarousel(items, root)
      : groupedByTheme
        ? renderGroupedProjects(items, themes, root, compact, locale, outputs, awards)
      : `<div class="projects-container">${items
          .map((project) =>
            renderProjectCard(project, root, compact, locale, outputs, awards)
          )
          .join("")}</div>`;
  const viewAll = showViewAll
    ? `<a href="${escapeHtml(resolveUrl(root, viewAllHref))}" class="section-inline-link">View all work →</a>`
    : "";

  container.innerHTML = `
    ${showHeader ? `
      <div class="section-heading">
        <h2>${escapeHtml(title)}</h2>
        ${viewAll}
      </div>
      ${description ? `<p class="section-intro">${escapeHtml(description)}</p>` : ""}
    ` : ""}
    ${content}
  `;

  if (variant === "carousel") {
    initCarousel(container);
  }
}
