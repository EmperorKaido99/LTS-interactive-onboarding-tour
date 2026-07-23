---
date: '2026-07-23'
sections_completed: ['tech-stack', 'architecture', 'critical-rules']
status: 'initial'
---

# Project Context for AI Agents

_This file contains the unobvious rules and patterns AI agents must follow when implementing code in this project._

---

## Technology Stack & Versions

- **Frontend:** Pure HTML5, CSS3, vanilla JavaScript (no framework)
- **Tour Library:** Shepherd.js (loaded via CDN)
- **Styling:** Single monolithic CSS file (`src/styles/main.css`) — all views share this file
- **Audio:** Pre-generated TTS MP3 files in `src/audio/`
- **Build:** Node.js scripts (`build-*.js`) for packaging/exporting
- **TTS Generation:** Python 3 (`generate-audio.py`)

## Critical Implementation Rules

### Styling Rules

- **ALL styles go in `src/styles/main.css`** — never use inline styles or create additional CSS files.
- The CSS file is very large (100k+ tokens). Use targeted searches (Grep) to find classes rather than reading the whole file.
- Logo assets are base64-encoded directly in the CSS — not external image files.
- CSS uses standard class naming (`.lts-*` prefix for LTS-specific elements).
- When changing dimensions of shared elements (like the logo), the change affects ALL views — verify across multiple screens.

### HTML Screen Rules

- Each screen is a standalone HTML file in `src/screens/`.
- All screens share the same header structure (`.lts-internal-header` > `.lts-logo` > `.lts-logo-hexagon`).
- Partner-specific views (ACCA, SAIT, SAIGA) may have additional header elements (`.header-partner`).
- Screen files reference relative paths to CSS and assets — be careful with path depth.

### Tour Rules

- Tour definitions live in `src/tours/` as JS files.
- Each tour step can reference audio files from `src/audio/`.
- Steps target elements by CSS selectors — if you rename/remove a class, check tour files too.

### Asset Rules

- The `lts elements/` folder contains reference designs (like `header.png`) — these are NOT used in the app directly, they are design references.
- Logo images are embedded as base64 in CSS, not as separate image files.
- ACCA logo is an external PNG file referenced from `lts elements/accalogo-400x139.png`.

### Code Quality & Style Rules

- Match existing code style exactly — this project uses no linter or formatter.
- Preserve indentation style of each file (2-space indent in CSS, mixed in HTML).
- Do not add build tooling, transpilers, or framework dependencies.

### Critical "Don't-Miss" Rules

- **main.css is too large to read in one go** — always use offset/limit or Grep to navigate it.
- **Changes to base CSS classes affect 50+ HTML files** — always consider the blast radius.
- **The `.lts-logo-hexagon` class appears in both the main rules AND `.landing-logo` override** — you may need to update both.
- **Audio file paths are hardcoded in tour JS files** — renaming audio files requires updating tour definitions.

---

## Usage Guidelines

**For AI agents:** Read this file before implementing. When a rule applies, follow it exactly. When in doubt between this file and a generic best practice, prefer this file.

**For humans maintaining this file:** Keep it lean. Every rule consumes context budget on every future invocation. Update when the tech stack or conventions change.

Last Updated: 2026-07-23
