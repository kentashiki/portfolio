import {
  escapeHtml,
  isSameDocumentUrl,
  resolveUrl,
  toTagKey,
} from "./utils/content.js";

const PROJECT_DISPLAY_ORDER = ["focuspeed", "science-of-reality", "humanaugmentation"];

function sortProjects(items) {
  return [...items].sort((a, b) => {
    const aIndex = PROJECT_DISPLAY_ORDER.indexOf(a.slug);
    const bIndex = PROJECT_DISPLAY_ORDER.indexOf(b.slug);
    const safeA = aIndex === -1 ? PROJECT_DISPLAY_ORDER.length : aIndex;
    const safeB = bIndex === -1 ? PROJECT_DISPLAY_ORDER.length : bIndex;

    if (safeA !== safeB) {
      return safeA - safeB;
    }

    return Number(b.year || 0) - Number(a.year || 0) || (a.title || "").localeCompare(b.title || "");
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

function formatPeriodPoint(point) {
  if (!point || !point.year) {
    return "";
  }

  const monthLabels = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (!point.month) {
    return String(point.year);
  }

  return `${monthLabels[point.month] || point.month} ${point.year}`;
}

function formatProjectPeriod(project) {
  const start = formatPeriodPoint(project.start);
  const end = formatPeriodPoint(project.end);

  if (start && end) {
    return `${start} - ${end}`;
  }

  if (start && project.status === "ongoing") {
    return `${start} - Present`;
  }

  if (start) {
    return start;
  }

  if (project.year) {
    return String(project.year);
  }

  return "";
}

function renderProjectCard(project, root, compact = false) {
  const statusLabel = project.status === "ongoing" ? "Ongoing" : "Completed";
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
            <span class="project-status ${escapeHtml(project.status)}">${statusLabel}</span>
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

function renderCarousel(projects, root) {
  const cards = projects
    .map((project) => {
      const thumbnail = resolveUrl(root, project.thumbnail);
      const href = resolveUrl(root, project.links?.page || "projects/");
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
    title = "Projects",
    description = "",
    compact = false,
    showViewAll = false,
    variant = "list",
    showHeader = true,
  } = options;

  let items = featuredOnly ? projects.filter((project) => project.featured) : [...projects];
  items = sortProjects(items);

  if (typeof limit === "number") {
    items = items.slice(0, limit);
  }

  const content =
    variant === "carousel"
      ? renderCarousel(items, root)
      : `<div class="projects-container">${items
          .map((project) => renderProjectCard(project, root, compact))
          .join("")}</div>`;
  const viewAll = showViewAll
    ? `<a href="${escapeHtml(resolveUrl(root, "projects/"))}" class="section-inline-link">View all projects →</a>`
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
