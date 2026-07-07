# Work Themes Data Structure

This document defines how work theme records in `data/workThemes.js` should be
structured. Work themes are higher-level areas of inquiry, craft, or practice
that group concrete projects, systems, outputs, and awards.

## Recommended Shape

```js
{
  slug: "neuroadaptive-hci",
  title: "Neuroadaptive Human-Computer Interaction",
  summary:
    "Research on interactive systems that estimate users' cognitive or affective states from biosignals and adapt their behavior in real time.",
  tags: ["Neuroadaptive Interaction", "BCI", "Adaptive Systems", "Biosignals"],
  projectSlugs: ["focuspeed"],
  outputSlugs: ["focuspeed-sichi2025"],
  awardSlugs: ["sichi2025-encouragement-award"],
}
```

## Attribute Roles

| Attribute | Required | Role | Notes |
| --- | --- | --- | --- |
| `slug` | Yes | Stable unique identifier for the theme. | Use lowercase kebab-case. Other data files reference this value through `themeSlugs`. |
| `title` | Yes | Public-facing work theme title. | Use an abstract theme title rather than a system or experiment name. |
| `summary` | Recommended | Short explanation of the central question, area, or practice. | Useful for future theme pages and grouped views. |
| `tags` | Recommended | Broader areas, questions, or intellectual directions. | Keep tags abstract and reusable across projects. See `docs/tagging-guidelines.md`. |
| `projectSlugs` | Recommended | Concrete projects or systems under this theme. | Values should match `data/projects.js` `slug` values. |
| `outputSlugs` | Recommended | Publications, posters, demos, or other outputs under this theme. | Values should match `data/outputs.js` `slug` values. |
| `awardSlugs` | Recommended | Awards connected to this theme. | Values should match `data/awards.js` `slug` values. |

## Relationship To Projects

Work themes and projects intentionally model different levels:

- `workThemes.js` describes the abstract theme, research area, or practice.
- `projects.js` describes concrete systems, prototypes, experiments, or class
  projects.
- `outputs.js` describes publications, posters, demos, presentations, and web
  artifacts.
- `awards.js` describes recognitions, awards, grants, and selections.

Projects, outputs, and awards can reference one or more work themes with
`themeSlugs`:

```js
{
  slug: "focuspeed",
  themeSlugs: ["neuroadaptive-hci"],
  title: "FocuSpeed",
}
```

Use an array rather than a single `themeSlug` because some future work may sit
between multiple themes.

## Theme Granularity

Keep themes separate when the central research question differs, even if they
share methods such as EEG, biosignals, or HCI:

- Neural evaluation themes focus on measurement and evaluation of experience.
- Neuroadaptive HCI themes focus on systems that adapt to internal user states.
- AI-mediated interaction themes focus on communication mediated by AI
  interpretation of human behavior.
- Biofeedback themes focus on self-regulation, training, and feedback loops.

Merge themes only when their target users, research question, and contribution
type are mostly the same.
