import awards from "../awards.js?v=20260728f";
import { localizeTagsWithKeys } from "./tags.js";

const translations = {
  "sichi2025-encouragement-award": {
    title: "奨励賞",
    issuer: "ヒューマンインタフェースシンポジウム 学生コンテスト SICHI 2025",
    recipients: [
      "志貴 健太",
      "佐々尾 月陽",
      "長谷川 雄飛",
      "渡邉 政紀",
      "牛山 奎悟",
      "雨宮 智浩",
    ],
  },
  "ligp2026-excellence-award": {
    title: "優秀ラーニングイノベーション賞",
    issuer: "ラーニングイノベーショングランプリ（LIGP）2026",
    recipients: [
      "志貴 健太",
      "渡邉 政紀",
      "佐々尾 月陽",
      "長谷川 雄飛",
      "牛山 奎悟",
      "雨宮 智浩",
    ],
  },
};

export default awards.map((item) => ({
  ...item,
  ...(translations[item.slug] || {}),
  tags: localizeTagsWithKeys(item.tags),
}));
