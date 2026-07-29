# News Data Structure

This document defines how news records in `data/news.js` should be structured.
News records are timeline items: they should be concise, date-driven, and written
for scanning.

## Recommended Shape

```js
{
  id: "news-ahs-2026-presentation",
  date: "2026-03-18",
  title: "Presented Research at Augmented Humans 2026 Posters & Demos",
  images: [
    {
      src: "assets/images/news/2026/ahs-2026-presentation.jpg",
      alt: "Presenting the research poster at Augmented Humans 2026",
      width: 1280,
      height: 720,
    },
  ],
  summary: [
    "I presented a collaborative project at ",
    {
      text: "Augmented Humans 2026",
      href: "https://augmented-humans.org/",
    },
    ".",
  ],
  tags: ["Conference Presentation"],
}
```

## Attribute Roles

| Attribute | Required | Role | Notes |
| --- | --- | --- | --- |
| `id` | Yes | Stable identifier and page anchor. | Use a unique, descriptive kebab-case value prefixed with `news-`. Do not change it after publication. |
| `date` | Yes | Timeline date and sort key. | Use ISO format: `YYYY-MM-DD`. The renderer displays it in a compact English format, such as `Jul 1, 2026`. |
| `title` | Yes | Main timeline headline. | Keep it factual and specific. Prefer one event per item. |
| `images` | No | Ordered photos shown only on the full News page. | Store photos under `assets/images/news/YYYY/`. Each entry includes `src`, descriptive `alt`, and intrinsic `width` and `height`. |
| `summary` | Recommended | Short supporting sentence or linked rich text. | Can be a plain string or an array of text/link parts. |
| `tags` | Recommended | Primary event or outcome category. | Use one tag in most cases. Put the primary tag first if an exceptional item needs a second tag. |

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
  `work/focuspeed/`.

## Images

News photos are optional and appear only in detailed items on the full News page.
The home page intentionally does not render them.

- Store files in `assets/images/news/YYYY/`.
- Use a descriptive kebab-case filename based on the event or news item.
- Put images in display order; the first entry is shown first.
- Use a content-specific `alt` description. Localize it in `data/ja/news.js`.
- Include the source image dimensions to reserve layout space while loading.
- A single image is displayed directly. Two or more images use a fixed-height
  main viewer with previous/next controls, a position counter, and selectable
  thumbnails so additional photos do not make the article substantially taller.

## Tags

News tags are for quick visual scanning. They do not control sorting.

Good tag examples:

- `Acceptance`
- `Award`
- `Conference Presentation`
- `Contest`
- `Education`
- `Hackathon`
- `Internship`
- `Website`

Guidelines:

- Use title case.
- Use one primary tag per News item as the default.
- If a single item genuinely covers two inseparable event categories, a second
  tag is allowed. Consider splitting it into separate News items first.
- Put the primary tag first. The home page intentionally displays only that
  first tag, while the full News page can display all tags.
- Display tags beside the date on the full News page so readers see the event
  category before the title and summary.
- Prefer specific participation tags such as `Hackathon` or `Contest` over the
  broader `Event` tag when the format is clear.
- Use News tags for the event or outcome category. Keep presentation formats
  such as `Poster` and `Demo` in the title, summary, and corresponding Output.

### Visual Design Groups

Tag colors communicate broad semantic groups, not individual tag identities.
Different tags in the same group must use the same color and visual treatment so
readers can recognize related kinds of News at a glance. The canonical tag key,
not its localized display label, determines the design.

The current groups follow the styles defined for `.update-tag[data-tag]` in
`assets/css/global.css`:

| Design group | News tags | Visual treatment |
| --- | --- | --- |
| Academic activity | `Acceptance`, `Conference Presentation` | Blue background, text, and border |
| Achievement | `Award` | Gold background, text, and border |
| Career and education | `Education`, `Internship` | Green background, text, and border |
| Event participation | `Event`, `Hackathon` | Slate-blue background, text, and border |
| Contest participation | `Contest`, `Student Contest`, `Research Contest` | Purple background, text, and border |
| Site and product launch | `Launch`, `Website` | Warm beige background, text, and border |
| Unclassified | Any tag without an explicit group | Neutral gray background, text, and border |

`Poster` and `Demo` retain the academic blue treatment for backward
compatibility, but they should not normally be used as News tags; keep those
presentation formats in the title and summary as described above.

When adding a News tag:

- First assign it to the closest existing semantic group and reuse that group's
  complete treatment: background, text color, border color, shape, typography,
  and spacing.
- Do not introduce a new color merely to distinguish a new tag from other tags
  in the same group.
- Add a new design group only when the tag represents a meaning that does not
  fit any existing group and that distinction will be useful across multiple
  News items.
- Update both this table and the corresponding selectors in
  `assets/css/global.css` whenever group membership changes.
- Preserve the canonical English key during localization. Japanese News tags
  should change only the displayed label so the English and Japanese versions
  receive the same design.

## Writing Guidelines

- Keep `title` specific enough that the timeline can be understood without
  reading the summary.
- Use the first person when Kenta is the actor. For acceptances and awards, the
  proposal, research outcomes, or project may be the grammatical subject.
- Put exact dates in `date`; keep month-only or vague timing out of news records.
- Link the most useful entity in the `summary`: project page, lab page,
  conference page, or company page.
- For a presentation, publication, or related award, use the formal output
  title in `summary` and link it to the corresponding item on the Outputs page.
  Keep the News `title` concise; do not repeat the formal output title there.
- If a news item corresponds to an output or award, keep the wording aligned with
  `data/outputs.js` or `data/awards.js`.

## Title Patterns

Use these patterns to keep similar events easy to scan:

- Award: `Received [Award] at [Event]`
- Acceptance: `[Proposal or Research] Accepted to [Event or Track]`
- Presentation: `Presented [Research or Project] at [Event]`
- Internship: `Started an Internship at [Organization]` or
  `Completed an Internship at [Organization]`
- Education: `Began [Program] at [University]` or `Graduated from [University]`

## Localization

`data/news.js` owns the shared structure. `data/ja/news.js` overrides only
localized content and inherits `id`, `date`, and `tags`.

- Treat the Japanese `title` and `summary` as the content source of truth unless
  a record explicitly states otherwise.
- Keep the English and Japanese versions semantically equivalent. Do not make
  one version stronger, more specific, or broader than the other.
- Keep `summary` as a plain string in both languages when it has no inline
  links, and as an array in both languages when it contains inline links.
- Keep linked entities equivalent. Locale-specific versions of the same
  official URL are encouraged.
- Do not add a top-level `link` property. Put visible links inside `summary`.
