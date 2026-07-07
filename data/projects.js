export const projects = [
  {
    slug: "virtual-softness-eeg",
    themeSlugs: ["neural-evaluation-of-subjective-experiences"],
    title: "EEG Characteristics of Virtual Softness Perception",
    summary:
      "This project investigates EEG characteristics associated with virtual softness sensations presented by haptic devices, aiming to clarify the neural basis of subjective haptic experience by comparing EEG responses to virtual and real softness stimuli.",
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
        alt: "Overview image of the FocuSpeed project",
        caption:
          "FocuSpeed explores how estimated attention can shape media control in real time.",
      },
      featuredVideo: {
        type: "youtube",
        src: "https://www.youtube.com/watch?v=T_i72F27xVs",
        title: "LIGP 2026 application video (Japanese)",
        caption:
          "Application video submitted to Learning Innovation Grand Prix (LIGP) 2026.",
      },
      overview: [
        {
          title: "Background",
          body:
            "Many users increase playback speed when watching videos or listening to audio content to save time. However, faster playback can reduce comprehension and force users to rewind to recover missed information, offsetting the time savings.",
        },
        {
          title: "Problem",
          body:
            "Many existing adaptive learning systems depend on external factors, such as task difficulty and content complexity, or behavioral indicators, such as task progress. Relatively few systems use biosignals to estimate users' cognitive states. Moreover, most adaptive learning systems assume visual learning scenarios, such as reading. Auditory learning is more passive: listeners cannot adjust the pace unless they manually change the playback rate, while readers can naturally vary their reading speed based on their understanding.",
        },
        {
          title: "Approach",
          body:
            "We developed FocuSpeed, a closed-loop system that continuously estimates users’ cognitive states from real-time biosignals (e.g., EEG) and adaptively modulates playback speed accordingly.",
        },
        {
          title: "Significance",
          body:
            "This project explores a shift from user-driven media control to neuroadaptive interaction, where systems respond to users’ internal cognitive states. Such an approach is particularly impactful in auditory learning, where interaction is inherently limited and passive.",
        },
      ],
      useCase: [
        {
          title: "Scenario",
          body:
            "Learners listening to audio content such as podcasts or audiobooks—especially during activities like commuting or studying—often adjust playback speed to improve efficiency, but struggle to maintain comprehension at higher speeds as their attention fluctuates.",
        },
        {
          title: "Impact",
          body:
            "FocuSpeed reduces the need for manual playback control by automatically adapting to the user’s cognitive state, enabling more efficient learning while maintaining comprehension.",
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
      "This project explores the potential psychological effects of AI-generated verbal responses when speakers cannot see listeners' reactions in remote communication settings.",
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
      "Biosword is a biofeedback training prototype that combines VR sword interaction with physiological and motion sensing to help athletes reflect on mental and bodily states during practice.",
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
    slug: "visual-attention",
    themeSlugs: [],
    title: "Visual Attention Research",
    summary:
      "Psychophysical experiments investigating mechanisms of visual attention in human information processing.",
    start: {
      year: 2024,
      month: 4,
    },
    end: {
      year: 2025,
      month: 3,
    },
    status: "completed",
    tags: ["Visual Attention", "Psychophysics", "Human Perception", "Behavioral Experiments"],
    featured: false,
    links: {
      page: "work/#project-visual-attention",
    },
    thumbnail: "assets/images/project_visual-attention.png",
  },
];

export default projects;
