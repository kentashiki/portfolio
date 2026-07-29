export function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function resolveUrl(root, value) {
  if (!value) {
    return "";
  }

  if (/^(https?:)?\/\//.test(value) || value.startsWith("#")) {
    return value;
  }

  return `${root}${value}`;
}

export function isSameDocumentUrl(href) {
  if (!href || typeof window === "undefined") {
    return false;
  }

  try {
    const target = new URL(href, window.location.href);
    return target.pathname === window.location.pathname && target.hash.length > 0;
  } catch {
    return false;
  }
}

export function toTagKey(tag) {
  return String(tag)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function titleCase(value = "") {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function humanizeSlug(value = "") {
  return value
    .split("-")
    .map((part) => titleCase(part))
    .join(" ");
}

export function formatPeriodPoint(point, locale = "en") {
  if (!point || !point.year) {
    return "";
  }

  if (locale === "ja") {
    return point.month ? `${point.year}年${point.month}月` : `${point.year}年`;
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

export function formatProjectPeriod(project = {}, locale = "en") {
  const start = formatPeriodPoint(project.start, locale);
  const end = formatPeriodPoint(project.end, locale);
  const separator = locale === "ja" ? "〜" : " - ";

  if (start && end) {
    return `${start}${separator}${end}`;
  }

  if (start && project.status === "active") {
    return `${start}${separator}${locale === "ja" ? "現在" : "Present"}`;
  }

  if (start) {
    return start;
  }

  return "";
}

export function sortByYearThenTitle(
  items,
  getYear = (item) => item.year,
  getTitle = (item) => item.title || ""
) {
  return items.sort(
    (a, b) => Number(getYear(b) || 0) - Number(getYear(a) || 0) || getTitle(a).localeCompare(getTitle(b))
  );
}
