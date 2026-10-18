import projects from "../../data/projects.js?v=20261018c";
import workThemes from "../../data/workThemes.js?v=20261017b";
import news from "../../data/news.js?v=20261017a";
import outputs from "../../data/outputs.js?v=20261018c";
import awards from "../../data/awards.js?v=20261018a";
import jaProjects from "../../data/ja/projects.js?v=20261018c";
import jaWorkThemes from "../../data/ja/workThemes.js?v=20261017b";
import jaNews from "../../data/ja/news.js?v=20261017a";
import jaOutputs from "../../data/ja/outputs.js?v=20261018c";
import jaAwards from "../../data/ja/awards.js?v=20261018a";

function localizeLinks(links = {}) {
  return Object.fromEntries(Object.entries(links).map(([key, value]) => [
    key,
    typeof value === "string" && /^(about|news|work|outputs|awards)\//.test(value)
      ? `ja/${value}`
      : value,
  ]));
}

function localizeProjectLinks(project) {
  const detail = project.detail
    ? {
        ...project.detail,
        footer: project.detail.footer
          ? {
              ...project.detail.footer,
              backHref: `../../../ja/${project.detail.footer.backHref.replace(/^(\.\.\/)+/, "")}`,
            }
          : project.detail.footer,
      }
    : project.detail;

  return { ...project, detail, links: localizeLinks(project.links) };
}

function localizeItemLinks(item) {
  const summary = Array.isArray(item.summary)
    ? item.summary.map((part) => (
        typeof part === "object" && part !== null
          ? { ...part, href: localizeLinks({ href: part.href }).href }
          : part
      ))
    : item.summary;

  return { ...item, summary, links: localizeLinks(item.links) };
}

export async function loadLocalizedData(locale) {
  if (locale !== "ja") {
    return { projects, workThemes, news, outputs, awards };
  }

  return {
    projects: jaProjects.map(localizeProjectLinks),
    workThemes: jaWorkThemes,
    news: jaNews.map(localizeItemLinks),
    outputs: jaOutputs.map(localizeItemLinks),
    awards: jaAwards.map(localizeItemLinks),
  };
}
