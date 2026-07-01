# Diary-record-CN

A single-page diary/timeline app (生活记录) built with plain HTML, CSS, and vanilla JavaScript ES modules. Data is stored client-side in the browser's `localStorage` (key `diary-timeline-entries`). There is no backend, no build step, and no package manager.

- Entry point: `index.html` (loads `js/app.js` as a `<script type="module">`).
- Routing is hash-based (`#/`, `#/category/<work|study|life|healthy>`, `#/document/<id>`).
- Diary categories, colors, and labels are defined in `js/types.js`.
- Persistence helpers live in `js/storage.js`.

## Cursor Cloud specific instructions

- There are no dependencies to install, no lint config, no automated tests, and no build step. The "update script" is effectively a no-op.
- The app uses native ES modules (`import`/`export`), so it MUST be served over HTTP — opening `index.html` via the `file://` protocol will fail with CORS/module errors. Serve the repo root with any static server, e.g. `python3 -m http.server 8000` (Python 3 is available) or `npx serve`.
- All data is per-browser `localStorage`; there is no shared/server state. Clearing site data or using a different browser profile resets all diary entries.
