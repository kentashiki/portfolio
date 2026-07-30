import { loadLocalizedData } from "./localized-data.js?v=20260729w";
import { renderProjects } from "./renderProjects.js?v=20260730i";
import { renderNews } from "./renderNews.js?v=20260730f";
import { renderOutputs } from "./renderOutputs.js?v=20260728d";
import { renderAwards } from "./renderAwards.js?v=20260728g";

const HOME_NEWS_TAG_LIMIT = 1;

document.addEventListener("DOMContentLoaded", async () => {
  const root = document.body.dataset.root || "";
  const locale = document.body.dataset.locale || "en";
  const { projects, workThemes, news, outputs, awards } = await loadLocalizedData(locale);
  const pageRenderers = [
    {
      selector: "#home-news",
      run: (container) =>
        renderNews(container, news, {
          latest: true,
          limit: 10,
          root,
          title: "News",
          showViewAll: true,
          viewAllHref: locale === "ja" ? "ja/news/" : "news/",
          detailed: false,
          summaryMode: "title-only",
          showTags: true,
          tagLimit: HOME_NEWS_TAG_LIMIT,
          tagPlacement: "with-date",
          locale,
          itemHref: (item) =>
            `${root}${locale === "ja" ? "ja/news/" : "news/"}#${item.id}`,
        }),
    },
    {
      selector: "#featured-projects",
      run: (container) =>
        renderProjects(container, projects, {
          featuredOnly: true,
          root,
          title: "Featured Work",
          variant: "carousel",
          showViewAll: true,
          viewAllHref: locale === "ja" ? "ja/work/" : "work/",
        }),
    },
    {
      selector: "#projects-list",
      run: (container) =>
        renderProjects(container, projects, {
          themes: workThemes,
          groupedByTheme: true,
          root,
          showHeader: false,
          locale,
          outputs,
          awards,
        }),
    },
    {
      selector: "#news-list",
      run: (container) =>
        renderNews(container, news, {
          root,
          detailed: true,
          showHeader: false,
          pageSize: 10,
          locale,
        }),
    },
    {
      selector: "#outputs-list",
      run: (container) =>
        renderOutputs(container, outputs, {
          root,
          defaultAxis: "type",
          locale,
        }),
    },
    {
      selector: "#awards-list",
      run: (container) =>
        renderAwards(container, awards, {
          root,
          defaultAxis: "type",
          locale,
        }),
    },
  ];

  pageRenderers.forEach(({ selector, run }) => {
    const container = document.querySelector(selector);

    if (container) {
      run(container);
    }
  });
});
