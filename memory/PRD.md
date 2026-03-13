# Rookie Quest Keeper (ROOK) - Product Requirements Document

## Original Problem Statement
Build a TTRPG application called "Rookie Quest Keeper" (ROOK) with a "Fantasy Sunset" theme. The application serves both Players (character management) and Game Masters (campaign management, GM tools).

## User Personas
1. **Players** - Create and manage D&D characters, view character sheets, join campaigns
2. **Game Masters** - Create campaigns, manage world-building, run combat encounters, generate NPCs

## Core Requirements
- Full-stack React/FastAPI/MongoDB application
- "Fantasy Sunset" visual theme (dark purples, pinks, gold, glassmorphism)
- Unified dashboard with Characters (left) and Campaigns (right) side-by-side
- Compact, single-frame character sheets with scrollable inner containers
- GM Screen with comprehensive tools (combat, dice, monsters, NPCs, etc.)
- Stripe integration for subscription tiers
- **Support for both D&D 5e 2014 and 2024 rules**
- **SRD/OGL compliant content only**
- **Mobile and tablet responsive**

## Implemented Features (as of March 2026)

### Authentication & Dashboard
- [x] User authentication (JWT-based)
- [x] Admin panel
- [x] Unified dashboard with side-by-side Player/GM sections
- [x] Inline campaign creation modal
- [x] **Subscription tier badge showing campaign limits**
- [x] **Proactive campaign limit check before creation**
- [x] **Custom mini logo in dashboard header (floating animation)**
- [x] **Mobile navigation toggle (Player/GM tabs)**

### Character System
- [x] Full character sheet with compact layout
- [x] **Edition selector (2014 vs 2024 rules)**
- [x] **Subrace selection** (High Elf, Wood Elf, Hill Dwarf, etc.)
- [x] **Subclass selection** with level-appropriate timing
- [x] **ASI bonuses** displayed inline (base + racial bonus = final)
- [x] 3-column Combat tab (Actions, Bonus Actions, Reactions)
- [x] **3D Dramatic Dice Roller** - animated bouncing dice with glow effects
- [x] **All clickable rolls** - Saving throws, skill checks, attack rolls trigger 3D dice
- [x] **Level Up Wizard with MULTICLASSING** - choose to continue or multiclass
- [x] **Dynamic spellcasting tab** - correct ability (INT/WIS/CHA) by class
- [x] **Spell slots display** based on level and class type
- [x] Cantrips and prepared spells tracking
- [x] **Enhanced Notes tab** - Personal notes + GM synced notes + timeline hint
- [x] Spells, Inventory, Notes tabs with animated hover effects

### Branding & UI
- [x] **Custom Rookie Quest Keeper logos** (main + mini)
- [x] **Grand animated KEEPER title** - large, glowing, shimmer effect
- [x] **Floating logo animation** on landing page
- [x] **Fixed background** that scrolls with page
- [x] Mini dragon compass logo in nav/header
- [x] Logo on auth pages
- [x] **Tab hover animations** with glow effect
- [x] **Card hover effects** with scale and shadow
- [x] **Press scale animation** on buttons

### Pricing & Subscriptions
- [x] **Monthly/Yearly billing toggle**
- [x] **Yearly savings display** (e.g., "Save £7.89/year (~16% off)")
- [x] Per-month equivalent shown for yearly plans
- [x] Promo code support

### Combat System
- [x] **Combat Page with Fantasy Sunset theme**
- [x] Initiative tracker with turn order
- [x] HP tracking with +/- buttons
- [x] Death saves, conditions management

### GM-Player Sync
- [x] **Campaign Timeline API** - Events visible to GM and players
- [x] **GM Note Sync API** - Push notes from GM to player character notes
- [x] **Session Recaps sync** to players
- [x] **Player Timeline API** - View all events across joined campaigns
- [x] **"Sync to Players" button** on GM Screen notes

### Mobile Responsiveness
- [x] **Mobile navigation toggle** (Player Hub / GM Side)
- [x] **Responsive grids** - single column on mobile
- [x] **Touch-friendly tap targets** (44px minimum)
- [x] **Safe area support** for notched devices
- [x] **Smooth scrolling** on mobile
- [x] **Responsive character sheet** - stacks columns on mobile
- [x] **Responsive text sizes** - smaller on mobile

### Integrations
- [x] Stripe (subscription tiers)
- [x] Resend (email)
- [x] Emergent LLM Key (ROOK AI)

## Known Issues
1. **Production Login/Password Reset** - User reports inability to login on production site. Preview works correctly.

## Upcoming Tasks (P1)
1. Test spell clicking for damage rolls
2. Verify all class actions work (Barbarian rage, etc.)
3. Build player timeline UI component
4. Real-time WebSocket sync

## Future Tasks (P2+)
- Backend refactoring (split server.py into modules)
- Custom rules JSON upload system
- Quick Start Tutorial for GMs
- Combat Log feature

## Technical Architecture
```
/app
├── backend/
│   └── server.py
└── frontend/
    ├── public/
    │   └── images/
    │       ├── logo-main.png
    │       └── logo-mini.png
    └── src/
        ├── index.css (responsive utilities, animations)
        ├── components/
        │   ├── ui/
        │   │   └── DiceRoller3D.js
        │   ├── AuthPage.js
        │   ├── CharacterBuilder.js
        │   ├── CharacterSheetFull.js
        │   ├── CombatPage.js
        │   ├── GMScreen.js (with Sync to Players)
        │   ├── LandingPage.js (grand KEEPER title)
        │   ├── LevelUpWizard.js (multiclassing)
        │   ├── PricingPage.js
        │   └── UnifiedDashboard.js
        └── data/
            ├── characterRules5e.js
            └── spellDatabase.js
```

## CSS Animation Classes Added
- `.tab-glow` - Hover glow effect for tabs
- `.tab-active` - Active tab with persistent glow
- `.card-hover` - Card hover with scale and shadow
- `.press-scale` - Scale down on press
- `.icon-float` - Floating animation for icons
- `.glow-border` - Animated glow border
- `.mobile-stack` - Stack on mobile
- `.mobile-hide` - Hide on mobile
- `.mobile-full` - Full width on mobile
- `.mobile-grid-1` - Single column grid on mobile

## New API Endpoints
- `GET /api/campaigns/{id}/timeline` - Get campaign timeline events
- `POST /api/campaigns/{id}/timeline` - Create timeline event
- `POST /api/campaigns/{id}/sync-note` - Sync GM note to players
- `GET /api/player/timeline` - Get all timeline events for player

## Test Credentials (Preview Only)
- Email: lcblakey24@outlook.com
- Password: LCBlakey24?!
