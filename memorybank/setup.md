# Setup

## Prerequisites

- Node.js (for build scripts)
- Python 3 (for TTS audio generation via `generate-audio.py`)
- A modern web browser

## Environment Variables

| Variable | Purpose | Required | Default |
|----------|---------|----------|---------|
| None | Static app, no env vars needed | N/A | N/A |

## Getting Started
```bash
# Clone the repo
git clone https://github.com/EmperorKaido99/LTS-interactive-onboarding-tour.git
cd LTS-interactive-onboarding-tour

# Run it (needs Node.js; serves the folder over http://localhost:3000)
npm start

# Check tours, audio and links before committing
npm test
```

Do not open `index.html` straight from disk: browsers block the tour scripts (ES modules) on `file://`.
For a copy that works from disk, run `node build-offline.js` and open `dist/index.html`.

Driver.js is vendored in `src/vendor/driver/`, so `npm install` is not needed to run the app.

See [INTEGRATION.md](../INTEGRATION.md) for embedding the tours in another system.

## Build Scripts

```bash
# Build login/email export
node build-login-email.js

# Build login export
node build-login-export.js

# Build offline version
node build-offline.js

# Build sendback export
node build-sendback-export.js

# Build timesheet export
node build-timesheet-export.js
```

## Audio Generation

```bash
# Generate TTS voice-over MP3s
python generate-audio.py
```
