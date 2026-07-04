export const outputs = [
  {
    slug: "selecting-verbal-responses-head-gestures",
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
      projectDetail: "projects/focuspeed/?output=focuspeed-sichi2025",
      page: "outputs/#output-focuspeed-sichi2025",
    },
    detail: {
      role: "Researcher & Engineer",
      team: "Team Amelab M1 (Kenta Shiki, Tsukihi Sasao, Yuhi Hasegawa, Masatoshi Watanabe)",
      outcome:
        "Presented a poster and interactive demo at SICHI 2025, the student contest of the Human Interface Symposium 2025, where the project received an Encouragement Award.",
      implementation: [
        {
          title: "Real-time Adaptive Pipeline",
          body:
            "Built a prototype that streams biosignals via Lab Streaming Layer (LSL), extracts EEG features, estimates comprehension, and updates speech playback speed in real time.",
        },
        {
          title: "Evaluation Setup",
          body:
            "Prepared a comparison between fixed playback speeds and adaptive control to demonstrate the system concept in the SICHI 2025 poster and demo.",
        },
      ],
      myContributions: [
        "Framed the concept through brainstorming and literature review on neuroadaptive interaction.",
        "Designed and implemented the biosignal processing pipeline, adaptive playback logic, prototype UI, and demo system.",
        "Managed project progress and prepared presentation materials including the poster, slides, and demo flow.",
      ],
      lessonsLearned: [
        {
          body:
            "Working with biosignals made clear how difficult it is to design around cognitive states that are noisy, indirect, and hard for users to perceive. The project reinforced the importance of making adaptive behavior both technically robust and understandable to users.",
        },
      ],
      relatedAwards: ["sichi2025-encouragement-award"],
    },
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    type: "webapp",
    year: 2025,
    authors: [],
    venue: "",
    tags: ["Website"],
    links: {
      demo: "https://kentashiki.github.io/portfolio/",
      page: "",
      github: "",
    },
  },
];

export default outputs;
