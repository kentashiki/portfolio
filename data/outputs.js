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
      role: "Researcher & Engineer",
      team: "Team Amelab M1 (Kenta Shiki, Tsukihi Sasao, Yuhi Hasegawa, Masatoshi Watanabe)",
      outcome:
        "Presented a poster and interactive demo at SICHI 2025, the student contest of the Human Interface Symposium 2025, where the project received an Encouragement Award.",
      implementation: [
        {
          title: "System Structure",
          body:
            "FocuSpeed consists of two main components: a biosignal acquisition device and a computer for real-time processing. The acquired signals are streamed to the computer via Lab Streaming Layer (LSL).",
        },
        {
          title: "Signal Processing",
          body:
            "Incoming biosignals are buffered and periodically segmented for processing. The data undergo basic preprocessing, followed by feature extraction (e.g., power spectral density (PSD) for EEG).",
        },
        {
          title: "Speed Determination",
          body:
            "Extracted features, along with candidate playback speeds, are fed into a pretrained machine learning model that predicts a comprehension score. The model is trained using data from a preliminary dictation task. The system selects the fastest speed that satisfies a predefined comprehension threshold and updates playback speed in real time.",
        },
        {
          title: "Evaluation",
          body:
            "The system was evaluated under three conditions: fast-fixed (1.5×), normal-fixed (1.0×), and adaptive (FocuSpeed).",
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
      myContributions: [
        "Contributed to the ideation process through structured brainstorming",
        "Conducted a literature review of prior work on neuroadaptive systems and biosignal-based interaction.",
        "Managed the overall project timeline to ensure timely progress across all development phases.",
        "Designed and implemented the real-time pipeline for biosignal processing and adaptive playback speed determination.",
        "Built the system prototype and user interface for the interactive demo.",
        "Integrated the pipeline into the experimental system.",
        "Designed the demo experience to make system behavior intuitive and perceivable.",
        "Designed and prepared the poster, slides, and supporting materials for the presentation.",
      ],
      lessonsLearned: [
        {
          title: "Key Insights",
          body:
            "We found that designing systems based on users’ cognitive states is inherently challenging, as such states are not directly observable and are often difficult for users themselves to recognize. This makes it difficult to design interactions that are both accurate and intuitively understandable. This highlights the importance of designing closed-loop systems that not only adapt to users’ internal states but also make those adaptations perceptible and interpretable.",
        },
        {
          title: "Challenges",
          body:
            "Working with biosignals required careful experimental design and robust handling of noisy data. In particular, maintaining a stable measurement environment was critical and proved to be the most challenging aspect of the system.",
        },
        {
          title: "Future work",
          body:
            "As a next step, we plan to improve signal reliability by introducing more robust data acquisition and preprocessing techniques. Building on this, we aim to refine the estimation model to achieve more accurate and stable adaptation.",
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
    tags: ["Website"],
    links: {
      demo: "",
      page: "",
      github: "",
    },
  },
];

export default outputs;
