import {
  escapeHtml,
  formatProjectPeriod,
  isSameDocumentUrl,
  resolveUrl,
  toTagKey,
} from "./utils/content.js";

const PROJECT_DISPLAY_ORDER = [
  "focuspeed",
  "virtual-softness-eeg",
  "ai-agent-response-selection",
  "biosword",
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

function renderProjectLinks(links = {}, root) {
  const items = [
    ["page", "View details"],
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

function renderProjectCard(project, root, compact = false) {
  const status = project.status === "active" ? '<span class="project-status">Active</span>' : "";
  const thumbnail = resolveUrl(root, project.thumbnail);
  const tags = project.tags
    .map((tag) => `<span class="research-tag" data-tag="${escapeHtml(toTagKey(tag))}">${escapeHtml(tag)}</span>`)
    .join("");
  const period = formatProjectPeriod(project);
  const image = thumbnail
    ? `
      <div class="project-image">
        <img src="${escapeHtml(thumbnail)}" alt="${escapeHtml(project.title)} project image" />
      </div>
    `
    : "";
  const cardClass = compact ? "project-card project-card--compact" : "project-card";

  return `
    <article id="project-${escapeHtml(project.slug)}" class="${cardClass}">
      <div class="project-content">
        ${image}
        <div class="project-details">
          <div class="project-header">
            <p class="project-year">${escapeHtml(period)}</p>
            ${status}
          </div>
          <h3 class="project-title">${escapeHtml(project.title)}</h3>
          <p class="project-description">${escapeHtml(project.summary)}</p>
          <div class="project-meta">${tags}</div>
          ${renderProjectLinks(project.links, root)}
        </div>
      </div>
    </article>
  `;
}

function renderThemeProjectGroup(theme, projects, root, compact) {
  if (!projects.length) {
    return "";
  }

  const tags = (theme.tags || [])
    .map((tag) => `<span class="research-tag" data-tag="${escapeHtml(toTagKey(tag))}">${escapeHtml(tag)}</span>`)
    .join("");

  return `
    <section class="work-theme" id="theme-${escapeHtml(theme.slug)}">
      <div class="work-theme__heading">
        <div>
          <h2 class="work-theme__title">${escapeHtml(theme.title)}</h2>
        </div>
      </div>
      ${theme.summary ? `<p class="work-theme__summary">${escapeHtml(theme.summary)}</p>` : ""}
      ${tags ? `<div class="work-theme__tags">${tags}</div>` : ""}
      <div class="work-theme__projects">
        ${projects.map((project) => renderProjectCard(project, root, compact)).join("")}
      </div>
    </section>
  `;
}

function renderGroupedProjects(items, themes, root, compact) {
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

      return renderThemeProjectGroup(theme, themeProjects, root, compact);
    })
    .filter(Boolean)
    .join("");

  const ungroupedProjects = sortProjects(items.filter((project) => !groupedProjectSlugs.has(project.slug)));
  const ungroupedSection = ungroupedProjects.length
    ? renderThemeProjectGroup(
        {
          slug: "other-work",
          title: "Other Work",
          summary: "Projects and explorations that are not currently grouped under a public work theme.",
          tags: [],
        },
        ungroupedProjects,
        root,
        compact
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
  carousel.addEventListener("touchstart", stopAutoSlide, { passive: true });
  carousel.addEventListener("touchend", startAutoSlide, { passive: true });

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
    variant = "list",
    showHeader = true,
    groupedByTheme = false,
    themes = [],
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
        ? renderGroupedProjects(items, themes, root, compact)
      : `<div class="projects-container">${items
          .map((project) => renderProjectCard(project, root, compact))
          .join("")}</div>`;
  const viewAll = showViewAll
    ? `<a href="${escapeHtml(resolveUrl(root, "work/"))}" class="section-inline-link">View all work →</a>`
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
