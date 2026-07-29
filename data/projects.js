export const projects = [
  {
    slug: "virtual-softness-eeg",
    themeSlugs: ["neural-evaluation-of-subjective-experiences"],
    title: "EEG Characteristics of Virtual Softness Perception",
    summary:
      "This project compares EEG responses to physical softness stimuli and virtual softness stimuli presented through a haptic device to investigate whether subjective experiences, such as the perceived realism of virtual stimuli, can be evaluated objectively.",
    start: {
      year: 2025,
      month: 4,
    },
    status: "active",
    tags: ["Softness", "Haptics", "EEG", "Tactile Perception", "Haptic Devices"],
    featured: true,
    links: {
      page: "work/#project-virtual-softness-eeg",
    },
    thumbnail: "assets/images/project_virtual-softness-eeg.png",
  },
  {
    slug: "olfactory-subjective-impressions-eeg",
    themeSlugs: ["neural-evaluation-of-subjective-experiences"],
    title:
      "A Study on Techniques for Decoding Subjective Impressions Based on EEG Responses to Various Sensory Stimuli",
    summary:
      "I conducted an experiment measuring EEG responses to various olfactory stimuli and investigated neural characteristics associated with subjective intensity and pleasantness or unpleasantness. This project was carried out as a four-week summer internship at NTT Human Informatics Laboratories.",
    start: {
      year: 2025,
      month: 8,
    },
    end: {
      year: 2025,
      month: 9,
    },
    status: "completed",
    tags: [
      "Olfactory Stimuli",
      "Valence",
      "EEG",
      "Subjective Intensity",
      "Event-Related Potentials (ERP)",
    ],
    featured: false,
    links: {},
  },
  {
    slug: "focuspeed",
    themeSlugs: ["neuroadaptive-hci"],
    title: "FocuSpeed",
    summary:
      "FocuSpeed is a proof-of-concept neuroadaptive system that dynamically adjusts audio playback speed based on the user’s cognitive state, estimated from biosignals.",
    start: {
      year: 2025,
      month: 4,
    },
    status: "active",
    tags: ["EEG", "Auditory Learning", "Playback Control", "Real-Time Adaptation", "Passive BCI"],
    featured: true,
    links: {
      page: "work/focuspeed/",
    },
    thumbnail: "assets/images/project_focuspeed.png",
    detail: {
      heroImage: {
        alt: "FocuSpeed playing audio at 2x speed during high engagement and 1x speed during low engagement",
      },
      featuredVideo: {
        type: "youtube",
        src: "https://www.youtube.com/watch?v=T_i72F27xVs",
        title: "Learning Innovation Grand Prix (LIGP) 2026 Application Video (Japanese)",
      },
      overview: [
        {
          title: "Background",
          body:
            "In recent years, people have placed growing emphasis on getting the most value from their time, and consuming video and audio content at higher playback speeds has become increasingly common. However, faster playback can make it easier to miss information, potentially offsetting the time saved.",
        },
        {
          title: "Problem",
          body:
            "Conventional playback requires users to adjust the speed manually and cannot respond to moment-to-moment changes in attention. Moreover, many existing adaptive learning systems rely on external factors or behavioral indicators, such as task difficulty and progress. Approaches that directly estimate cognitive states from biosignals and reflect them in playback speed remain underexplored.",
        },
        {
          title: "Approach",
          body:
            "We developed FocuSpeed, a closed-loop neuroadaptive system that continuously estimates the user’s cognitive state from biosignals, including EEG, and adjusts audio playback speed accordingly.",
        },
        {
          title: "Significance",
          body:
            "This project explores a shift from conventional media control, in which users operate the system themselves, toward neuroadaptive interaction, in which the system directly estimates and automatically responds to their internal cognitive state. It has considerable potential for auditory learning, which often takes place alongside other activities and otherwise requires manual input to change the pace of presentation.",
        },
        {
          title: "Use Case",
          body:
            "FocuSpeed is intended for listening while engaged in other activities, such as commuting or doing household chores. In such everyday settings, however, there is a trade-off between freedom of movement and EEG signal quality. FocuSpeed monitors dynamically changing levels of attention and adapts playback accordingly—for example, speeding up when the user is focused and slowing down when attention wanes. The goal is to support efficient learning while maintaining comprehension, without requiring manual control.",
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
      outputSlugs: ["focuspeed-sichi2025"],
      footer: {
        backHref: "../../work/",
        backLabel: "Back to Work",
      },
    },
  },
  {
    slug: "ai-agent-response-selection",
    themeSlugs: ["ai-mediated-nonverbal-interaction"],
    title: "AI-Agent Response Selection from IMU-Sensed Head Gestures",
    summary:
      "We developed a system in which an AI agent responds verbally to the speaker based on the listener’s head gestures, and we evaluated its psychological effects.",
    start: {
      year: 2025,
      month: 10,
    },
    status: "active",
    tags: ["Head Gestures", "IMU", "AI Agents", "Verbal Responses", "Remote Meetings"],
    featured: true,
    links: {
      page: "work/#project-ai-agent-response-selection",
    },
    thumbnail: "assets/images/project_ai-agent-response-selection.png",
  },
  {
    slug: "biosword",
    themeSlugs: ["athletic-biofeedback-interfaces"],
    title: "Biosword",
    summary:
      "Biosword is a biofeedback system for kendo, a Japanese budo (martial way). Using biosignals and motion data from IMU sensors, it helps practitioners reflect on their mental and physical states during training and improve mental-state regulation.",
    start: {
      year: 2026,
      month: 7,
    },
    status: "active",
    tags: ["VR", "Kendo", "EDA", "PPG", "IMU"],
    featured: false,
    links: {
      page: "work/#project-biosword",
    },
    thumbnail: "assets/images/project_biosword.png",
  },
  {
    slug: "complirole",
    themeSlugs: [],
    title: "CompliRole",
    summary:
      "CompliRole is an AI role-play system that uses retrieval-augmented generation (RAG) to draw on a company’s training materials and act as a conversational partner in realistic workplace scenarios, with the goal of improving training effectiveness.",
    start: {
      year: 2026,
      month: 6,
    },
    status: "active",
    tags: [
      "Role-Play",
      "RAG",
      "Employee Training",
      "Interactive Learning",
      "Workplace Simulation",
    ],
    featured: false,
    links: {},
  },
  {
    slug: "visual-attention",
    themeSlugs: [],
    title: "A study of bottom-up visual attention dependent on object categories",
    summary:
      "This study used psychophysical experiments to investigate how object categories influence bottom-up visual attention. It was conducted as my undergraduate thesis research in the Miyawaki Lab at The University of Electro-Communications.",
    start: {
      year: 2024,
      month: 4,
    },
    end: {
      year: 2025,
      month: 3,
    },
    status: "completed",
    tags: [
      "Visual Attention",
      "Psychophysics",
      "Human Perception",
      "Behavioral Experiments",
      "Object Categories",
    ],
    featured: false,
    links: {
      page: "work/#project-visual-attention",
    },
    thumbnail: "assets/images/project_visual-attention.png",
  },
];

export default projects;
