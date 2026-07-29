export const outputs = [
  {
    slug: "selecting-verbal-responses-head-gestures",
    themeSlugs: ["ai-mediated-nonverbal-interaction"],
    projectSlug: "ai-agent-response-selection",
    region: "international",
    title: "Selecting Verbal Responses from Head Gestures to Support Remote Communication",
    type: "publication",
    year: 2026,
    authors: [
      "Ryu Ishikura",
      "Yamato Takyo",
      "Kenta Shiki",
      "Yoshio Ishiguro"
    ],
    equalContributionCount: 3,
    venue: "Augmented Humans (AHs) 2026 Posters & Demos",
    tags: ["Poster", "Demo", "International"],
    links: {
      conference: "https://augmented-humans.org/",
      paper: "https://dl.acm.org/doi/10.1145/3795011.3797418",
      page: "outputs/#output-selecting-verbal-responses-head-gestures",
    },
  },
  {
    slug: "focuspeed-sichi2025",
    themeSlugs: ["neuroadaptive-hci"],
    projectSlug: "focuspeed",
    region: "domestic",
    title: "FocuSpeed: Adaptive Control of Speech Playback Speed Based on Concentration Level Estimated from Biosignals",
    type: "presentation",
    year: 2025,
    authors: [
      "Kenta Shiki",
      "Tsukihi Sasao",
      "Yuhi Hasegawa",
      "Masatoshi Watanabe",
      "Keigo Ushiyama",
      "Tomohiro Amemiya",
    ],
    venue: "Student Innovation Contest at Human Interface Symposium (SICHI) 2025",
    tags: ["Poster", "Demo", "Domestic (Japan)"],
    links: {
      conference: "https://sites.google.com/view/sichi/sichi2025",
      paper: "assets/documents/outputs/focuspeed-sichi2025-paper.pdf",
      poster: "assets/documents/outputs/focuspeed-sichi2025-poster.pdf",
      projectDetail: "work/focuspeed/?output=focuspeed-sichi2025",
      page: "outputs/#output-focuspeed-sichi2025",
    },
    detail: {
      myContributions: [
        "Conducted brainstorming and a literature review to develop a system using BITalino, the device specified for the contest, and contributed to the team’s initial concept development.",
        "Designed and implemented the biosignal processing pipeline, including preprocessing and feature extraction, the adaptive playback logic, and the prototype UI for the demo presentation.",
        "Managed project progress and sent reminders to team members as needed.",
        "Prepared initial drafts of the poster and slides for the demo presentation.",
      ],
      lessonsLearned: [
        {
          body:
            "Measuring biosignals impressed upon me both the importance and difficulty of minimizing noise contamination. Because FocuSpeed deals with levels of concentration that users themselves may find difficult to recognize, I also struggled to communicate the system’s behavior clearly during the demo presentation. This experience taught me that technical polish alone is not enough; it is equally important to present the system in a way that makes its behavior and value understandable.",
        },
      ],
    },
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    type: "webapp",
    year: 2025,
    authors: [],
    venue: "",
    description:
      "A portfolio website bringing together my projects, outputs, and ongoing explorations, created with the assistance of GPT-5 (OpenAI) and Claude (Anthropic).",
    tags: ["Website"],
    links: {
      demo: "https://kentashiki.github.io/portfolio/",
      page: "",
      github: "",
    },
  },
];

export default outputs;
