# Changelog

This file is for human-readable development notes going forward. The older detailed iteration history is still kept in `memory/PRD.md`, but new work should be summarized here so the repo is easier to understand.

## 2026-05-13 — Documentation and cleanup sprint

### Added

- Replaced the placeholder README with full project documentation.
- Added `docs/PRODUCT_VISION.md`.
- Added `docs/ARCHITECTURE.md`.
- Added `docs/ROADMAP.md`.
- Added `docs/KNOWN_ISSUES.md`.
- Added `docs/AI_SAFE_RULES.md`.
- Added this changelog.

### Changed

- Expanded account deletion cleanup so it removes user-owned and campaign-owned records across the main app collections instead of only deleting a few records.
- Updated the active clean character sheet styling through `mobileSheetPolish.css` so it better matches the current Rookie Quest Keeper dark navy and gold visual direction.
- Improved mobile character sheet stickiness/polish through CSS overrides.

### Notes

- A larger username-reference migration patch was attempted but blocked by safety checks because it required a large auth-file replacement. That should be revisited with a smaller, isolated helper/module approach.
- The next safe backend hardening target is rate limiting for login, registration, forgot-password, password reset, AI, and file parsing.
- The next frontend cleanup target is splitting large components without changing behaviour.
