export const projects = [
  {
    slug: "science-of-reality",
    title: "Science of Reality",
    summary:
      "Through VR systems that reconstruct sensory experience, I explore what reality feels like and how it can be studied scientifically.",
    year: 2026,
    start: {
      year: 2025,
      month: 4,
    },
    status: "ongoing",
    tags: ["Haptics", "Virtual Reality", "EEG", "Sense of Reality"],
    featured: true,
    links: {
      page: "projects/#project-science-of-reality",
    },
    thumbnail: "assets/images/project_science-of-reality.png",
  },
  {
    slug: "focuspeed",
    title: "FocuSpeed",
    summary:
      "FocuSpeed is a neuroadaptive system that dynamically adjusts audio playback speed based on the user’s cognitive state estimated from biosignals.",
    year: 2025,
    start: {
      year: 2025,
      month: 4,
    },
    status: "ongoing",
    tags: ["Neuroadaptive", "EEG", "Auditory Learning", "BCI"],
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
    year: 2025,
    start: {
      year: 2025,
      month: 10,
    },
    status: "ongoing",
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
    year: 2025,
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
