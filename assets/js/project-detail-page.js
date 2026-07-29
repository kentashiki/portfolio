import { loadLocalizedData } from "./localized-data.js?v=20260729s";
import { formatProjectPeriod, resolveUrl, toTagKey } from "./utils/content.js?v=20260728a";
import { getLinkActionLabel, renderLinkAction } from "./utils/link-actions.js?v=20260728b";
import { renderOutputCard } from "./renderOutputs.js?v=20260728d";
import { renderAwardCard } from "./renderAwards.js?v=20260728g";

const root = document.querySelector("[data-project-detail-root]");
const rootPath = document.body?.dataset.root || "";
const locale = document.body?.dataset.locale || "en";
const slug = document.body?.dataset.projectSlug;

if (root) {
  loadLocalizedData(locale).then(({ projects, outputs, awards }) => {
  const project = projects.find((item) => item.slug === slug);

  if (!slug || !project) {
    renderEmptyState(root);
  } else {
    renderProjectDetail(root, buildProjectDetail(project, outputs, awards));
  }
  });
}

function buildProjectDetail(project, outputs, awards) {
  const projectDetail = project.detail || {};
  const outputEntries = buildProjectOutputs(project, projectDetail, outputs);
  const awardEntries = buildProjectAwards(project, outputEntries, projectDetail, awards);

  return {
    ...project,
    heroImage: projectDetail.heroImage || project.heroImage,
    featuredVideo: projectDetail.featuredVideo || project.featuredVideo,
    overview: projectDetail.overview || project.overview,
    techStack: projectDetail.techStack || project.techStack,
    outputEntries,
    awardEntries,
    footer: projectDetail.footer || project.footer,
    links: project.links || {},
  };
}

function buildProjectOutputs(project, projectDetail, outputs) {
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
      visuals: detail.visuals || [],
      myContributions: detail.myContributions || [],
      lessonsLearned: detail.lessonsLearned || [],
      techStack: detail.techStack || [],
    };
  });
}

function buildProjectAwards(project, outputEntries, projectDetail, awards) {
  const configuredAwardSlugs = projectDetail.awardSlugs || [];
  const outputSlugs = new Set(outputEntries.map((output) => output.slug));
  const matchedAwards = [
    ...configuredAwardSlugs
      .map((awardSlug) => awards.find((award) => award.slug === awardSlug))
      .filter(Boolean),
    ...awards.filter(
      (award) =>
        award.projectSlug === project.slug ||
        outputSlugs.has(award.outputSlug)
    ),
  ];
  const seen = new Set();

  return matchedAwards.filter((award) => {
    if (seen.has(award.slug)) {
      return false;
    }

    seen.add(award.slug);
    return true;
  });
}

function renderProjectDetail(container, detail) {
  document.title = `${detail.title} - ${locale === "ja" ? "プロジェクト詳細" : "Work Detail"}`;

  container.innerHTML = `
    ${renderHero(detail)}
    <main class="project-detail-root">
      ${renderSection("Overview", renderOverviewSection(detail))}
      ${renderSection("Featured Video", renderFeaturedVideo(detail.featuredVideo))}
      ${renderSection("Tech Stack", detail.techStack?.length ? renderTechStack(detail.techStack) : "")}
      ${renderSection(
        "Outputs",
        detail.outputEntries?.length ? renderOutputRecords(detail.outputEntries) : ""
      )}
      ${renderSection("Awards", detail.awardEntries?.length ? renderProjectAwards(detail.awardEntries) : "")}
      ${renderFooter(detail)}
    </main>
  `;

}

function renderHero(detail) {
  const detailLinks = [
    ["github", "GitHub"],
    ["demo", "Demo"],
    ["paper", "Paper"],
    ["poster", "Poster"],
    ["video", "Video"],
  ]
    .filter(([key]) => detail.links?.[key])
    .map(([key, label]) => ({
      key,
      label,
      href: detail.links[key],
    }));

  return `
    <section class="project-detail-hero page-hero">
      <canvas id="network-canvas"></canvas>
      <div class="project-detail-hero__content page-hero-content">
        <div>
          <h1>${escapeHtml(detail.title)}</h1>
          ${
            detail.summary
              ? `<p class="project-detail-hero__summary">${escapeHtml(detail.summary)}</p>`
              : ""
          }
          ${
            formatProjectPeriod(detail, locale)
              ? `<p class="project-detail-hero__period">${escapeHtml(formatProjectPeriod(detail, locale))}</p>`
              : ""
          }
          ${detail.tags?.length ? renderTags(detail.tags) : ""}
          ${detailLinks.length ? renderLinks(detailLinks) : ""}
        </div>
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

function renderFeaturedVideo(video) {
  if (!video?.src) {
    return "";
  }

  const media = renderFeaturedVideoMedia(video);

  if (!media) {
    return "";
  }

  return `
    <figure class="project-detail-featured-video">
      <div class="project-detail-featured-video__media">${media}</div>
      ${
        video.title || video.caption
          ? `
            <figcaption class="project-detail-featured-video__body">
              ${video.title ? `<h3 class="project-detail-featured-video__title">${escapeHtml(video.title)}</h3>` : ""}
              ${
                video.caption
                  ? `<p class="project-detail-featured-video__caption">${escapeHtml(video.caption)}</p>`
                  : ""
              }
            </figcaption>
          `
          : ""
      }
    </figure>
  `;
}

function renderFeaturedVideoMedia(video) {
  const type = video.type || "video";

  if (type === "youtube") {
    const embedUrl = toYouTubeEmbedUrl(video.src);

    if (!embedUrl) {
      return "";
    }

    return `
      <iframe
        src="${escapeAttribute(embedUrl)}"
        title="${escapeAttribute(video.title || "Featured project video")}"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    `;
  }

  if (type === "embed") {
    return `
      <iframe
        src="${escapeAttribute(video.src)}"
        title="${escapeAttribute(video.title || "Featured project video")}"
        loading="lazy"
        allowfullscreen
      ></iframe>
    `;
  }

  const src = resolveUrl(rootPath, video.src);
  const poster = video.poster ? resolveUrl(rootPath, video.poster) : "";

  return `
    <video
      src="${escapeAttribute(src)}"
      ${poster ? `poster="${escapeAttribute(poster)}"` : ""}
      controls
      preload="metadata"
    ></video>
  `;
}

function toYouTubeEmbedUrl(value) {
  try {
    const url = new URL(value);
    let videoId = "";

    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.split("/").filter(Boolean)[0] || "";
    } else if (url.pathname.startsWith("/embed/")) {
      videoId = url.pathname.split("/").filter(Boolean)[1] || "";
    } else if (url.pathname.startsWith("/shorts/")) {
      videoId = url.pathname.split("/").filter(Boolean)[1] || "";
    } else {
      videoId = url.searchParams.get("v") || "";
    }

    return videoId ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}` : "";
  } catch {
    return "";
  }
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

function renderOverviewSection(detail) {
  const overview = detail.overview?.length ? renderOverview(detail.overview) : "";
  const teaser = renderProjectTeaser(detail);

  return `${overview}${teaser}`;
}

function renderProjectTeaser(detail) {
  if (!detail.heroImage || !detail.thumbnail) {
    return "";
  }

  const imageSrc = resolveUrl(rootPath, detail.thumbnail);

  return `
    <figure class="project-detail-teaser">
      <div class="project-detail-teaser__media">
        <img
          src="${escapeAttribute(imageSrc)}"
          alt="${escapeAttribute(detail.heroImage.alt || detail.title)}"
          loading="lazy"
        />
      </div>
      ${
        detail.heroImage.caption
          ? `<figcaption class="project-detail-teaser__caption">${escapeHtml(detail.heroImage.caption)}</figcaption>`
          : ""
      }
    </figure>
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

function renderProjectAwards(items) {
  return `
    <div class="project-detail-award-records">
      ${items
        .slice()
        .sort((a, b) => Number(b.year || 0) - Number(a.year || 0) || a.title.localeCompare(b.title))
        .map((award) => renderAwardRecord(award))
        .join("")}
    </div>
  `;
}

function renderAwardRecord(award) {
  const awardLinks = getProjectAwardLinks(award);

  return `
    <article class="project-detail-award-record" id="award-${escapeAttribute(award.slug)}">
      <div class="project-detail-award-record__content">
        <h3 class="project-detail-award-record__title">${escapeHtml(award.title)}</h3>
        ${award.issuer ? `<p class="project-detail-award-record__issuer">${escapeHtml(award.issuer)}</p>` : ""}
        ${award.recipients?.length ? `<p class="project-detail-award-record__recipients">${renderNamesList(award.recipients)}</p>` : ""}
        ${
          award.tags?.length
            ? `<div class="project-detail-award-record__tags">${award.tags
                .map((tag) => {
                  const label = typeof tag === "object" && tag !== null ? tag.label : tag;
                  const key = typeof tag === "object" && tag !== null ? tag.key : tag;

                  return `<span class="research-tag" data-tag="${escapeAttribute(toTagKey(key))}">${escapeHtml(label)}</span>`;
                })
                .join("")}</div>`
            : ""
        }
        ${
          awardLinks.length
            ? `
              <div class="project-detail-award-record__links">
                ${awardLinks
                  .map((link) =>
                    renderLinkAction({
                      ...link,
                      className: "project-detail-award-record__link",
                    })
                  )
                  .join("")}
              </div>
            `
            : ""
        }
      </div>
    </article>
  `;
}

function getProjectAwardLinks(award) {
  return Object.entries(award.links || {})
    .filter(([key, href]) => href && key !== "page" && key !== "projectDetail")
    .map(([key, href]) => ({
      key,
      href: resolveUrl(rootPath, href),
      label: getLinkActionLabel(key, locale),
      external: shouldOpenInNewTab(href),
    }));
}

function renderNamesList(names = []) {
  return names
    .map((name) =>
      name === "Kenta Shiki" || name === "志貴 健太"
        ? `<span class="author-highlight">${escapeHtml(name)}</span>`
        : escapeHtml(name)
    )
    .join(", ");
}

function renderOutputRecords(items) {
  return `
    <div class="project-detail-output-records">
      ${items.map((item) => renderOutputRecord(item)).join("")}
    </div>
  `;
}

function renderOutputRecord(output) {
  const outputLinks = getOutputLinks(output);

  return `
    <article class="project-detail-output-record" id="output-${escapeAttribute(output.slug)}">
      <div class="project-detail-output-record__header">
        <div class="project-detail-output-record__summary">
          <h3 class="project-detail-output-record__title">${escapeHtml(output.title)}</h3>
          ${output.authors?.length ? `<p class="project-detail-output-record__authors">${renderNamesList(output.authors)}</p>` : ""}
          ${output.venue ? `<p class="project-detail-output-record__venue">${escapeHtml(output.venue)}</p>` : ""}
        </div>
        ${
          output.tags?.length
            ? `<div class="project-detail-output-record__tags">${output.tags
                .map((tag) => {
                  const label = typeof tag === "object" && tag !== null ? tag.label : tag;
                  const key = typeof tag === "object" && tag !== null ? tag.key : tag;

                  return `<span class="research-tag" data-tag="${escapeAttribute(toTagKey(key))}">${escapeHtml(label)}</span>`;
                })
                .join("")}</div>`
            : ""
        }
        ${
          outputLinks.length
            ? `
              <div class="project-detail-output-record__links">
                ${outputLinks
                  .map((link) =>
                    renderLinkAction({
                      ...link,
                      className: "project-detail-output-record__link",
                    })
                  )
                  .join("")}
              </div>
            `
            : ""
        }
      </div>
      <div class="project-detail-output-record__body">
        ${renderOutputMeta(output)}
        ${
          output.outcome
            ? renderInlineOutputSection(
                locale === "ja" ? "成果" : "Outcome",
                `<div class="project-detail-richtext">${renderParagraphs(output.outcome)}</div>`
              )
            : ""
        }
        ${
          output.myContributions?.length
            ? renderInlineOutputSection(
                locale === "ja" ? "担当・貢献" : "My Contributions",
                renderBullets(output.myContributions)
              )
            : ""
        }
        ${
          output.lessonsLearned?.length
            ? renderInlineOutputSection(
                locale === "ja" ? "振り返り" : "Reflection",
                renderReflection(output.lessonsLearned)
              )
            : ""
        }
      </div>
    </article>
  `;
}

function getOutputLinks(output) {
  return Object.entries(output.links || {})
    .filter(([key, href]) => href && key !== "page" && key !== "projectDetail")
    .map(([key, href]) => ({
      key,
      href: resolveUrl(rootPath, href),
      label: getLinkActionLabel(key, locale),
      external: shouldOpenInNewTab(href),
    }));
}

function humanizeOutputMeta(value) {
  return String(value || "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function renderOutputMeta(output) {
  const metaItems = [
    { label: locale === "ja" ? "役割" : "Role", value: output.role },
    { label: locale === "ja" ? "チーム" : "Team", value: output.team },
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

function renderResultBody(item, detail) {
  const titleKey = slugify(item.title);

  if (titleKey === "presentation") {
    const relatedOutputs = (detail.relatedOutputs || [])
      .map((relatedSlug) => outputs.find((output) => output.slug === relatedSlug))
      .filter(Boolean);

    if (relatedOutputs.length) {
      return `
        <div class="project-detail-related-cards">
          ${relatedOutputs.map((output) => renderOutputCard(output, rootPath, { locale })).join("")}
        </div>
      `;
    }
  }

  return (item.items || []).length ? renderTextList(item.items) : renderParagraphs(item.body || "");
}

function renderReflection(items) {
  return `
    <div class="project-detail-reflection">
      ${items
        .map(
          (item) => `
          <article class="project-detail-reflection__item">
            ${item.title ? `<h3>${escapeHtml(item.title)}</h3>` : ""}
            <div class="project-detail-richtext">${renderParagraphs(item.body)}</div>
          </article>
        `
        )
        .join("")}
    </div>
  `;
}

function renderFooter(detail) {
  const backHref = detail.footer?.backHref || "../../work/";
  const backLabel = detail.footer?.backLabel || "Back to Work";

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
        .map((link) =>
          renderLinkAction({
            ...link,
            className: "project-detail-link",
            external: shouldOpenInNewTab(link.href),
          })
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
