# Component Documentation

This folder contains detailed documentation for each feature/component in the system. Each file documents one logical component — its business rules, data flow, UI interactions, validation, and integration points.

## Purpose

When an agent needs to modify a feature, it reads the relevant component doc to understand:
- **What** the feature does (business rules, user-facing behavior)
- **How** data flows through the system (screens, tours, audio)
- **Where** the code lives (files, modules, layers involved)
- **Why** certain decisions were made (constraints, edge cases, gotchas)

## File Naming

Use kebab-case matching the feature name:
- `login-screen.md` — Login page and partner logos
- `trainee-sr-tour.md` — Structured Record tour for trainees
- `weekly-timesheets.md` — Timesheet capture and review
- `header-styling.md` — Internal header and logo styling

## Template

Each component doc should follow this structure:

---

# [Component/Feature Name]

## Overview
_(1-2 sentences: what this feature does from the user's perspective)_

## Business Rules
- Rule 1: ...
- Rule 2: ...

## Data Flow

```
[User Action] -> [HTML Screen] -> [Tour Step] -> [Audio Playback]
```

## Key Files

| File | Role |
|------|------|
| `src/screens/example.html` | UI screen |
| `src/tours/example-tour.js` | Tour step definitions |
| `src/audio/example/step1.mp3` | Voice-over audio |

## Edge Cases & Gotchas
- _(Things that have caused bugs or confusion before)_

## Related Components
- [Link to related component doc]
