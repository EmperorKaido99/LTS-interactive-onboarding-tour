# Integrating the LTS onboarding tours into another system

The tours are plain static files. There is no backend, no database, no API key, no
environment variable, no external request and no `npm install` needed to run them.
All paths are relative, so the folder works at any URL: a domain root, a sub-folder,
an intranet share, or behind a reverse proxy.

## 1. Pick how to connect

| Option | Use when | Effort |
|---|---|---|
| **A. Link** | Open the tours in a new tab from a menu item | Add one link |
| **B. iframe** | Show the tours inside a page of your system | Add one `<iframe>` |
| **C. Offline package** | No web server, or the tours must be emailed or put on a share | Run one command |

### A. Link

Host the repo folder (or just `index.html` + `src/`) on any static web server and link to:

- Start of the training menu: `src/screens/select.html`
- Any single module directly: `src/screens/<screen>.html` (for example `login.html`,
  `timesheet-home.html`). Every screen is a standalone page.

### B. iframe (recommended for embedding)

```html
<iframe
  src="https://your-host/lts-tour/src/screens/select.html"
  allow="autoplay"
  style="width:100%; height:100vh; border:0"
  title="LTS onboarding tour"></iframe>
```

- `allow="autoplay"` lets the voice-over start by itself. Without it the narration
  waits for the first click.
- The iframe keeps the tour's styles away from your page. If you ever load `main.css`
  straight into your own page instead, it is still safe: every page-wide rule (the reset,
  `body`, `a`, `table`) is scoped to `.lts-app`, which only the tour pages set on their
  `<body>`. `npm test` fails if an unscoped element rule is added.
- Nothing in the tours tries to leave the frame (no `window.top`, no `target="_top"`).
- The management training (Reviewer, Evaluator, Assessor) is one login page and one details
  page. Pick the role with `mgmt-login.html?profile=reviewer`, `?profile=evaluator` or
  `?profile=assessor`; the choice follows the Continue and Back links.
- Choose the partner look with `?view=acca`, `?view=sait`, `?view=saiga` or
  `?view=normal` on the URL of `login.html`, `home.html`, `help.html` or
  `user-details.html`. The choice is remembered in `localStorage` under the key
  `lts-view`. That is the only thing the tours store.

### C. Offline package

```bash
node build-offline.js        # writes dist/
```

Zip `dist/` and open `dist/index.html`. It works from disk, with Driver.js and the
voice-over embedded. That is about 26 MB zipped.

For an email-sized package use `node build-offline.js --no-audio` (about 6 MB zipped). The
MP3s are left out and the browser's own voice reads the narration text instead.

The single-file exports (`build-login-export.js`, `build-login-email.js`,
`build-sendback-export.js`, `build-timesheet-export.js`) share their helpers in
`build-lib.js`.

## 2. Server requirements

Serve the source version over `http://` or `https://`. Browsers refuse the tour scripts
when a page is opened straight from disk (`file://`); use option C for that.

| Requirement | Why |
|---|---|
| `.mjs` served as `text/javascript` | The tours are ES modules. Older IIS and some proxies do not know `.mjs` |
| `.mp3` served as `audio/mpeg`, `.json` as `application/json` | Voice-over and the spoken-text fallback |
| Static files only | No server code runs |
| CSP, if you use one | Screens contain inline `<script>` and inline `style` attributes. Allow `'unsafe-inline'` for the tour origin, or host it on its own origin |
| Do not send `X-Frame-Options: DENY` for the tour folder | Needed for option B |

Size: about 21 MB of audio, 56 screens, one 150 KB stylesheet. Everything is cacheable.

## 3. What is where

```
index.html            landing page (links to src/screens/select.html)
src/screens/          56 standalone screens
src/tours/            one script per tour (Driver.js steps)
src/audio/<tour>/     one MP3 per tour step
src/narration/        spoken-text fallback for steps without an MP3
src/shared/           narration, view switcher, management profile, blur overlay
src/vendor/driver/    Driver.js 1.4.0 (MIT), copied in so no npm is needed
build-*.js            offline and export packagers
check.js              the test (npm test)
```

The folders must stay in this shape: screens load `../styles`, `../tours`, `../audio`
and `../vendor` relative to themselves.

## 4. Changing it safely

```bash
npm test
```

`npm test` fails if a tour step points at an element that is not on the page, a step has
neither an MP3 nor a fallback script, a link or asset is broken, or something starts
depending on `node_modules` again. Run it before every commit.

To add a tour: create the screen in `src/screens/`, the script in `src/tours/` (copy a
similar one), the audio in `src/audio/<tour-name>/<step-id>.mp3` (or an entry in
`src/narration/scripts.json`), then run `npm test`.

To update Driver.js: `npm install driver.js@latest`, then copy `driver.js.mjs`,
`driver.js.iife.js`, `driver.css` and `license` from `node_modules/driver.js/` into
`src/vendor/driver/`.
