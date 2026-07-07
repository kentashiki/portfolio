# News Data Structure

This document defines how news records in `data/news.js` should be structured.
News records are timeline items: they should be concise, date-driven, and written
for scanning.

## Recommended Shape

```js
{
  date: "2026-03-18",
  title: "Presented a collaborative project at Augmented Humans 2026 Posters & Demos",
  summary: [
    "I presented a collaborative project at ",
    {
      text: "Augmented Humans 2026",
      href: "https://augmented-humans.org/",
    },
    ".",
  ],
  tags: ["Poster", "Demo", "Milestone"],
  link: "",
}
```

## Attribute Roles

| Attribute | Required | Role | Notes |
| --- | --- | --- | --- |
| `date` | Yes | Timeline date and sort key. | Use ISO format: `YYYY-MM-DD`. The renderer displays it in a compact English format, such as `Jul 1, 2026`. |
| `title` | Yes | Main timeline headline. | Keep it factual and specific. Prefer one event per item. |
| `summary` | Recommended | Short supporting sentence or linked rich text. | Can be a plain string or an array of text/link parts. |
| `tags` | Recommended | Display labels shown under full news items. | Use for event category, outcome, format, or milestone status. |
| `link` | No | Legacy/simple single link. | Currently not rendered by `renderNews.js`. Prefer linked parts inside `summary` for visible links. |

## Summary Format

Use a plain string when no inline links are needed:

```js
summary:
  "I launched this portfolio to bring together projects, outputs, and ongoing explorations in one place.",
```

Use an array when part of the sentence should be linked:

```js
summary: [
  "I started working at ",
  {
    text: "Visionary Lab",
    href: "https://vl.araya.org/",
  },
  " at ",
  {
    text: "Araya Inc.",
    href: "https://www.araya.org/",
  },
  " as a student intern.",
],
```

Rules:

- Each string part is rendered as escaped text.
- Each object part should have `text` and `href`.
- External links should use full `https://` URLs.
- Internal links should be relative to the current site root, such as
  `projects/focuspeed/`.

## Tags

News tags are for quick visual scanning. They do not control sorting.

Good tag examples:

- `Acceptance`
- `Award`
- `Contest`
- `Demo`
- `Education`
- `Hackathon`
- `Internship`
- `Milestone`
- `Poster`
- `Website`

Guidelines:

- Use title case.
- Prefer a small number of tags per item, usually one to three.
- Use `Milestone` for important career or portfolio landmarks.
- Prefer specific participation tags such as `Hackathon` or `Contest` over the
  broader `Event` tag when the format is clear.
- Use specific tags such as `Poster`, `Demo`, `Acceptance`, or `Award` when they
  help users understand the event at a glance.

## Writing Guidelines

- Keep `title` specific enough that the timeline can be understood without
  reading the summary.
- Use the first person consistently because this portfolio is personal.
- Put exact dates in `date`; keep month-only or vague timing out of news records.
- Link the most useful entity in the `summary`: project page, lab page,
  conference page, or company page.
- If a news item corresponds to an output or award, keep the wording aligned with
  `data/outputs.js` or `data/awards.js`.
