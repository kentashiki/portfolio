# Repository Guidelines

## Project Structure & Module Organization
The live site lives in `portfolio/`. Main entry points are `portfolio/index.html`, `portfolio/profile/index.html`, `portfolio/projects/index.html`, `portfolio/outputs/index.html`, and `portfolio/news/index.html`. Shared styles and scripts are under `portfolio/assets/css/` and `portfolio/assets/js/`; page-specific CSS sits beside each page, such as `portfolio/index-custom.css` or `portfolio/profile/profile.css`. Images and icons are stored in `portfolio/assets/images/`.

Use `archive/` as reference snapshots only. Do not treat them as the primary source unless you are intentionally restoring older content.

## Build, Test, and Development Commands
This repository does not use a bundler or package-based build.

- `python3 -m http.server 8000 --directory portfolio`
  Starts a local preview at `http://localhost:8000`.
- `open http://localhost:8000`
  Opens the local site in a browser on macOS.
- `rg "pattern" portfolio`
  Fast project search for updating repeated copy, links, or class names.

## Coding Style & Naming Conventions
Match the existing code style: 2-space indentation in HTML/CSS/JS, semantic HTML, and small vanilla JavaScript files without framework abstractions. Prefer lowercase kebab-case for CSS classes and filenames such as `network-animation-light.js` and `index-custom.css`.

Keep shared rules in `portfolio/assets/css/global.css`; place page-only layout or component rules in the nearest page stylesheet. Reuse existing assets and class names before adding new variants.

## Testing Guidelines
There is no automated test suite in this repository. Validate changes by serving `portfolio/` locally and checking:

- navigation links and mobile menu behavior
- responsive layout at mobile and desktop widths
- asset paths, especially from nested pages like `portfolio/projects/focuspeed/`
- console errors in the browser devtools

When changing interactive behavior, test both keyboard and pointer interactions.

## Commit & Pull Request Guidelines
Recent commits use short, imperative messages such as `changed nav list` and `initial setup`. Keep commits focused and concise; use the pattern `update profile copy` or `fix mobile nav spacing`.

Pull requests should include a brief summary, affected pages, before/after screenshots for visual changes, and manual test notes. Link any related issue or task when available.
