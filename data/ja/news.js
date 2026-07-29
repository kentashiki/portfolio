import news from "../news.js?v=20260729f";
import { localizeNewsTags } from "./tags.js?v=20260728g";

const translations = {
  "news-ligp-2026-excellence-award": {
    title: "LIGP 2026で優秀ラーニングイノベーション賞を受賞",
    images: [
      {
        src: "assets/images/news/2026/ligp-2026-excellence-award-certificate.jpg",
        alt: "チームAmelab M2に贈られたLIGP 2026優秀ラーニングイノベーション賞の賞状",
        width: 1470,
        height: 2165,
      },
    ],
    summary: [
      "雨宮研究室同期とチームAmelab M2として協働で取り組んだ",
      { text: "FocuSpeed", href: "work/focuspeed/" },
      "の研究成果が、",
      { text: "ラーニングイノベーショングランプリ（LIGP）2026", href: "https://ligp.gingerapp.co.jp/" },
      "の優秀ラーニングイノベーション賞を受賞しました。",
    ],
  },
  "news-uist-2026-student-innovation-contest": {
    title: "UIST 2026 Student Innovation Contestに採択",
    summary: [
      "雨宮研究室のインターン生であるYen Juichunさんが主導して応募した提案が、",
      { text: "ACM Symposium on User Interface Software and Technology（UIST）2026 Student Innovation Contest（SIC）", href: "https://uist.acm.org/2026/cfp/#sic" },
      "に採択されました。Yenさんと私の2人チームで応募し、11月にデトロイトで開催されるコンテストに参加します。",
    ],
  },
  "news-araya-visionary-lab-internship": {
    title: "株式会社アラヤ Visionary Labでインターンを開始",
    summary: [
      { text: "株式会社アラヤ", href: "https://www.araya.org/" },
      "の",
      { text: "Visionary Lab", href: "https://vl.araya.org/" },
      "でインターンを開始しました。内閣府主導のムーンショット型研究開発事業 ",
      { text: "Internet of Brains", href: "https://brains.link/" },
      "に参画し、ニューロテクノロジーの社会実装に向けた取り組みを行います。",
    ],
  },
  "news-br41n-io-designers-hackathon-2026": {
    title: "BR41N.IO Designers' Hackathon 2026に参加",
    images: [
      {
        src: "assets/images/news/2026/br41n-io-designers-hackathon-2026-online-team.jpg",
        alt: "BR41N.IO Designers' Hackathon 2026のチームメンバーとのオンライン協働",
        width: 800,
        height: 367,
      },
    ],
    summary: [
      "g.tec medical engineering GmbH主催の",
      { text: "BR41N.IO Designers' Hackathon 2026", href: "https://www.br41n.io/Spring-School-2026" },
      "に参加し、ポルトガルとブラジルの研究者の方々とオンラインで協働してニューロマーケティングのプロジェクトに取り組みました。",
    ],
  },
  "news-ahs-2026-presentation": {
    title: "AHs 2026 Posters & Demosで研究成果を発表",
    images: [
      {
        src: "assets/images/news/2026/ahs-2026-presentation-team-photo.jpg",
        alt: "AHs 2026の発表ポスター前に立つ研究チーム",
        width: 3000,
        height: 2250,
      },
      {
        src: "assets/images/news/2026/ahs-2026-presentation-demo.jpg",
        alt: "AHs 2026で来場者に頭部ジェスチャ応答システムをデモする様子",
        width: 3024,
        height: 4032,
      },
    ],
    summary: [
      "他研究室に所属する学生と協働して取り組んだ研究成果「",
      { text: "Selecting Verbal Responses from Head Gestures to Support Remote Communication", href: "outputs/#output-selecting-verbal-responses-head-gestures" },
      "」を、",
      { text: "Augmented Humans（AHs）2026", href: "https://augmented-humans.org/" },
      "のPosters & Demosトラックで発表しました。私にとって初めての国際会議での発表となりました。",
    ],
  },
  "news-ahs-2026-acceptance": {
    title: "AHs 2026 Posters & Demosに採択",
    summary: [
      "他研究室に所属する学生と協働して取り組んだ研究成果「",
      { text: "Selecting Verbal Responses from Head Gestures to Support Remote Communication", href: "outputs/#output-selecting-verbal-responses-head-gestures" },
      "」が、",
      { text: "Augmented Humans（AHs）2026", href: "https://augmented-humans.org/" },
      "のPosters & Demosトラックに採択されました。",
    ],
  },
  "news-portfolio-website-launch": {
    title: "ポートフォリオサイトを公開",
    summary:
      "プロジェクトや成果物、ニュースを広く発信するため、本ポートフォリオサイトを公開しました。制作にあたっては、GPT-5（OpenAI）とClaude（Anthropic）を活用しました。",
  },
  "news-sichi-2025-encouragement-award": {
    title: "SICHI 2025で奨励賞を受賞",
    images: [
      {
        src: "assets/images/news/2025/sichi-2025-encouragement-award-group-photo.jpg",
        alt: "SICHI 2025の奨励賞賞状を手にするチームAmelab M1のメンバー",
        width: 4240,
        height: 2832,
      },
      {
        src: "assets/images/news/2025/sichi-2025-encouragement-award-ceremony.jpg",
        alt: "SICHI 2025で奨励賞を受けるチームAmelab M1",
        width: 4000,
        height: 3000,
      },
      {
        src: "assets/images/news/2025/sichi-2025-encouragement-award-certificate.jpg",
        alt: "FocuSpeedに贈られたSICHI 2025奨励賞の賞状",
        width: 1484,
        height: 2136,
      },
    ],
    summary: [
      "雨宮研究室同期とチームAmelab M1として協働で取り組んだ研究成果「",
      { text: "FocuSpeed: 生体信号に基づいた集中度計測による音声再生速度の適応制御", href: "outputs/#output-focuspeed-sichi2025" },
      "」が、",
      { text: "ヒューマンインタフェースシンポジウム 学生コンテスト SICHI 2025", href: "https://sites.google.com/view/sichi/sichi2025" },
      "の奨励賞を受賞しました。私にとって初めての受賞となりました。",
    ],
  },
  "news-sichi-2025-presentation": {
    title: "SICHI 2025で研究成果を発表",
    images: [
      {
        src: "assets/images/news/2025/sichi-2025-presentation-demo.jpg",
        alt: "SICHI 2025で来場者にFocuSpeedをデモする様子",
        width: 5712,
        height: 4284,
      },
      {
        src: "assets/images/news/2025/sichi-2025-presentation-booth.jpg",
        alt: "SICHI 2025の会場に設けられたFocuSpeedのポスター・デモブース",
        width: 4032,
        height: 3024,
      },
    ],
    summary: [
      "雨宮研究室同期とチームAmelab M1として協働で取り組んだ研究成果「",
      { text: "FocuSpeed: 生体信号に基づいた集中度計測による音声再生速度の適応制御", href: "outputs/#output-focuspeed-sichi2025" },
      "」を、",
      { text: "ヒューマンインタフェースシンポジウム 学生コンテスト SICHI 2025", href: "https://sites.google.com/view/sichi/sichi2025" },
      "でポスター・デモ発表しました。私にとって初めての学会発表となりました。",
    ],
  },
  "news-ntt-rd-summer-internship-2025": {
    title: "NTT R&Dでの夏期実習を修了",
    summary:
      "NTT人間情報研究所にて、「様々な感覚刺激に対する脳波反応に基づく主観的印象のデコード技術に関する検討」のテーマで4週間の夏期実習に取り組みました。",
  },
  "news-university-of-tokyo-graduate-study": {
    title: "東京大学大学院の修士課程に進学",
    summary: [
      "東京大学大学院の修士課程に進学し、",
      { text: "雨宮研究室", href: "https://www.amelab.vr.u-tokyo.ac.jp/home" },
      "で研究を開始しました。",
    ],
  },
  "news-uec-bachelor-degree": {
    title: "電気通信大学を卒業",
    summary: "電気通信大学を卒業し、学士（工学）の学位を取得しました。",
  },
};

export default news.map((item) => ({
  ...item,
  ...(translations[item.id] || {}),
  tags: localizeNewsTags(item.tags),
}));
