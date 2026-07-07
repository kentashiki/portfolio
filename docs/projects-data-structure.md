# Projects Data Structure

This document defines how project records in `data/projects.js` should be
structured. Projects are the main portfolio units: research projects, prototypes,
class projects, and long-running explorations.

## Recommended Shape

```js
{
  slug: "focuspeed",
  themeSlugs: ["neuroadaptive-hci"],
  title: "FocuSpeed",
  summary:
    "FocuSpeed is a proof-of-concept neuroadaptive system that dynamically adjusts audio playback speed.",
  start: {
    year: 2025,
    month: 4,
  },
  end: {
    year: 2026,
    month: 3,
  },
  status: "active",
  tags: ["Neuroadaptive System", "EEG", "Auditory Learning"],
  featured: true,
  links: {
    page: "work/focuspeed/",
    demo: "",
    github: "",
  },
  thumbnail: "assets/images/project_focuspeed.png",
  detail: {
    heroImage: {
      alt: "Overview image of the FocuSpeed project",
      caption: "Optional caption for future use.",
    },
    featuredVideo: {
      type: "video",
      src: "assets/videos/focuspeed-demo.mp4",
      poster: "assets/images/project_focuspeed.png",
      title: "FocuSpeed demo",
      caption: "Short caption describing what the video shows.",
    },
    overview: [
      {
        title: "Background",
        body: "Short explanation.",
      },
    ],
    useCase: [
      {
        title: "Scenario",
        body: "Short explanation.",
      },
    ],
    outputSlugs: ["focuspeed-sichi2025"],
    footer: {
      backHref: "../../work/",
      backLabel: "Back to Work",
    },
  },
}
```

## Attribute Roles

| Attribute | Required | Role | Notes |
| --- | --- | --- | --- |
| `slug` | Yes | Stable unique identifier for the project. | Use lowercase kebab-case when possible. This is used for anchors, detail page lookup, and cross-references. |
| `themeSlugs` | Recommended | Connects the project to one or more work themes. | Values should match `data/workThemes.js` `slug` values. Use an empty array if the project is intentionally ungrouped. |
| `title` | Yes | Project name shown on cards and detail pages. | Use the public-facing project title. |
| `summary` | Yes | Short project description. | Shown on cards, carousel items, and detail hero sections. |
| `start` | Recommended | Structured start date used for sorting and period generation. | Object with `year` and optional `month`. |
| `end` | No | Structured end date for completed projects. | Object with `year` and optional `month`. Omit for active projects. |
| `status` | Recommended | Project lifecycle state. | Currently `active` shows an Active badge. Use `completed` for finished work. |
| `tags` | Recommended | Display labels shown on cards and detail heroes. | Use research areas, technologies, methods, or topics. |
| `featured` | Recommended | Whether the project appears in featured views. | Boolean. Used by `renderProjects` when `featuredOnly` is enabled. |
| `links` | Recommended | Related URLs and internal pages. | Used for project cards and detail hero buttons. |
| `thumbnail` | Recommended | Project image path. | Used by cards, carousel, and detail hero media. |
| `detail` | No | Extra fields for project detail pages. | Use when the project has a dedicated detail page. |

## Dates And Periods

Use structured dates for sorting and card display:

```js
start: {
  year: 2025,
  month: 4,
},
end: {
  year: 2026,
  month: 3,
},
```

Project period behavior:

- `start` + `end` renders as `Apr 2025 - Mar 2026`.
- `start` + `status: "active"` renders as `Apr 2025 - Present`.
- `start` only renders as the start date.

## Status Values

| Value | Use For |
| --- | --- |
| `active` | Ongoing work. Shows an Active badge. |
| `completed` | Finished work. Does not show the Active badge. |
| `paused` | Temporarily inactive work. Add renderer support before relying on this visually. |
| `archived` | Historical work kept for record. Add renderer support before relying on this visually. |

Currently only `active` has a special visual treatment.

## Tags

Project tags should describe concrete methods, signals, technologies, materials,
interaction modalities, or application contexts. Broader areas and questions
belong on work theme tags.

Good tag examples:

- `EEG`
- `Haptics`
- `IMU`
- `Playback Control`
- `Passive BCI`
- `Virtual Softness`
- `Psychophysics`
- `Tactile Perception`

Guidelines:

- Use tags for topics users may recognize quickly.
- Avoid using tags for lifecycle state; use `status` instead.
- Avoid broad area labels when the parent work theme already communicates them.
- Keep wording consistent across projects, outputs, and news where possible.
- See `docs/tagging-guidelines.md` for the theme/project tag split.

## Link Keys

Project cards currently render these link keys:

| Key | Role |
| --- | --- |
| `page` | Internal project detail page or project anchor. |
| `demo` | Live demo. |
| `github` | Repository link. |

Project detail hero also supports:

| Key | Role |
| --- | --- |
| `paper` | Paper URL or PDF. |
| `poster` | Poster URL or PDF. |
| `video` | Video URL. |

Use relative paths for internal links and full `https://` URLs for external
links.

## Thumbnail And Hero Image

`thumbnail` is the actual image path used by cards, carousel items, and the
detail hero. `detail.heroImage` currently provides metadata for the hero image,
especially `alt`.

```js
thumbnail: "assets/images/project_focuspeed.png",
detail: {
  heroImage: {
    alt: "Overview image of the FocuSpeed project",
    caption: "FocuSpeed explores how estimated attention can shape media control in real time.",
  },
},
```

If `detail.heroImage` is present but `thumbnail` is missing, the detail hero will
not have an image source to render.

## Detail Object

`detail` is used by `assets/js/project-detail-page.js` for dedicated project
pages.

| Attribute | Role |
| --- | --- |
| `heroImage` | Metadata for the hero image, mainly `alt` and optional `caption`. |
| `featuredVideo` | Optional project-level video rendered after Overview. Supports local files, YouTube URLs, and embed URLs. |
| `overview` | Array of `{ title, body }` sections rendered under Overview. |
| `useCase` | Array of `{ title, body }` sections rendered under Use Case. |
| `outputSlugs` | Ordered list of output slugs to show in the Outputs explorer. |
| `primaryOutput` | Legacy/single-output alternative to `outputSlugs`. Prefer `outputSlugs`. |
| `footer` | Detail page footer config with `backHref` and `backLabel`. |

Use this pattern for text sections:

```js
overview: [
  {
    title: "Problem",
    body:
      "Short explanation of the problem this project addresses.",
  },
],
```

## Featured Video

Use `detail.featuredVideo` when a project has one representative demo or concept
video. It renders as a standalone section after Overview, before Use Case.

For a video stored in the repository, put the file under a stable asset
directory such as `assets/videos/`:

```js
featuredVideo: {
  type: "video",
  src: "assets/videos/focuspeed-demo.mp4",
  poster: "assets/images/project_focuspeed.png",
  title: "FocuSpeed demo",
  caption: "A short demo of adaptive playback speed control.",
},
```

For YouTube, use the public watch URL, short URL, shorts URL, or embed URL:

```js
featuredVideo: {
  type: "youtube",
  src: "https://www.youtube.com/watch?v=VIDEO_ID",
  title: "FocuSpeed demo",
  caption: "A short demo of adaptive playback speed control.",
},
```

For other embeddable providers, use `type: "embed"` with the provider's iframe
source URL.

## Relationship To Other Data

Projects connect to outputs and awards through slugs:

- Outputs can point to a project with `projectSlug`.
- A project detail page can choose and order outputs with `detail.outputSlugs`.
- Awards can point to a project with `projectSlug`.
- Output detail panels can show related awards with `output.detail.relatedAwards`.

When adding a project with a detail page:

1. Add the project to `data/projects.js`.
2. Add or confirm a matching HTML page under `work/<slug>/` if `links.page`
   points to a dedicated detail page.
3. Add related outputs to `data/outputs.js`.
4. Add output slugs to `detail.outputSlugs` in the order they should appear.
5. Add related awards to `data/awards.js` and link them through output details
   when applicable.
