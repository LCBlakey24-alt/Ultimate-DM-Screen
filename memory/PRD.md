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

## Implemented Features (as of March 2026)

### Authentication & Dashboard
- [x] User authentication (JWT-based)
- [x] Admin panel
- [x] Unified dashboard with side-by-side Player/GM sections
- [x] Inline campaign creation modal

### Character System
- [x] Full character sheet with compact layout
- [x] **Edition selector (2014 vs 2024 rules)**
- [x] **Subrace selection** (High Elf, Wood Elf, Hill Dwarf, etc.)
- [x] **Subclass selection** with level-appropriate timing
- [x] **ASI bonuses** displayed inline (base + racial bonus = final)
- [x] 3-column Combat tab (Actions, Bonus Actions, Reactions)
- [x] Clickable dice rolls with toast notifications
- [x] **Level Up Wizard** with HP/ASI/Feat selection
- [x] Spells, Inventory, Notes tabs

### Rules Data
- [x] **Comprehensive 5e rules file** (`/app/frontend/src/data/characterRules5e.js`)
  - All 12 PHB classes with features at each level
  - All core races with subraces and traits
  - Backgrounds with 2014/2024 variations
  - Multiclassing requirements and proficiencies
  - ASI levels, hit dice, proficiency bonuses
- [x] **Spell database** (`/app/frontend/src/data/spellDatabase.js`)
  - Cantrips through 5th level spells
  - All spellcasting classes

### Campaign Management
- [x] Campaign CRUD operations
- [x] World-building tools (Setting, Maps, Gods, Locations, NPCs)
- [x] Combat encounters and battle maps

### GM Screen
- [x] "Fantasy Sunset" theme
- [x] Combat control with initiative
- [x] NPC Name Generator
- [x] Dice Roller, Monster Lookup, Random Tables
- [x] Loot Generator, Party Overview, Session Notes

### Combat System
- [x] **Combat Page with Fantasy Sunset theme**
- [x] Initiative tracker with turn order
- [x] HP tracking with +/- buttons
- [x] Death saves, conditions management

### Integrations
- [x] Stripe (subscription tiers)
- [x] Resend (email)
- [x] Emergent LLM Key (ROOK AI)

## Upcoming Tasks (P1)
1. Add multiclass option to Level Up Wizard
2. Integrate spell database into character sheet
3. Test Stripe checkout flow

## Future Tasks (P2+)
- Real-time Campaign Sync (WebSockets)
- Backend refactoring (split server.py)

## Technical Architecture
```
/app
├── backend/
│   └── server.py
└── frontend/
    └── src/
        ├── components/
        │   ├── CharacterBuilder.js (enhanced with 2014/2024)
        │   ├── CharacterSheetFull.js
        │   ├── CombatPage.js
        │   ├── GMScreen.js
        │   ├── LevelUpWizard.js
        │   └── UnifiedDashboard.js
        └── data/
            ├── characterRules5e.js (NEW - comprehensive rules)
            └── spellDatabase.js
```

## Test Credentials (Preview Only)
- Email: lcblakey24@outlook.com
- Password: LCBlakey24?!
