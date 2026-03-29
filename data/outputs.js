export const outputs = [
  {
    slug: "selecting-verbal-responses-head-gestures",
    region: "international",
    title: "Selecting Verbal Responses from Head Gestures to Support Remote Communication",
    type: "publication",
    year: 2026,
    authors: ["Ryu Ishikura", "Yamato Takyo", "Kenta Shiki", "Yoshio Ishiguro"],
    equalContributionCount: 3,
    venue: "Augmented Humans 2026 Posters & Demos",
    tags: ["Poster", "Demo", "International"],
    links: {
      conference: "https://augmented-humans.org/",
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
    venue: "SICHI2025 (Human Interface Symposium 2025)",
    tags: ["Poster", "Demo", "Domestic (Japan)"],
    links: {
      conference: "https://sites.google.com/view/sichi/sichi2025",
      pdf: "assets/documents/outputs/focuspeed-sichi2025-paper.pdf",
      poster: "assets/documents/outputs/focuspeed-sichi2025-poster.pdf",
      projectDetail: "projects/focuspeed/?output=focuspeed-sichi2025",
      page: "outputs/#output-focuspeed-sichi2025",
    },
    detail: {
      role: "Researcher / Designer / Engineer",
      team: "Solo project",
      outcome:
        "Poster and demo presentation at the Human Interface Symposium 2025 Student Contest, with an Encouragement Award.",
      approach: [
        {
          title: "Interaction model",
          body:
            "The core design question was not only whether focus could be estimated, but how that estimate should meaningfully affect interaction. The project defined a model in which attention level informs playback pacing without making the behavior feel arbitrary.",
        },
        {
          title: "System structure",
          body:
            "The prototype combines EEG acquisition, signal processing, focus estimation, and playback control. These stages were kept modular so sensing performance and interaction behavior could be refined independently.",
        },
        {
          title: "Implementation strategy",
          body:
            "The system prioritized real-time responsiveness and interpretability. Rather than optimizing only for prediction accuracy, the design focused on whether speed changes would feel understandable and useful during listening.",
        },
        {
          title: "Evaluation direction",
          body:
            "The project was developed as a research prototype and presented through poster and demo formats, using live explanation and feedback to test whether the interaction concept was clear, relevant, and compelling.",
        },
      ],
      visuals: [
        {
          type: "image",
          src: "../../assets/images/project_focuspeed.png",
          alt: "FocuSpeed representative visual",
          title: "Project overview",
          caption:
            "A representative view of the FocuSpeed prototype used in presentations and documentation.",
        },
      ],
      contributions: [
        "Framed the project around a state-aware interaction concept that links internal cognitive state with external media control.",
        "Designed the overall user experience and the logic for how estimated focus should influence playback speed.",
        "Implemented the EEG signal-processing and focus-estimation pipeline for real-time interaction.",
        "Built the prototype and integrated sensing, adaptation, and presentation into a coherent end-to-end system.",
        "Prepared the poster, demo, and supporting materials for public research presentation.",
      ],
      reflection: [
        {
          title: "Learning",
          body:
            "The project clarified that adaptive systems need more than accurate estimation. They also need a clear behavioral meaning that users can understand and trust.",
        },
        {
          title: "Difficulty",
          body:
            "Working with biosignals required balancing noisy data, technical feasibility, and interaction clarity. The hardest part was making the adaptation feel conceptually coherent despite uncertainty in the signal.",
        },
        {
          title: "Next step",
          body:
            "A natural next step is to refine the estimation model and evaluate the system in longer learning sessions to better understand usability, comfort, and educational value.",
        },
      ],
      techStack: [
        {
          title: "Languages",
          items: ["Python", "JavaScript", "HTML/CSS"],
        },
        {
          title: "Frameworks / Libraries",
          items: ["MNE-Python", "Flask"],
        },
        {
          title: "Hardware",
          items: ["BITalino (EEG, ECG, EDA)"],
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
    tags: ["Website", "Static Site", "Portfolio"],
    links: {
      demo: "",
      page: "",
      github: "",
    },
  },
];

export default outputs;
