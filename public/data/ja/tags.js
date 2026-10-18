const tagTranslations = {
  Acceptance: "採択",
  Award: "受賞",
  "Conference Presentation": "学会発表",
  Demo: "デモ",
  "Domestic (Japan)": "国内（日本）",
  Education: "進学・卒業",
  Hackathon: "ハッカソン",
  Internship: "インターンシップ",
  International: "国際",
  Poster: "ポスター",
  "Research Contest": "研究コンテスト",
  "Student Contest": "学生コンテスト",
  Website: "ウェブサイト",
};

export function localizeTags(tags = []) {
  return tags.map((tag) => tagTranslations[tag] || tag);
}

export function localizeTagsWithKeys(tags = []) {
  return tags.map((tag) => ({
    key: tag,
    label: tagTranslations[tag] || tag,
  }));
}

export function localizeNewsTags(tags = []) {
  return tags.map((tag) => ({
    key: tag,
    label: tagTranslations[tag] || tag,
  }));
}
