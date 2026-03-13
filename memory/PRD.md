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

## Implemented Features (as of March 2026)

### Authentication & Dashboard
- [x] User authentication (JWT-based)
- [x] Admin panel
- [x] Unified dashboard with side-by-side Player/GM sections
- [x] Inline campaign creation modal (no navigation away)
- [x] Character creation via CharacterBuilder

### Character System
- [x] Full character sheet with compact layout
- [x] Ability scores with saving throw rolls
- [x] Skills list with proficiency indicators
- [x] Combat stats (HP, AC, Initiative, Speed)
- [x] 3-column Combat tab (Actions, Bonus Actions, Reactions)
- [x] Clickable dice rolls with toast notifications
- [x] Spells, Inventory, Notes tabs
- [x] Improved text readability (larger font sizes)
- [x] **Level Up Wizard** - Multi-step guided level up with HP/ASI/Feat

### Campaign Management
- [x] Campaign CRUD operations
- [x] World-building tools (Setting, Maps, Gods, Locations, NPCs)
- [x] Chronicle for session tracking
- [x] Combat encounters and battle maps

### GM Screen
- [x] "Fantasy Sunset" theme applied
- [x] Combat control with encounter selection
- [x] NPC Name Generator
- [x] Dice Roller
- [x] Monster Lookup
- [x] Custom Creatures Manager
- [x] Random Tables
- [x] Loot Generator
- [x] Party Overview
- [x] Session Notes

### Combat System
- [x] **Combat Page with Fantasy Sunset theme**
- [x] Initiative tracker with turn order
- [x] HP tracking with +/- buttons
- [x] Death saves with visual indicators
- [x] Conditions management
- [x] Battle map with tokens

### Spell System
- [x] **Comprehensive spell database** (`/app/frontend/src/data/spellDatabase.js`)
  - Cantrips through 5th level spells
  - All spellcasting classes covered
  - Spell slots and pact magic tables
  - Helper functions for class spell lists

### Integrations
- [x] Stripe (subscription tiers on landing page)
- [x] Resend (email)
- [x] Emergent LLM Key (ROOK AI features)
- [x] PyMuPDF (PDF extraction)

## Removed/Deprecated Components
- PlayerDashboard.js → UnifiedDashboard
- CampaignList.js → UnifiedDashboard
- CharacterSheet.js → CharacterSheetFull
- FloatingDiceRoller.js (removed)
- LevelUpModal.js → LevelUpWizard

## Known Issues
- **Production Deployment Risk** - Previous "blank screen" issue; root cause unknown

## Upcoming Tasks (P1)
1. Integrate spell database into character sheet spells tab
2. Add spell slot tracking to character sheet
3. Test Stripe checkout flow

## Future Tasks (P2+)
- Real-time Campaign Sync (WebSockets)
- Backend refactoring (split server.py into modular routers)
- Quick Start Tutorial for GMs

## Technical Architecture
```
/app
├── backend/
│   └── server.py (monolithic)
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CharacterSheetFull.js
    │   │   ├── CombatPage.js (Fantasy Sunset themed)
    │   │   ├── GMScreen.js
    │   │   ├── LevelUpWizard.js
    │   │   └── UnifiedDashboard.js
    │   └── data/
    │       └── spellDatabase.js (NEW - comprehensive spell data)
```

## Test Credentials (Preview Environment Only)
- Email: lcblakey24@outlook.com
- Password: LCBlakey24?!
