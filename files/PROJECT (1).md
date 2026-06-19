# LTS interactive onboarding tour

## What this repo is

This repo recreates Learner Tracking Systems' (LTS) onboarding training slides as an
interactive, click-through product tour in the browser, instead of a static PDF/PPT
deck. It uses Driver.js to spotlight real UI elements step by step (login, password
setup, user details, home page navigation), with optional narration layered in via
text-to-speech or pre-recorded AI voice clips.

The end goal: a trainee opens a page, clicks "Start tour," and gets guided through
each screen exactly like the numbered red-arrow callouts in the original LTS slides,
but live and clickable instead of a flat image.

## A note on "agents and skills"

Worth being upfront about this: there are no autonomous AI agents running inside
this project. It's a static front-end build (HTML, CSS, JS) plus a JS tour library.
"Skills" here just means the tools/libraries/services this project depends on, and
the things a contributor needs to know how to do. If a real conversational AI agent
gets added later (e.g. an in-tour chatbot that answers trainee questions), that
would be a separate addition layered on top of this — noted as optional below, not
part of the current core build.

## Core tools and what each one does

| Tool | Role in this project |
|------|----------------------|
| Driver.js | Drives the interactive tour: spotlights elements, shows popovers, handles next/back/progress |
| Node.js + npm | Package manager and local dev server runtime |
| HTML/CSS/JS | The mock UI screens being toured (recreations of the LTS login, user details, and home page) |
| Web Speech API (`speechSynthesis`) | Free built-in browser text-to-speech for narration, no setup cost, robotic voice |
| ElevenLabs or Murf (optional) | Higher-quality pre-recorded AI voice clips, used instead of browser TTS if better narration quality is wanted |
| Synthesia or HeyGen (optional) | AI avatar presenter video, if an on-screen narrator is wanted alongside or instead of audio-only narration |
| Git + GitHub | Version control and hosting the repo |
| GitHub Pages or Netlify (optional) | Free static hosting so the tour can be shared via a link instead of opened locally |

## Folder structure

```
lts-tour/
├── PROJECT.md                  # this file
├── package.json                # npm project file, lists dependencies
├── package-lock.json           # generated, do not edit by hand
├── .gitignore                  # excludes node_modules, .env, etc.
├── index.html                  # entry point, links to the tour landing page
├── src/
│   ├── screens/                # one file per LTS screen being recreated
│   │   ├── login.html          # slide 1: login + password setup
│   │   ├── user-details.html   # slide 2: update user details form
│   │   ├── home.html           # slide 3: LTS home page (news, SR/6NA links)
│   │   └── help.html           # slide 4: support/contact + documents list
│   ├── tours/                  # Driver.js step definitions, one per screen
│   │   ├── login-tour.js
│   │   ├── user-details-tour.js
│   │   ├── home-tour.js
│   │   └── help-tour.js
│   ├── narration/              # narration text + optional audio files per step
│   │   ├── scripts.json        # plain-text narration lines keyed by step id
│   │   └── audio/              # pre-recorded AI voice clips (if used), .mp3
│   ├── styles/
│   │   └── main.css            # shared styling for the mock screens
│   └── shared/
│       └── narrate.js          # helper that plays TTS or audio per tour step
├── assets/
│   └── images/                 # any reference screenshots from the original slides
└── docs/
    └── original-slides/        # source PDF/PPT for reference, not used in the build
```

## What needs to happen, step by step

1. Initialize the repo: `git init`, then `npm init -y` to create `package.json`.
2. Install Driver.js: `npm install driver.js`.
3. Recreate each of the four LTS screens as static HTML inside `src/screens/`,
   using real form/button IDs so Driver.js has something to target.
4. Write a Driver.js step list per screen inside `src/tours/`, matching the numbered
   callouts already mapped out in the original training slides.
5. Add narration: start with free `speechSynthesis` for a working draft, then
   swap in ElevenLabs/Murf audio clips later if voice quality matters enough to
   justify the extra production step.
6. Wire up navigation between screens (e.g. clicking Continue on the login screen
   loads `user-details.html`) so the tour flows the same way the real LTS platform does.
7. Test locally by opening `index.html` directly, or running a simple local server.
8. Push to GitHub, then optionally enable GitHub Pages for a shareable link.

## Things you might still need to decide

- Whether narration is voice-only (TTS/AI voice) or includes an avatar video
  (Synthesia/HeyGen) layered on top, since avatar video adds a separate
  production step outside this repo.
- Whether this needs to track completion (e.g. "trainee finished the tour") for
  reporting back to LTS, which would require some kind of backend or third-party
  analytics, not just a static site.
- Whether this is meant to fully replace the PDF slides, or sit alongside them as
  an additional interactive option.
- Hosting: local-only for now, or published somewhere trainees can reach without
  cloning the repo themselves.

## Dependencies summary

- **Required**: Node.js, npm, Driver.js, a code editor, Git.
- **Optional**: ElevenLabs/Murf account (paid AI voice), Synthesia/HeyGen account
  (paid avatar video), a static hosting provider (GitHub Pages is free).
