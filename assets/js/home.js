import { loadLocalizedData } from "./localized-data.js?v=20261017a";
import { escapeHtml, resolveUrl } from "./utils/content.js";

const locale = document.body.dataset.locale || "en";
const root = document.body.dataset.root || "";
const { projects, workThemes, news } = await loadLocalizedData(locale);

const selectedWork = document.querySelector("[data-selected-work]");
const newsList = document.querySelector("[data-home-news]");

// Follow the research-theme order while keeping project content in data/.
const featuredProjects = [...projects]
  .filter((project) => project.featured)
  .sort((a, b) => {
    const themeIndex = (project) => {
      const index = workThemes.findIndex((theme) => project.themeSlugs.includes(theme.slug));
      return index < 0 ? workThemes.length : index;
    };
    return themeIndex(a) - themeIndex(b);
  })
  .slice(0, 3);

if (selectedWork) {
  selectedWork.innerHTML = featuredProjects.map((project) => {
    const href = project.links?.page || `${locale === "ja" ? "ja/" : ""}work/#project-${project.slug}`;

    return `
      <a class="selected-work-card" href="${escapeHtml(resolveUrl(root, href))}">
        <div class="selected-work-image">
          <img src="${escapeHtml(resolveUrl(root, project.thumbnail))}" alt="${escapeHtml(project.detail?.heroImage?.alt || `${project.title} — ${locale === "ja" ? "研究概要" : "research overview"}`)}" loading="lazy" decoding="async" />
        </div>
        <div class="selected-work-heading">
          <h3>${escapeHtml(project.title)}</h3>
          <span class="link-arrow" aria-hidden="true">⟶</span>
        </div>
        <p>${escapeHtml(project.summary)}</p>
      </a>
    `;
  }).join("");
}

if (newsList) {
  const dateFormatter = new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  newsList.innerHTML = [...news]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
    .map((item) => `
      <li>
        <a class="home-news-link" href="${root}${locale === "ja" ? "ja/" : ""}news/#${escapeHtml(item.id)}">
          <time datetime="${escapeHtml(item.date)}">${escapeHtml(dateFormatter.format(new Date(`${item.date}T00:00:00Z`)))}</time>
          <span class="home-news-title">${escapeHtml(item.title)}</span>
          <span class="link-arrow" aria-hidden="true">⟶</span>
        </a>
      </li>
    `).join("");
}
