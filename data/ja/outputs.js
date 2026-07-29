import outputs from "../outputs.js";
import { localizeTagsWithKeys } from "./tags.js";

const translations = {
  "focuspeed-sichi2025": {
    title: "FocuSpeed: 生体信号に基づいた集中度計測による音声再生速度の適応制御",
    venue: "ヒューマンインタフェースシンポジウム 学生コンテスト SICHI 2025",
    authors: [
      "志貴 健太",
      "佐々尾 月陽",
      "長谷川 雄飛",
      "渡邉 政紀",
      "牛山 奎悟",
      "雨宮 智浩",
    ],
    detail: {
      myContributions: [
        "課題デバイスであるBITalinoを使ったシステムの考案に向けて、ブレインストーミングや文献調査を行い、チームでの初期アイデアの形成に貢献しました。",
        "生体信号処理パイプライン（前処理、特徴量抽出など）、適応再生ロジック、デモ発表向けのプロトタイプUIを設計・実装しました。",
        "プロジェクトの進捗を管理し、必要に応じてメンバーへのリマインドを行いました。",
        "デモ発表に向けて、ポスターとスライドの原案を作成しました。",
      ],
      lessonsLearned: [
        {
          body:
            "生体信号計測において、ノイズの混入を抑えることの重要性と難しさを痛感しました。また、FocuSpeedはユーザ自身も認識しにくい集中状態を扱うため、デモ発表ではシステムの挙動を分かりやすく伝えることにも苦心しました。この経験から、技術的な完成度だけでなく、システムの挙動や価値が伝わるように提示することの重要性を学びました。",
        },
      ],
    },
  },
  "portfolio-website": {
    title: "ポートフォリオサイト",
    description: "プロジェクトや成果物、ニュースを広く発信するためのポートフォリオサイトです。制作にあたっては、GPT-5（OpenAI）とClaude（Anthropic）を活用しました。",
  },
};

export default outputs.map((item) => ({
  ...item,
  ...(translations[item.slug] || {}),
  tags: localizeTagsWithKeys(item.tags),
}));
