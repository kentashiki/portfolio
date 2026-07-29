import workThemes from "../workThemes.js";

const translations = {
  "neuroadaptive-hci": {
    title: "認知状態に適応するインタラクション",
    summary:
      "ユーザの認知状態にリアルタイムで適応するインタフェースの研究開発に取り組んでいます。",
    tags: ["Neuroadaptive Interaction", "BCI", "適応システム", "生体信号"],
  },
  "neural-evaluation-of-subjective-experiences": {
    title: "脳波による主観的体験の評価",
    summary:
      "触感や嗅覚をはじめとする主観的な体験を、脳活動計測によって客観的に評価する手法を探究しています。",
    tags: ["主観的体験", "脳波", "知覚・感覚", "評価指標"],
  },
  "ai-mediated-nonverbal-interaction": {
    title: "AIが媒介する非言語インタラクション",
    summary:
      "AIエージェントがユーザの頭部動作などの非言語行動を解釈し、コミュニケーションに反映することで、より円滑な対話を支援する方法を探究しています。",
    tags: [
      "Human-AI Interaction",
      "非言語情報",
      "遠隔コミュニケーション",
      "AIによる対話支援",
    ],
  },
  "athletic-biofeedback-interfaces": {
    title: "スポーツ競技者のメンタルトレーニングを支援するバイオフィードバックシステム",
    summary:
      "生体信号から推定した心理状態を競技者にフィードバックし、メンタルトレーニングを支援するシステムを研究・開発しています。",
    tags: ["バイオフィードバック", "メンタルトレーニング", "スポーツ", "自己調整"],
  },
};

export default workThemes.map((theme) => ({
  ...theme,
  ...(translations[theme.slug] || {}),
}));
