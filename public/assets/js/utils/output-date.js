export function compareOutputDates(a, b) {
  const aDate = a.date || `${a.year || "0000"}-00-00`;
  const bDate = b.date || `${b.year || "0000"}-00-00`;

  return bDate.localeCompare(aDate) || (a.title || "").localeCompare(b.title || "");
}

export function formatOutputDate(date, locale = "en") {
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: locale === "ja" ? "long" : "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
