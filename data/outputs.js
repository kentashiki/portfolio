export const outputs = [
  {
    slug: "bio-sword-uist2026",
    themeSlugs: ["athletic-biofeedback-interfaces"],
    projectSlug: "biosword",
    region: "international",
    title: "Bio-Sword: Bio-Responsive Feedback for Virtual Sword Training",
    type: "publication",
    status: "upcoming",
    date: "2026-11-03",
    year: 2026,
    authors: ["Juichun Yen", "Kenta Shiki"],
    venue: "ACM Symposium on User Interface Software and Technology (UIST 2026 Adjunct) — Student Innovation Contest",
    tags: ["Poster", "Demo", "International"],
    links: {
      conference: "https://uist.acm.org/2026/",
      page: "outputs/#output-bio-sword-uist2026",
    },
  },
  {
    slug: "temporal-eeg-softness-sfn2026",
    themeSlugs: ["neural-evaluation-of-subjective-experiences"],
    projectSlug: "virtual-softness-eeg",
    region: "international",
    title: "Temporal EEG dynamics of tactile softness perception during passive touch",
    type: "presentation",
    status: "upcoming",
    date: "2026-11-16",
    year: 2026,
    authors: [
      "Kenta Shiki",
      "Keigo Ushiyama",
      "Daiki Kodama",
      "Shinya Shimizu",
      "Tomohiro Amemiya",
    ],
    venue: "Neuroscience 2026 (Society for Neuroscience, SfN) — Late-Breaking Abstract",
    tags: ["Poster", "International"],
    links: {
      conference: "https://www.sfn.org/meetings/neuroscience-2026/",
      page: "outputs/#output-temporal-eeg-softness-sfn2026",
      projectDetail: "work/virtual-softness-eeg/",
    },
    detail: {
      // AI-generated draft text is commented out pending author review.
      // outcome: "This research is ongoing. The work has been accepted as a Late-Breaking Abstract at Neuroscience 2026, with a poster presentation scheduled for November 2026.\nA summary of the research findings will be added here, including the evaluation conditions, key observations, and their implications.",
      outcome: "In preparation",
      // myContributions: [
        // "A description of my role and contributions will be added here, covering the research question, study design, data collection, analysis, and presentation as applicable.",
      // ],
      myContributions: ["In preparation"],
      // lessonsLearned: [
        // { body: "Reflections on the research process, lessons learned, and future directions will be added here." },
      // ],
      lessonsLearned: [{ body: "In preparation" }],
      placeholderContent: true,
    },
  },
  {
    slug: "selecting-verbal-responses-head-gestures",
    themeSlugs: ["ai-mediated-nonverbal-interaction"],
    projectSlug: "ai-agent-response-selection",
    region: "international",
    title: "Selecting Verbal Responses from Head Gestures to Support Remote Communication",
    type: "publication",
    date: "2026-03-18",
    year: 2026,
    authors: [
      "Ryu Ishikura",
      "Yamato Takyo",
      "Kenta Shiki",
      "Yoshio Ishiguro"
    ],
    equalContributionCount: 3,
    venue: "Augmented Humans (AHs) International Conference 2026 — Posters & Demos",
    tags: ["Poster", "Demo", "International"],
    links: {
      conference: "https://2026.augmented-humans.org/",
      paper: "https://dl.acm.org/doi/10.1145/3795011.3797418",
      page: "outputs/#output-selecting-verbal-responses-head-gestures",
      projectDetail: "work/ai-agent-response-selection/",
    },
    detail: {
      // AI-generated draft text is commented out pending author review.
      // outcome: "The work was presented in the Posters & Demos track at Augmented Humans 2026 and published in the conference proceedings. The project ran from October 2025 to July 2026 and is now complete.\nA summary of the evaluation results will be added here, including the study conditions, psychological measures, key observations, and limitations.",
      outcome: "In preparation",
      // myContributions: [
        // "A description of my role and contributions will be added here, including the parts of the concept, system development, evaluation, and presentation that I was responsible for.",
      // ],
      myContributions: ["In preparation"],
      // lessonsLearned: [
        // { body: "Reflections on the project, lessons learned, and considerations for future communication support will be added here." },
      // ],
      lessonsLearned: [{ body: "In preparation" }],
      placeholderContent: true,
    },
  },
  {
    slug: "focuspeed-sichi2025",
    themeSlugs: ["neuroadaptive-hci"],
    projectSlug: "focuspeed",
    region: "domestic",
    title: "FocuSpeed: Adaptive Control of Speech Playback Speed Based on Concentration Level Estimated from Biosignals",
    type: "presentation",
    date: "2025-09-10",
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
    date: "2025-12-01",
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
