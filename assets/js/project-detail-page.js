import projects from "../../data/projects.js";
import outputs from "../../data/outputs.js";
import awards from "../../data/awards.js";
import { resolveUrl, toTagKey } from "./utils/content.js";
import { renderOutputCard } from "./renderOutputs.js";
import { renderAwardCard } from "./renderAwards.js";

const root = document.querySelector("[data-project-detail-root]");
const rootPath = document.body?.dataset.root || "";
const slug = document.body?.dataset.projectSlug;
const initialOutputSlug =
  typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("output") : null;

if (root) {
  const project = projects.find((item) => item.slug === slug);

  if (!slug || !project) {
    renderEmptyState(root);
  } else {
    renderProjectDetail(root, buildProjectDetail(project));
  }
}

function buildProjectDetail(project) {
  const projectDetail = project.detail || {};
  const outputEntries = buildProjectOutputs(project, projectDetail);
  const primaryOutput =
    outputEntries.find((item) => item.slug === initialOutputSlug) || outputEntries[0] || null;

  return {
    ...project,
    heroImage: projectDetail.heroImage || project.heroImage,
    overview: projectDetail.overview || project.overview,
    useCase: projectDetail.useCase || project.useCase,
    outputEntries,
    primaryOutputSlug: outputEntries.some((item) => item.slug === initialOutputSlug)
      ? initialOutputSlug
      : null,
    footer: projectDetail.footer || project.footer,
    links: project.links || {},
  };
}

function buildProjectOutputs(project, projectDetail) {
  const configuredOutputSlugs = projectDetail.outputSlugs || (projectDetail.primaryOutput ? [projectDetail.primaryOutput] : []);
  const matchedOutputs = configuredOutputSlugs.length
    ? configuredOutputSlugs.map((slug) => outputs.find((item) => item.slug === slug)).filter(Boolean)
    : outputs.filter((item) => item.projectSlug === project.slug);

  return matchedOutputs.map((output) => {
    const detail = output.detail || {};

    return {
      ...output,
      role: detail.role || "",
      team: detail.team || "",
      outcome: detail.outcome || "",
      implementation: detail.implementation || [],
      visuals: detail.visuals || [],
      myContributions: detail.myContributions || [],
      lessonsLearned: detail.lessonsLearned || [],
      techStack: detail.techStack || [],
      relatedAwards: detail.relatedAwards || [],
    };
  });
}

function renderProjectDetail(container, detail) {
  document.title = `${detail.title} - Project Detail`;

  container.innerHTML = `
    ${renderHero(detail)}
    <main class="project-detail-root">
      ${renderSection("Overview", detail.overview?.length ? renderOverview(detail.overview) : "")}
      ${renderSection("Use Case", detail.useCase?.length ? renderOverview(detail.useCase) : "")}
      ${renderSection(
        "Outputs",
        detail.outputEntries?.length ? renderOutputExplorer(detail.outputEntries, detail.primaryOutputSlug) : "",
        "Click an output card to expand output-specific details such as implementation, visuals, links, lessons learned, and team context."
      )}
      ${renderFooter(detail)}
    </main>
  `;

  initOutputExplorer(container);
}

function renderHero(detail) {
  const heroImageSrc = detail.thumbnail ? resolveUrl(rootPath, detail.thumbnail) : "";
  const metaItems = [{ label: "Period", value: detail.period }].filter((item) => item.value);
  const detailLinks = [
    ["github", "GitHub"],
    ["demo", "Demo"],
    ["paper", "Paper"],
    ["poster", "Poster"],
    ["video", "Video"],
  ]
    .filter(([key]) => detail.links?.[key])
    .map(([key, label]) => ({
      label,
      href: detail.links[key],
    }));

  return `
    <section class="project-detail-hero page-hero">
      <canvas id="network-canvas"></canvas>
      <div class="project-detail-hero__content page-hero-content">
        <div>
          <p class="project-detail-hero__eyebrow">Project Detail</p>
          <h1>${escapeHtml(detail.title)}</h1>
          ${
            detail.summary
              ? `<p class="project-detail-hero__summary">${escapeHtml(detail.summary)}</p>`
              : ""
          }
          ${
            metaItems.length
              ? `<div class="project-detail-hero__meta">${metaItems
                  .map(
                    (item) => `
                    <div class="project-detail-hero__meta-item">
                      <p class="project-detail-hero__meta-label">${escapeHtml(item.label)}</p>
                      <p class="project-detail-hero__meta-value">${escapeHtml(item.value)}</p>
                    </div>
                  `
                  )
                  .join("")}</div>`
              : ""
          }
          ${detail.tags?.length ? renderTags(detail.tags) : ""}
          ${detailLinks.length ? renderLinks(detailLinks) : ""}
        </div>
        ${
          detail.heroImage && heroImageSrc
            ? `
            <div class="project-detail-hero__media">
              <figure class="project-detail-hero__image-frame">
                <img
                  class="project-detail-hero__image"
                  src="${escapeAttribute(heroImageSrc)}"
                  alt="${escapeAttribute(detail.heroImage.alt || detail.title)}"
                />
              </figure>
            </div>
          `
            : ""
        }
      </div>
    </section>
  `;
}

function renderSection(title, content, intro = "") {
  if (!content) {
    return "";
  }

  return `
    <section class="project-detail-section" id="${slugify(title)}">
      <div class="project-detail-section__inner">
        <div class="project-detail-section__heading">
          <h2 class="project-detail-section__title">${escapeHtml(title)}</h2>
          ${intro ? `<p class="project-detail-section__intro">${escapeHtml(intro)}</p>` : ""}
        </div>
        ${content}
      </div>
    </section>
  `;
}

function renderOverview(items) {
  return `
    <div class="project-detail-overview">
      ${items
        .map(
          (item) => `
          <article class="project-detail-overview__item">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.body)}</p>
          </article>
        `
        )
        .join("")}
    </div>
  `;
}

function renderVisuals(items) {
  return `
    <div class="project-detail-visuals">
      ${items
        .map((item) => {
          const media = renderVisualMedia(item);
          if (!media) {
            return "";
          }

          return `
            <figure class="project-detail-visual">
              <div class="project-detail-visual__media">${media}</div>
              ${
                item.title || item.caption
                  ? `
                  <figcaption class="project-detail-visual__body">
                    ${item.title ? `<h3 class="project-detail-visual__title">${escapeHtml(item.title)}</h3>` : ""}
                    ${
                      item.caption
                        ? `<p class="project-detail-visual__caption">${escapeHtml(item.caption)}</p>`
                        : ""
                    }
                  </figcaption>
                `
                  : ""
              }
            </figure>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderVisualMedia(item) {
  if (item.type === "image" && item.src) {
    return `<img src="${escapeAttribute(item.src)}" alt="${escapeAttribute(item.alt || "")}" loading="lazy" />`;
  }

  if (item.type === "video" && item.src) {
    return `<video src="${escapeAttribute(item.src)}" controls preload="metadata"></video>`;
  }

  if (item.type === "embed" && item.src) {
    return `
      <iframe
        src="${escapeAttribute(item.src)}"
        title="${escapeAttribute(item.title || "Embedded media")}"
        loading="lazy"
        allowfullscreen
      ></iframe>
    `;
  }

  return "";
}

function renderBullets(items) {
  return `
    <ul class="project-detail-bullets">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderApproach(items) {
  return `
    <div class="project-detail-approach">
      ${items
        .map(
          (item) => `
          <article class="project-detail-approach__block">
            <h3>${escapeHtml(item.title)}</h3>
            <div class="project-detail-richtext">${renderParagraphs(item.body)}</div>
          </article>
        `
        )
        .join("")}
    </div>
  `;
}

function renderTechStack(items) {
  return `
    <div class="project-detail-tech-groups">
      ${items
        .map(
          (group) => `
          <article class="project-detail-tech-group">
            <h3>${escapeHtml(group.title)}</h3>
            <p class="project-detail-tech-list">
              ${(group.items || []).map((item) => escapeHtml(item)).join(", ")}
            </p>
          </article>
        `
        )
        .join("")}
    </div>
  `;
}

function renderResults(items, detail) {
  return `
    <div class="project-detail-results">
      ${items
        .map(
          (item) => `
          <article class="project-detail-result" id="${slugify(item.title)}">
            <h3>${escapeHtml(item.title)}</h3>
            ${renderResultBody(item, detail)}
          </article>
        `
        )
        .join("")}
    </div>
  `;
}

function renderOutputExplorer(items, activeSlug) {
  return `
    <div class="project-detail-output-explorer">
      <div class="project-detail-output-grid">
        ${items.map((item) => renderOutputExplorerCard(item, item.slug === activeSlug)).join("")}
      </div>
      <div class="project-detail-output-panels">
        ${items.map((item) => renderOutputPanel(item, item.slug === activeSlug)).join("")}
      </div>
    </div>
  `;
}

function renderOutputExplorerCard(output, isActive) {
  const outputLinks = getOutputCardLinks(output);

  return `
    <div
      class="project-detail-output-card${isActive ? " is-active" : ""}"
      data-output-toggle="${escapeAttribute(output.slug)}"
      tabindex="0"
      role="button"
      aria-expanded="${isActive ? "true" : "false"}"
      aria-controls="output-panel-${escapeAttribute(output.slug)}"
    >
      <article class="output-card">
        <h3 class="output-card-title">${escapeHtml(output.title)}</h3>
        ${output.authors?.length ? `<p class="output-card-authors">${escapeHtml(output.authors.join(", "))}</p>` : ""}
        ${output.venue ? `<p class="output-card-venue">${escapeHtml(output.venue)}</p>` : ""}
        ${
          output.tags?.length
            ? `<div class="output-card-tags">${output.tags
                .map(
                  (tag) =>
                    `<span class="research-tag" data-tag="${escapeAttribute(toTagKey(tag))}">${escapeHtml(tag)}</span>`
                )
                .join("")}</div>`
            : ""
        }
        ${
          outputLinks.length
            ? `
              <div class="output-card-links">
                ${outputLinks
                  .map(
                    (link) => `
                      <a
                        class="output-link"
                        href="${escapeAttribute(link.href)}"
                        ${shouldOpenInNewTab(link.href) ? 'target="_blank" rel="noopener noreferrer"' : ""}
                      >
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
    </div>
  `;
}

function getOutputCardLinks(output) {
  const labels = {
    conference: "Conference site",
    pdf: "View paper",
    poster: "View poster",
    demo: "Demo",
    github: "GitHub",
    doi: "DOI",
  };

  return Object.entries(output.links || {})
    .filter(([key, href]) => href && key !== "page" && key !== "projectDetail")
    .map(([key, href]) => ({
      href: resolveUrl(rootPath, href),
      label: labels[key] || key,
    }));
}

function renderOutputPanel(output, isActive) {
  return `
    <section
      class="project-detail-output-panel${isActive ? " is-active" : ""}"
      id="output-panel-${escapeAttribute(output.slug)}"
      data-output-panel="${escapeAttribute(output.slug)}"
      ${isActive ? "" : "hidden"}
    >
      ${renderOutputMeta(output)}
      ${renderOutputLinks(output)}
      ${output.implementation?.length ? renderInlineOutputSection("Implementation", renderApproach(output.implementation)) : ""}
      ${
        output.visuals?.length
          ? renderInlineOutputSection("Visuals", renderVisuals(output.visuals))
          : ""
      }
      ${output.myContributions?.length ? renderInlineOutputSection("My Contributions", renderBullets(output.myContributions)) : ""}
      ${output.relatedAwards?.length ? renderOutputAwards(output.relatedAwards) : ""}
      ${output.lessonsLearned?.length ? renderInlineOutputSection("Lessons Learned", renderReflection(output.lessonsLearned)) : ""}
      ${output.techStack?.length ? renderInlineOutputSection("Tech Stack", renderTechStack(output.techStack)) : ""}
    </section>
  `;
}

function renderOutputMeta(output) {
  const metaItems = [
    { label: "Role", value: output.role },
    { label: "Team", value: output.team },
    { label: "Outcome", value: output.outcome },
  ].filter((item) => item.value);

  if (!metaItems.length) {
    return "";
  }

  return `
    <div class="project-detail-output-meta">
      ${metaItems
        .map(
          (item) => `
            <div class="project-detail-output-meta__item">
              <p class="project-detail-output-meta__label">${escapeHtml(item.label)}</p>
              <p class="project-detail-output-meta__value">${escapeHtml(item.value)}</p>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderOutputLinks(output) {
  const linkLabels = {
    conference: "Conference site",
    pdf: "View paper",
    poster: "View poster",
    demo: "Demo",
    github: "GitHub",
    doi: "DOI",
  };
  const items = Object.entries(output.links || {})
    .filter(([key, href]) => href && key !== "page" && key !== "projectDetail")
    .map(([key, href]) => ({
      href: resolveUrl(rootPath, href),
      label: linkLabels[key] || key,
    }));

  if (!items.length) {
    return "";
  }

  return renderInlineOutputSection(
    "Links",
    renderLinks(items)
  );
}

function renderInlineOutputSection(title, content, intro = "") {
  return `
    <section class="project-detail-output-subsection">
      <div class="project-detail-output-subsection__heading">
        <h4 class="project-detail-output-subsection__title">${escapeHtml(title)}</h4>
        ${intro ? `<p class="project-detail-output-subsection__intro">${escapeHtml(intro)}</p>` : ""}
      </div>
      ${content}
    </section>
  `;
}

function renderOutputAwards(awardSlugs) {
  const relatedAwards = awardSlugs
    .map((relatedSlug) => awards.find((award) => award.slug === relatedSlug))
    .filter(Boolean);

  if (!relatedAwards.length) {
    return "";
  }

  return renderInlineOutputSection(
    "Awards",
    `
      <div class="project-detail-related-cards">
        ${relatedAwards.map((award) => renderAwardCard(award, rootPath)).join("")}
      </div>
    `
  );
}

function renderResultBody(item, detail) {
  const titleKey = slugify(item.title);

  if (titleKey === "presentation") {
    const relatedOutputs = (detail.relatedOutputs || [])
      .map((relatedSlug) => outputs.find((output) => output.slug === relatedSlug))
      .filter(Boolean);

    if (relatedOutputs.length) {
      return `
        <div class="project-detail-related-cards">
          ${relatedOutputs.map((output) => renderOutputCard(output, rootPath)).join("")}
        </div>
      `;
    }
  }

  if (titleKey === "recognition") {
    const relatedAwards = (detail.relatedAwards || [])
      .map((relatedSlug) => awards.find((award) => award.slug === relatedSlug))
      .filter(Boolean);

    if (relatedAwards.length) {
      return `
        <div class="project-detail-related-cards">
          ${relatedAwards.map((award) => renderAwardCard(award, rootPath)).join("")}
        </div>
      `;
    }
  }

  return (item.items || []).length ? renderTextList(item.items) : renderParagraphs(item.body || "");
}

function initOutputExplorer(container) {
  const toggles = container.querySelectorAll("[data-output-toggle]");
  const panels = container.querySelectorAll("[data-output-panel]");

  if (!toggles.length || !panels.length) {
    return;
  }

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const slug = toggle.dataset.outputToggle;
      const shouldClose = toggle.classList.contains("is-active");

      toggles.forEach((item) => {
        const isActive = shouldClose ? false : item.dataset.outputToggle === slug;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-expanded", String(isActive));
      });

      panels.forEach((panel) => {
        const isActive = shouldClose ? false : panel.dataset.outputPanel === slug;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      });
    });
  });
}

function renderReflection(items) {
  return `
    <div class="project-detail-reflection">
      ${items
        .map(
          (item) => `
          <article class="project-detail-reflection__item">
            <h3>${escapeHtml(item.title)}</h3>
            <div class="project-detail-richtext">${renderParagraphs(item.body)}</div>
          </article>
        `
        )
        .join("")}
    </div>
  `;
}

function renderFooter(detail) {
  const backHref = detail.footer?.backHref || "../../projects/";
  const backLabel = detail.footer?.backLabel || "Back to Projects";

  return `
    <section class="project-detail-footer">
      <div class="project-detail-footer__inner">
        <div class="project-detail-footer__top">
          <a class="project-detail-footer__back" href="${escapeAttribute(backHref)}">${escapeHtml(
            backLabel
          )}</a>
        </div>
      </div>
    </section>
  `;
}

function renderTags(tags) {
  return `
    <div class="project-detail-tags">
      ${tags
        .map(
          (tag) =>
            `<span class="project-detail-tag research-tag hero-tag" data-tag="${escapeAttribute(
              toTagKey(tag)
            )}">${escapeHtml(tag)}</span>`
        )
        .join("")}
    </div>
  `;
}

function renderLinks(links) {
  return `
    <div class="project-detail-links">
      ${links
        .filter((link) => link.href && link.label)
        .map(
          (link) => `
          <a
            class="project-detail-link"
            href="${escapeAttribute(link.href)}"
            ${shouldOpenInNewTab(link.href) ? 'target="_blank" rel="noopener noreferrer"' : ""}
          >
            ${escapeHtml(link.label)}
          </a>
        `
        )
        .join("")}
    </div>
  `;
}

function renderTextList(items) {
  return `
    <ul class="project-detail-text-list">
      ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
    </ul>
  `;
}

function renderParagraphs(text) {
  return String(text || "")
    .split("\n")
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function renderEmptyState(container) {
  container.innerHTML = `
    <main class="project-detail-empty">
      <div class="project-detail-empty__card">
        <h1>Project detail not found</h1>
        <p>The page could not load its project data.</p>
      </div>
    </main>
  `;
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function isExternalLink(url) {
  return /^https?:\/\//.test(url);
}

function isPdfLink(url) {
  return /\.pdf($|[?#])/i.test(String(url || ""));
}

function shouldOpenInNewTab(url) {
  return isExternalLink(url) || isPdfLink(url);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
