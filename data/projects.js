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
      "FocuSpeed connects internal cognitive state with external media control, enabling adaptive playback that responds to how a listener is actually concentrating.",
    year: 2025,
    start: {
      year: 2025,
      month: 4,
    },
    status: "ongoing",
    tags: ["Neuroadaptive", "EEG", "BCI"],
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
            "People often listen to lectures, podcasts, or study materials at different levels of attention, but playback speed is usually adjusted manually and only after the listener notices a mismatch.",
        },
        {
          title: "Problem",
          body:
            "This creates friction during learning. The pace can feel too slow when attention is stable and too fast when concentration drops, yet the interface depends on repeated manual intervention.",
        },
        {
          title: "Core Idea",
          body:
            "FocuSpeed connects internal cognitive state with external media control, proposing a state-aware interaction in which estimated focus helps shape playback speed in real time.",
        },
        {
          title: "Significance",
          body:
            "The project explores a shift from explicitly operated media controls to adaptive systems that respond to internal cognitive conditions, opening a new direction for learning-oriented interaction design.",
        },
      ],
      useCase: [
        {
          title: "Use Case",
          body:
            "Designed for learners consuming spoken content such as lectures, podcasts, language-learning audio, or explanatory videos, where attention naturally fluctuates over time.",
        },
        {
          title: "What Changed",
          body:
            "Instead of repeatedly adjusting playback speed by hand, the system uses estimated cognitive state to help pace the listening experience automatically.",
        },
      ],
      outputSlugs: ["focuspeed-sichi2025"],
      relatedProjects: ["science-of-reality", "humanaugmentation"],
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
