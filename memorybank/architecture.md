# Architecture

## Project Structure

LTS Interactive Onboarding Tour is a static HTML/CSS/JS application that uses Shepherd.js to provide guided interactive tours of the LTS platform interface.

```
LTS-interactive-onboarding-tour/
├── index.html                    # Landing page
├── src/
│   ├── screens/                  # HTML files for each tour view/screen
│   ├── styles/
│   │   └── main.css              # Centralized CSS (all styling)
│   ├── tours/                    # Shepherd.js tour step definitions
│   └── audio/                    # TTS voice-over MP3 files per tour
├── assets/                       # Static assets (images, fonts)
├── lts elements/                 # Reference designs and original assets
├── dist/                         # Build output
├── docs/                         # Documentation
└── build-*.js                    # Build scripts for different exports
```

## Key Modules

| Module | Responsibility |
|--------|---------------|
| `src/screens/` | Static HTML pages simulating LTS platform views (login, home, ACCA, SAGIA, SATIE, timesheets, etc.) |
| `src/styles/main.css` | Single CSS file containing all styles for all views |
| `src/tours/` | Shepherd.js tour configurations defining step sequences, tooltips, and navigation |
| `src/audio/` | Pre-generated TTS MP3 files for voice-guided tour narration |
| `build-*.js` | Node.js scripts to bundle/export specific tour sections |

## Data Flow

This is a static front-end application with no backend. Tours navigate between HTML screen files using Shepherd.js step definitions. Each screen simulates a view of the real LTS platform.

```
index.html (landing) → login.html → select.html → [role-specific home] → [section screens]
                                                                              ↓
                                                                    Shepherd.js tour overlay
                                                                              ↓
                                                                    Audio playback (TTS MP3s)
```
