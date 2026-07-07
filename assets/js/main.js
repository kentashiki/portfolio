import projects from "../../data/projects.js?v=20260707c";
import workThemes from "../../data/workThemes.js?v=20260707c";
import news from "../../data/news.js?v=20260707c";
import outputs from "../../data/outputs.js?v=20260707c";
import awards from "../../data/awards.js?v=20260707c";
import { renderProjects } from "./renderProjects.js?v=20260707c";
import { renderNews } from "./renderNews.js?v=20260707c";
import { renderOutputs } from "./renderOutputs.js?v=20260707c";
import { renderAwards } from "./renderAwards.js?v=20260707c";

const IDEA_WORDS = [
  "interesting",
  "exciting",
  "challenging",
  "meaningful",
  "curious",
  "unexpected",
];

function initIdeaRotator() {
  const ideaWord = document.querySelector("[data-idea-rotator]");
  let ideaIndex = 0;

  if (!ideaWord) {
    return;
  }

  window.setInterval(() => {
    ideaWord.classList.remove("is-entering");
    ideaWord.classList.add("is-leaving");

    window.setTimeout(() => {
      ideaIndex = (ideaIndex + 1) % IDEA_WORDS.length;
      ideaWord.textContent = IDEA_WORDS[ideaIndex];
      ideaWord.classList.remove("is-leaving");
      ideaWord.classList.add("is-entering");
    }, 210);
  }, 2400);
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.body.dataset.root || "";
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
          detailed: false,
          summaryMode: "title-only",
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
        }),
    },
    {
      selector: "#outputs-list",
      run: (container) =>
        renderOutputs(container, outputs, {
          root,
          defaultAxis: "type",
        }),
    },
    {
      selector: "#awards-list",
      run: (container) =>
        renderAwards(container, awards, {
          root,
          defaultAxis: "type",
        }),
    },
  ];

  initIdeaRotator();

  pageRenderers.forEach(({ selector, run }) => {
    const container = document.querySelector(selector);

    if (container) {
      run(container);
    }
  });
});
