# Outputs Data Structure

This document defines how output records in `data/outputs.js` should be
structured. Outputs are public artifacts or deliverables: publications,
presentations, demos, posters, web apps, and similar work.

## Recommended Shape

```js
{
  slug: "focuspeed-sichi2025",
  projectSlug: "focuspeed",
  region: "domestic",
  title: "FocuSpeed: Adaptive Control of Speech Playback Speed Based on Concentration Level Estimated from Biosignals",
  type: "presentation",
  year: 2025,
  authors: ["Kenta Shiki"],
  equalContributionCount: 0,
  venue: "SICHI2025 (Human Interface Symposium 2025)",
  tags: ["Poster", "Demo", "Domestic (Japan)"],
  links: {
    conference: "https://example.com",
    paper: "assets/documents/outputs/example-paper.pdf",
    poster: "assets/documents/outputs/example-poster.pdf",
    projectDetail: "work/focuspeed/?output=focuspeed-sichi2025",
    page: "outputs/#output-focuspeed-sichi2025",
  },
  detail: {
    role: "Researcher & Engineer",
    team: "Team name or collaborator summary",
    outcome: "Short result or public-facing outcome.",
    implementation: [
      {
        title: "System Structure",
        body: "Short explanation.",
      },
    ],
    visuals: [
      {
        type: "image",
        src: "../../assets/images/project_focuspeed.png",
        alt: "Representative visual",
        title: "Project overview",
        caption: "Optional caption.",
      },
    ],
    myContributions: ["Designed and implemented the prototype."],
    lessonsLearned: [
      {
        title: "Key Insights",
        body: "Short reflection.",
      },
    ],
    techStack: [
      {
        title: "Languages",
        items: ["Python", "JavaScript"],
      },
    ],
    relatedAwards: ["sichi2025-encouragement-award"],
  },
}
```

## Attribute Roles

| Attribute | Required | Role | Notes |
| --- | --- | --- | --- |
| `slug` | Yes | Stable unique identifier for the output. | Use lowercase kebab-case. This is used for anchors, links, and project detail routing. |
| `projectSlug` | No | Connects the output to a project in `data/projects.js`. | Use when the output belongs to a specific project. |
| `region` | Recommended | Geographic scope for grouping. | Current values: `international`, `domestic`, `not-region-specific`. |
| `title` | Yes | Public title shown on cards. | Use the official title for publications and presentations. |
| `type` | Yes | Primary output category used for Type grouping. | Keep broad and structural. See Type Values below. |
| `year` | Yes | Output year used for sorting and grouping. | Use a number. |
| `authors` | Recommended | Ordered author list. | Use the official author order. `Kenta Shiki` is highlighted by the renderer. |
| `equalContributionCount` | No | Marks the first N authors as equal contribution. | Use only when needed. Omit or use `0` otherwise. |
| `venue` | Recommended | Publication venue, conference track, event, or platform. | Shown on output cards when present. |
| `tags` | Recommended | Flexible display labels shown on cards. | Use for formats, tracks, and secondary context such as `Poster`, `Demo`, or `Domestic (Japan)`. |
| `links` | Recommended | Related URLs and files. | Used for card navigation and visible action links. |
| `detail` | No | Extra project-detail content for this output. | Used on project detail pages when an output is expanded. |

## Type Values

`type` should answer: "What kind of output is this at a portfolio-structure
level?"

Current values:

| Value | Display Label | Use For |
| --- | --- | --- |
| `publication` | Publications | Papers, posters and demos with archival/publication records, journal or conference publications. |
| `presentation` | Presentations | Conference presentations, student contest presentations, posters, demos, talks. |
| `webapp` | Web App | Deployed or portfolio-hosted web applications. |

Possible future values:

| Value | Use For |
| --- | --- |
| `dataset` | Public datasets or corpora. |
| `software` | Reusable software libraries or tools. |
| `workshop` | Workshop artifacts or workshop presentations. |
| `preprint` | Preprints before formal publication. |

If a work is both a poster and a demo, keep `type` broad, then use tags:

```js
type: "presentation",
tags: ["Poster", "Demo", "Domestic (Japan)"],
```

## Region Values

| Value | Display Label | Use For |
| --- | --- | --- |
| `international` | International | International venues or outputs. |
| `domestic` | Domestic (Japan) | Japan-based venues or outputs. |
| `not-region-specific` | Not region-specific | Web apps, internal artifacts, or outputs without a geographic scope. |

If `region` is omitted, the renderer groups the item as `not-region-specific`.

## Tags

Use tags for visible context that is useful but not structural enough for `type`.

Good tag examples:

- `Poster`
- `Demo`
- `International`
- `Domestic (Japan)`
- `Website`
- `Prototype`
- `Open Source`
- `Acceptance`

Guidelines:

- Use human-readable title case.
- Use `type` for the main category and `tags` for format/context.
- Keep tags short enough to scan on cards.

## Link Keys

Supported output link keys:

| Key | Role |
| --- | --- |
| `projectDetail` | Internal link to the related project detail page. Preferred primary target when present. |
| `page` | Internal anchor for the output itself. Usually hidden as a visible action link. |
| `paper` | Paper URL or local PDF path. |
| `pdf` | Alternate key for paper PDF. |
| `poster` | Poster PDF or poster page. |
| `conference` | Conference, event, or venue page. |
| `demo` | Live demo. |
| `github` | Repository link. |
| `doi` | DOI or publisher link. |

Primary link priority in `assets/js/renderOutputs.js`:

```txt
projectDetail -> page -> paper -> pdf -> demo -> github -> doi
```

## Detail Object

`detail` is used by `assets/js/project-detail-page.js` when the output appears
inside a project detail page. It is optional for simple outputs.

| Attribute | Role |
| --- | --- |
| `role` | Your role for this output. Rendered in the output detail meta area. |
| `team` | Team or collaborator summary. Rendered in the output detail meta area. |
| `outcome` | Short result summary. Rendered in the output detail meta area. |
| `implementation` | Array of `{ title, body }` sections. |
| `visuals` | Array of visual assets. Currently supports image/video/embed-style records in the renderer. |
| `myContributions` | Array of strings shown as bullet points. |
| `lessonsLearned` | Array of `{ title, body }` reflection sections. |
| `techStack` | Array of `{ title, items }` groups. |
| `relatedAwards` | Array of award slugs from `data/awards.js`. |

## Relationship To Other Data

- `projectSlug` should match a `data/projects.js` `slug`.
- Awards can point to outputs through `outputSlug`.
- Output detail panels can show awards through `detail.relatedAwards`.
- Projects can explicitly select outputs through `project.detail.outputSlugs`.

When adding an output connected to a project:

1. Add the output to `data/outputs.js`.
2. Set `projectSlug` to the matching project slug.
3. Add the output slug to `data/projects.js` `detail.outputSlugs` if the project
   detail page should control output order explicitly.
4. Add `detail.relatedAwards` if awards should appear in the expanded output
   panel.

