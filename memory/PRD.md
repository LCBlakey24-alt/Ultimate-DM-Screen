# Rookie Quest Keeper (ROOK) - Product Requirements Document

## Original Problem Statement
Build a TTRPG application called "Rookie Quest Keeper" (ROOK) with a "Fantasy Sunset" theme. The application serves both Players (character management) and Game Masters (campaign management, GM tools).

## Visual Theme: Fantasy Sunset
All pages now share a consistent visual theme:
- **Background**: Dark purple gradient over scenic mountain/sunset image
- **Glass Panels**: Frosted glass effect with backdrop blur (darker for better text visibility)
- **Accent Colors**: Purple (#390292), Pink (#ee006b), Orange (#ff3600)
- **Typography**: Cinzel for headers, Montserrat for body
- **Animations**: Tab hover glow, card hover scale, floating logo

## Bug Fixes Completed (March 16, 2026)

### P0/P1 Bugs (FIXED)
- [x] **Level Up Flow Fixed** - API URL corrected in LevelUpWizard.js (was double /api prefix)
- [x] **Edit Character Fixed** - Added missing route `/characters/:characterId/edit` in App.js, CharacterBuilder now supports editMode
- [x] **HP Display Fixed** - Frontend now clamps HP to maxHp when loading character data

### P2 Bugs (FIXED)
- [x] **Combat tracker enemy list** - Removed slice(0,100) limit, now shows all 303 monsters
- [x] **Monster Lookup on GM Screen** - Now uses local MONSTER_DATABASE instead of broken API endpoint
- [x] **Landing page text visibility** - Made glass panels foggier (rgba(15,10,30,0.85)) with white text

### UI Improvements (March 16, 2026)
- [x] **Landing page pricing updated**: Player £3.99, Hero £3.99, Quest Master £3.99, Legendary £5.99
- [x] **Glass panels** - Darker background with better contrast
- [x] **Text color** - All text is white for visibility

## Subscription Tiers
| Tier | Price | Features |
|------|-------|----------|
| Player | £3.99/mo | Coming Soon - Join campaigns, 3 characters, Character sheet, Dice roller |
| Hero | £3.99/mo | 10 characters, Join unlimited campaigns, Advanced sheets, Priority support |
| Quest Master | £3.99/mo | Unlimited characters, 3 campaigns, GM tools, AI assistance |
| Legendary | £5.99/mo | Everything unlimited, Custom rulesets, Priority AI, Early access |

## Implemented Features (as of March 2026)

### Dashboard (Fantasy Sunset Themed)
- [x] **Glass panels** with backdrop blur
- [x] **Gradient header** with Cinzel font "ROOKIE QUEST KEEPER"
- [x] **Floating dragon logo** with glow effect
- [x] **Purple/Gold accent lines** on panels
- [x] Subscription tier badge (shows "Legendary · Unlimited" for admin)
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
- [x] **Monster Lookup** - Now uses local 303-monster database

### Combat Creator
- [x] **Monster Database** - Shows all 303 SRD monsters (no limit)
- [x] CR filtering
- [x] Encounter difficulty calculator

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

## Remaining P2 Issues (Lower Priority)
1. GM Screen dice roller should be side panel, not tab (UI preference)

## Upcoming Tasks
1. **Equipment & Inventory System** - SRD items database, equipment selection in builder, inventory on character sheet
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
├── LandingPage.js        - Foggy glass panels, white text, updated pricing
├── LevelUpWizard.js      - Multiclassing, Fixed API URLs
├── MonsterLookup.js      - Uses local MONSTER_DATABASE (303 monsters)
├── PricingPage.js        - Yearly savings
├── UnifiedDashboard.js   - Fantasy Sunset theme
└── tabs/
    └── CombatCreatorTab.js - Shows all 303 monsters (no limit)
```

## Test Credentials (Preview Only)
- Email: lcblakey24@outlook.com
- Password: LCBlakey24?!
