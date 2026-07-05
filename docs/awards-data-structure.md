# Awards Data Structure

This document defines how award records in `data/awards.js` should be structured.
The goal is to keep each attribute's role clear, especially the boundary between
primary classification fields such as `type` and flexible display labels such as
`tags`.

## Recommended Shape

```js
{
  slug: "sichi2025-encouragement-award",
  projectSlug: "focuspeed",
  outputSlug: "focuspeed-sichi2025",
  region: "domestic",
  type: "competition-award",
  title: "Encouragement Award",
  year: 2025,
  issuer: "SICHI2025",
  recipients: ["Kenta Shiki"],
  equalContributionCount: 0,
  tags: ["Student Contest", "Domestic (Japan)"],
  links: {
    conference: "https://example.com",
    projectDetail: "projects/focuspeed/?output=focuspeed-sichi2025",
    page: "awards/#award-sichi2025-encouragement-award",
  },
}
```

## Attribute Roles

| Attribute | Required | Role | Notes |
| --- | --- | --- | --- |
| `slug` | Yes | Stable unique identifier for the award. | Use lowercase kebab-case. This is used for anchors and cross-references. Avoid changing it after publishing. |
| `projectSlug` | No | Connects the award to a project in `data/projects.js`. | Use when the award belongs to a specific project. The value should match a project `slug`. |
| `outputSlug` | No | Connects the award to an output in `data/outputs.js`. | Use when the award was received for a specific paper, presentation, demo, or other output. The value should match an output `slug`. |
| `region` | Recommended | Geographic scope used for grouping/filtering. | Current values: `international`, `domestic`, `not-region-specific`. Use `domestic` for Japan-specific awards. |
| `type` | Yes | Primary award category used for the Type grouping. | Keep this broad and structural. Do not use event-specific labels such as `student-contest` here. |
| `title` | Yes | Actual award name shown on the card. | Example: `Encouragement Award`, `Best Paper Award`, `Poster Award`. |
| `year` | Yes | Award year used for sorting and grouping. | Use a number, not a string. If the exact date matters, mention it in related news rather than here. |
| `issuer` | Yes | Organization, conference, event, or program that issued the award. | Keep it concise. Example: `SICHI2025`. |
| `recipients` | Recommended | People who received the award. | Keep ordering consistent with the official listing or related output. |
| `equalContributionCount` | No | Marks the first N recipients as equal contribution. | Use only when the award record needs the marker. Omit or use `0` otherwise. |
| `tags` | Recommended | Flexible display labels shown on cards. | Use for event formats, tracks, contexts, and secondary metadata such as `Student Contest` or `Domestic (Japan)`. |
| `links` | Recommended | Related URLs used for card navigation and action links. | See the link key rules below. |

## Type Values

`type` should answer: "What kind of award is this at a portfolio-structure level?"
It should not answer: "Which event track or participation category was this in?"

Recommended values:

| Value | Display Label | Use For |
| --- | --- | --- |
| `competition-award` | Competition Award | Student contests, hackathons, design competitions, challenge awards. |
| `paper-award` | Paper Award | Best Paper, Honorable Mention, journal/conference paper awards. |
| `presentation-award` | Presentation Award | Oral presentation, poster presentation, or talk awards. |
| `demo-award` | Demo Award | Demo, prototype, exhibition, or interactive system awards. |
| `scholarship` | Scholarship | Scholarship-style recognitions or financial awards. |
| `grant` | Grant | Research grants, project funding, or selected proposals. |
| `fellowship` | Fellowship | Fellowship programs or named researcher/student fellowships. |

For the SICHI2025 Encouragement Award, use:

```js
type: "competition-award",
tags: ["Student Contest", "Domestic (Japan)"],
```

This keeps `Competition Award` as the broad grouping while preserving
`Student Contest` as visible context.

## Region Values

Use `region` for broad geographic grouping only.

| Value | Display Label | Use For |
| --- | --- | --- |
| `international` | International | International conferences, competitions, or programs. |
| `domestic` | Domestic (Japan) | Japan-based conferences, competitions, or programs. |
| `not-region-specific` | Not region-specific | Online, internal, or otherwise non-geographic awards. |

Avoid duplicating detailed event context in `region`. For example, "student",
"conference", and "hackathon" should be tags or types, not regions.

## Tags

`tags` are display-oriented labels. They can overlap with other fields when that
helps users scan the card, but they should not replace structural fields.

Good tag examples:

- `Student Contest`
- `Domestic (Japan)`
- `International`
- `Poster`
- `Demo`
- `Hackathon`
- `Research`
- `Team Award`

Guidelines:

- Use human-readable title case.
- Use tags for context that may be useful visually but should not control the
  main grouping.
- Keep `type` broad; keep `tags` expressive.
- If a tag becomes a primary browsing axis later, promote it to a structured
  field instead of overloading `tags`.

## Link Keys

`links` is an object with semantic keys. The renderer uses key priority to choose
the card's primary click target and hides same-page anchors from the visible link
list.

Supported award link keys:

| Key | Role |
| --- | --- |
| `projectDetail` | Internal link to the related project detail page. Preferred primary target when present. |
| `page` | Internal anchor for the award itself. Useful for stable references, usually hidden as a visible action link. |
| `conference` | External conference, event, or contest page. |
| `officialSite` | Official award, program, or organizer site when `conference` would be misleading. |
| `pdf` | Award certificate, paper, or related PDF. |
| `poster` | Poster PDF or poster page. |
| `video` | Related video, such as an application, presentation, or demo video. |
| `demo` | Live demo or project demo. |
| `github` | Repository link. |
| `doi` | DOI or publisher link. |

Primary link priority in `assets/js/renderAwards.js`:

```txt
projectDetail -> page -> conference -> officialSite -> pdf -> demo -> github -> doi
```

## Relationship To Other Data

Awards can connect to other data files through slugs:

- `projectSlug` should match `data/projects.js` `slug`.
- `outputSlug` should match `data/outputs.js` `slug`.
- Output detail pages can refer back to awards through `relatedAwards`.

When adding an award for an output, keep these three records aligned:

1. Add the award to `data/awards.js`.
2. Add or confirm the related output in `data/outputs.js`.
3. Add the award slug to the output detail's `relatedAwards` if it should appear
   on the project/output detail page.

## Current SICHI2025 Example

```js
{
  slug: "sichi2025-encouragement-award",
  projectSlug: "focuspeed",
  outputSlug: "focuspeed-sichi2025",
  region: "domestic",
  type: "competition-award",
  title: "Encouragement Award",
  year: 2025,
  issuer: "SICHI2025",
  recipients: [
    "Kenta Shiki",
    "Tsukihi Sasao",
    "Yuhi Hasegawa",
    "Masatoshi Watanabe",
    "Keigo Ushiyama",
    "Tomohiro Amemiya",
  ],
  tags: ["Student Contest", "Domestic (Japan)"],
  links: {
    conference: "https://sites.google.com/view/sichi/sichi2025",
    projectDetail: "projects/focuspeed/?output=focuspeed-sichi2025",
    page: "awards/#award-sichi2025-encouragement-award",
  },
}
```
