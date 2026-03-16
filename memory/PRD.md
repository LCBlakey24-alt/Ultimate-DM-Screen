# Rookie Quest Keeper (ROOK) - Product Requirements Document

## Original Problem Statement
Build a TTRPG application called "Rookie Quest Keeper" (ROOK) with a "Fantasy Sunset" theme. The application serves both Players (character management) and Game Masters (campaign management, GM tools).

## Visual Theme: Fantasy Sunset
All pages now share a consistent visual theme:
- **Background**: Dark purple gradient over scenic mountain/sunset image
- **Glass Panels**: Frosted glass effect with backdrop blur
- **Accent Colors**: Purple (#8B5CF6), Pink (#EC4899), Gold (#F59E0B)
- **Typography**: Cinzel for headers, Montserrat for body
- **Animations**: Tab hover glow, card hover scale, floating logo

## Bug Fixes Completed (March 16, 2026)
- [x] **Level Up Flow Fixed** - API URL corrected in LevelUpWizard.js (was double /api prefix)
- [x] **Edit Character Fixed** - Added missing route `/characters/:characterId/edit` in App.js
- [x] **HP Display Fixed** - Frontend now clamps HP to maxHp when loading character data

## Implemented Features (as of March 2026)

### Dashboard (Fantasy Sunset Themed)
- [x] **Glass panels** with backdrop blur
- [x] **Gradient header** with Cinzel font "ROOKIE QUEST KEEPER"
- [x] **Floating dragon logo** with glow effect
- [x] **Purple/Gold accent lines** on panels
- [x] Subscription tier badge
- [x] Mobile navigation toggle

### Character System
- [x] Character sheet with Fantasy Sunset theme
- [x] Edition selector (2014 vs 2024 rules)
- [x] Subrace and subclass selection
- [x] **Character Edit Mode** - Edit existing characters via CharacterBuilder
- [x] **3D Dramatic Dice Roller** with animated bouncing dice
- [x] **All clickable rolls** (saves, skills, attacks)
- [x] **Clickable Cantrips** - Fire Bolt, Eldritch Blast, etc. roll damage
- [x] **Clickable Spells** - Magic Missile (1d4+1), etc. with dice badges
- [x] **Level Up Wizard with MULTICLASSING**
- [x] Dynamic spellcasting tab with correct ability by class

### Campaign Dashboard (Fantasy Sunset Themed)
- [x] **Glass panel sidebar** with purple accents
- [x] **Tab animations** with glow effects
- [x] **Gold "CAMPAIGN TOOLS" header** in Cinzel font
- [x] Consistent background image
- [x] Rounded corners on content panels

### GM Screen (Fantasy Sunset Themed)
- [x] Combat control with initiative
- [x] **"Sync to Players" button** for notes
- [x] NPC Name Generator, Dice Roller
- [x] Tab animations with glow effects

### GM-Player Sync
- [x] Campaign Timeline API
- [x] GM Note Sync API
- [x] Session Recaps sync
- [x] Player Timeline API

### Mobile Responsiveness
- [x] Mobile navigation toggle
- [x] Responsive grids
- [x] Touch-friendly tap targets
- [x] Safe area support

### Integrations
- [x] Stripe (subscription tiers)
- [x] Resend (email)
- [x] Emergent LLM Key (ROOK AI)

## Pending Issues (P2)
1. Admin account shows "Free Plan" - need to verify subscription status in DB
2. Combat tracker enemy list truncated (100/303) - backend pagination issue
3. Monster lookup on GM Screen returns no results
4. GM Screen dice roller should be side panel, not tab

## Upcoming Tasks
1. **Equipment & Inventory System** - SRD items database, equipment selection, inventory on character sheet
2. **Character Sheet UI Overhaul** - Highlight proficient skills, condense layout, add temp HP
3. **Real-time GM Loot System** - Drag-drop loot via WebSockets
4. **Map Creator Enhancements** - Textured tools, pan/zoom

## Future/Backlog
1. Player Timeline & Note Sync UI frontend
2. Soundboard with ambient noises
3. PDF export for character sheets
4. Live audio transcription
5. VTT with video/audio chat
6. Backend refactoring (split server.py - 8000+ lines)

## Technical Architecture
```
/app/frontend/src/components/
├── AuthPage.js           - Fantasy Sunset theme
├── CharacterBuilder.js   - Fantasy Sunset theme, Edit Mode support
├── CharacterSheetFull.js - 3D Dice, Clickable Spells, HP clamping
├── CampaignDashboard.js  - Fantasy Sunset theme
├── GMScreen.js           - Fantasy Sunset theme
├── LandingPage.js        - Grand animated KEEPER
├── LevelUpWizard.js      - Multiclassing, Fixed API URLs
├── PricingPage.js        - Yearly savings
└── UnifiedDashboard.js   - Fantasy Sunset theme
```

## Test Credentials (Preview Only)
- Email: lcblakey24@outlook.com
- Password: LCBlakey24?!
