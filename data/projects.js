export const projects = [
  {
    slug: "evaluation-of-haptics",
    title: "EEG-Based Evaluation of Subjective Haptic Experience",
    summary:
      "This project investigates EEG characteristics associated with virtual tactile sensations presented by haptic devices, aiming to clarify the neural basis of subjective haptic experience and explore objective metrics for evaluating and improving haptic interfaces.",
    start: {
      year: 2025,
      month: 4,
    },
    status: "active",
    tags: ["Haptics", "Tactile Perception", "EEG", "Evaluation Metrics"],
    featured: true,
    links: {
      page: "projects/#project-evaluation-of-haptics",
    },
    thumbnail: "assets/images/project_evaluation-of-haptics.png",
  },
  {
    slug: "focuspeed",
    title: "FocuSpeed",
    summary:
      "FocuSpeed is a proof-of-concept neuroadaptive system that dynamically adjusts audio playback speed based on the user’s cognitive state estimated from biosignals.",
    start: {
      year: 2025,
      month: 4,
    },
    status: "active",
    tags: ["Neuroadaptive System", "EEG", "Auditory Learning", "Passive BCI"],
    featured: true,
    period: "Apr 2025 - Present",
    links: {
      page: "projects/focuspeed/",
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
        title: "LIGP 2026 application video",
        caption:
          "Application video submitted to Learning Innovation Grand Prix (LIGP) 2026.",
      },
      overview: [
        {
          title: "Background",
          body:
            "To improve time efficiency in media consumption and auditory learning, many users increase playback speed. However, faster playback often leads to decreased attention and frequent rewinding to recover missed information.",
        },
        {
          title: "Problem",
          body:
            "This behavior undermines the intended time savings and disrupts efficient learning. Moreover, existing playback controls rely heavily on manual adjustments, placing the burden on users to continuously regulate their listening experience.",
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
        backHref: "../../projects/",
        backLabel: "Back to Projects",
      },
    },
  },
  {
    slug: "humanaugmentation",
    title: "Human Augmentation Project",
    summary:
      "A collaborative class project exploring how interactive systems can help people externalize and verbalize emerging ideas.",
    start: {
      year: 2025,
      month: 10,
    },
    status: "active",
    tags: ["Human Augmentation", "HCI", "Prototype", "NLP"],
    featured: true,
    links: {
      page: "projects/#project-humanaugmentation",
    },
    thumbnail: "assets/images/project_furitalk.png",
  },
  {
    slug: "visual-attention-research",
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
    tags: ["Visual Attention", "Psychophysics", "Neuroscience"],
    featured: false,
    links: {
      page: "projects/#project-visual-attention-research",
    },
    thumbnail: "assets/images/project_visual-attention.png",
  },
];

export default projects;
