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
      page: "work/virtual-softness-eeg/",
    },
    thumbnail: "assets/images/project_virtual-softness-eeg.png",
    detail: {
      // AI-generated draft text is commented out pending author review.
      heroImage: {
        // alt: "Physical and virtual softness stimuli, an EEG recording setup, and neural analysis of tactile perception",
        alt: "EEG Characteristics of Virtual Softness Perception",
      },
      overview: [
        {
          title: "Background",
          // body: "Virtual tactile experiences require ways to understand how users perceive the stimuli presented by a haptic device. This project focuses on softness perception and its relationship with EEG responses.",
          body: "In preparation",
        },
        {
          title: "Problem",
          // body: "How can we evaluate the experience of touching a virtual object? This project investigates EEG responses to softness as a step toward understanding and objectively evaluating subjective tactile experiences.",
          body: "In preparation",
        },
        {
          title: "Approach",
          // body: "We compare EEG responses to physical softness stimuli and virtual softness stimuli presented through a haptic device. The aim is to examine neural characteristics related to softness perception and the perceived realism of virtual stimuli.",
          body: "In preparation",
        },
        {
          title: "Significance",
          // body: "The broader goal is to connect our understanding of human perception with the design and evaluation of haptic experiences, supporting the development of virtual environments that feel more convincing to users.",
          body: "In preparation",
        },
        {
          title: "Use Case",
          // body: "The project aims to inform the evaluation of virtual softness presented by haptic devices, including the perceived realism of the resulting tactile experience.",
          body: "In preparation",
        },
      ],
      techStack: [
        {
          title: "Hardware",
          // items: ["EEG recording equipment", "Haptic device"],
          items: ["In preparation"],
        },
      ],
      outputSlugs: ["temporal-eeg-softness-sfn2026"],
      footer: {
        backHref: "../../work/",
        backLabel: "Back to Work",
      },
    },
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
    end: {
      year: 2026,
      month: 7,
    },
    status: "completed",
    tags: ["Head Gestures", "IMU", "AI Agents", "Verbal Responses", "Remote Meetings"],
    featured: true,
    links: {
      page: "work/ai-agent-response-selection/",
      paper: "https://dl.acm.org/doi/10.1145/3795011.3797418",
    },
    thumbnail: "assets/images/project_ai-agent-response-selection.png",
    detail: {
      // AI-generated draft text is commented out pending author review.
      heroImage: {
        // alt: "An AI agent conveys a listener’s IMU-sensed head gestures to a remote speaker through verbal responses",
        alt: "AI-Agent Response Selection from IMU-Sensed Head Gestures",
      },
      overview: [
        {
          title: "Background",
          // body: "Remote communication involves both spoken content and nonverbal reactions from listeners. This project focused on head gestures as a signal that an AI agent could convey through verbal responses.",
          body: "In preparation",
        },
        {
          title: "Problem",
          // body: "How can an AI agent convey a listener’s nonverbal reactions to a remote speaker? This project explored a form of communication support that connects head gestures with verbal responses.",
          body: "In preparation",
        },
        {
          title: "Approach",
          // body: "We developed a system that detects the listener’s head gestures using an IMU sensor and selects verbal responses for an AI agent to deliver to the speaker. We also evaluated the system’s psychological effects.",
          body: "In preparation",
        },
        {
          title: "Significance",
          // body: "The project explored how AI can mediate between nonverbal behavior and spoken feedback, with the aim of supporting communication in remote meetings.",
          body: "In preparation",
        },
        {
          title: "Use Case",
          // body: "The system was designed for remote meetings, where an AI agent delivers verbal responses to a speaker based on head gestures detected from the listener.",
          body: "In preparation",
        },
      ],
      techStack: [
        {
          title: "Hardware",
          // items: ["IMU sensor"],
          items: ["In preparation"],
        },
      ],
      outputSlugs: ["selecting-verbal-responses-head-gestures"],
      footer: {
        backHref: "../../work/",
        backLabel: "Back to Work",
      },
    },
  },
  {
    slug: "biosword",
    themeSlugs: ["athletic-biofeedback-interfaces"],
    title: "Bio-Sword",
    summary:
      "Bio-Sword is a biofeedback system for kendo, a Japanese budo (martial way). Using biosignals and motion data from IMU sensors, it helps practitioners reflect on their mental and physical states during training and improve mental-state regulation.",
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
    end: {
      year: 2026,
      month: 9,
    },
    status: "completed",
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
