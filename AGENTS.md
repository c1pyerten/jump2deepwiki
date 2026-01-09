# Repository Guidelines

## Project Structure & Module Organization

This repository is a minimal Chrome Extension (Manifest V3) that injects a **DeepWiki** button on GitHub repository home pages.

- `manifest.json`: MV3 manifest; registers the content script and match patterns.
- `content-script.js`: DOM detection + button injection logic for GitHub repo pages.
- `README.md`: Unpacked install + manual verification steps.

If you add assets (icons, screenshots), keep them in `assets/` and reference them from the README.

## Build, Test, and Development Commands

There is no build pipeline or bundler; the extension runs as plain JavaScript.

- `node --check content-script.js`: Syntax-check the content script.
- `node -e "JSON.parse(require('fs').readFileSync('manifest.json','utf8'))"`: Validate `manifest.json` is valid JSON.
- Load locally: `chrome://extensions` → Developer mode → **Load unpacked** → select this repo folder.

## Coding Style & Naming Conventions

- JavaScript: 2-space indentation, semicolons, prefer `const`/early returns.
- Keep the global scope clean (wrap in an IIFE/module pattern).
- Prefer stable selectors (`#repository-container-header`, `meta[...]`) over brittle class chains.
- Files: use `kebab-case` (e.g., `content-script.js`).

## Testing Guidelines

No automated tests currently. Verify manually on:

- Repo root: `https://github.com/<owner>/<repo>` (button appears).
- Non-root pages: `/issues`, `/pulls`, `/actions` (button does not appear).
- In-page navigation (GitHub Turbo/PJAX): navigate between tabs and ensure the button does not duplicate.

## Commit & Pull Request Guidelines

Git history is minimal (e.g., `init`). Use **Conventional Commits** going forward:

- `feat: add options page`
- `fix: handle turbo navigation`

For PRs: include a short description, manual test steps, and screenshots/GIFs for UI changes. If you touch DOM selectors, explain what GitHub markup you targeted and why it’s expected to be stable.

## Security & Configuration Tips

- Keep permissions/matches as narrow as possible (only GitHub repo pages).
- Avoid remote code/dependencies; keep the extension self-contained.
- Do not inject user-controlled strings as HTML; only use static markup for icons.

