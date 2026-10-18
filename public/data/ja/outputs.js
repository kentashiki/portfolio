import outputs from "../outputs.js?v=20261018c";
import { localizeTagsWithKeys } from "./tags.js";

const translations = {
  "temporal-eeg-softness-sfn2026": {
    detail: {
      // AI-generated draft text is commented out pending author review.
      // outcome: "研究は現在も継続中です。本研究はNeuroscience 2026のLate-Breaking Abstractに採択され、2026年11月にポスター発表を予定しています。\nここに研究結果の概要を記載します。評価条件、主な観察結果、および得られた示唆を追加予定です。",
      outcome: "準備中",
      // myContributions: [
        // "ここに自身の担当・貢献を記載します。問いの設定、実験設計、計測、解析、発表などのうち、実際に担当した内容を追加予定です。",
      // ],
      myContributions: ["準備中"],
      // lessonsLearned: [
        // { body: "ここに研究の過程で得られた学びや、今後の検討課題を記載します。" },
      // ],
      lessonsLearned: [{ body: "準備中" }],
      placeholderContent: true,
    },
  },
  "selecting-verbal-responses-head-gestures": {
    detail: {
      // AI-generated draft text is commented out pending author review.
      // outcome: "Augmented Humans 2026のPosters & Demosで発表し、会議録に論文が掲載されました。2025年10月から2026年7月まで取り組み、現在は終了しています。\nここに評価結果の概要を記載します。実験条件、心理的な評価指標、主な観察結果、および限界を追加予定です。",
      outcome: "準備中",
      // myContributions: [
        // "ここに自身の担当・貢献を記載します。構想、システム開発、評価、発表のうち、自身が担った範囲を追加予定です。",
      // ],
      myContributions: ["準備中"],
      // lessonsLearned: [
        // { body: "ここにプロジェクトを通じて得られた学びや、今後のコミュニケーション支援に向けた検討事項を記載します。" },
      // ],
      lessonsLearned: [{ body: "準備中" }],
      placeholderContent: true,
    },
  },
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
