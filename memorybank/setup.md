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

# Install dependencies
npm install

# Open the app
# Simply open index.html in a browser, or use a local server
```

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
