# Rookie Quest Keeper (ROOK) - Product Requirements Document

## Original Problem Statement
Build an immersive, context-aware TTRPG application with strict SRD 5.1 compliance. Dual-theme design (Midnight Neon for GM, Electric Tundra for Players), advanced GM tools, and a combat-ready player dashboard surpassing D&D Beyond.

## Architecture
```
/app
├── backend/
│   ├── server.py              # Thin orchestrator (~150 lines)
│   ├── models/                # Pydantic models (~1900 lines)
│   ├── routes/                # 18 modular route files
│   └── utils/                 
└── frontend/src/components/
    ├── ui/DiceRoller3D.js          # BG3-style sequential dice animation
    ├── CharacterSheetFull.js       # 6 tabs: overview, combat, spells, inventory, journal, notes
    ├── CharacterCombatTab.js       # Combat dashboard
    ├── CharacterSpellbook.js       # Smart Spellbook
    ├── CharacterInventory.js       # Quick-Action Inventory
    ├── PlayerProgressionDashboard.js # Character progression timeline
    ├── LevelUpWizard.js            # Spellcasting-aware Level Up
    ├── SessionJournal.js           # Auto-tagging session log
    ├── PartyInventory.js           # Loot/Economy with treasure gen
    ├── CampaignDashboard.js        # Fixed sidebar navigation
    └── tabs/
        ├── WorldMapTab.js          # Pin hover previews
        └── CombatCreatorTab.js     # Quick NPC Bar
```

## Implemented Features

### Phase 1: Core Platform (Complete)
Full auth, character CRUD, GM tools, world map, AI, 3D dice, soundboard, NPC network

### Phase 2: Backend Refactoring (Complete)
9700-line monolith split into 18 route files

### Phase 3: Player Page (Complete)
- **Batch A**: Combat Tab (spell slots, death saves, conditions, inspiration, rest)
- **Batch B**: Quick-Action Inventory (multi-currency, quick equip, attunement)
- **Batch C**: Smart Spellbook (prepared toggle, upcasting, Cast button)
- **Level Up Wizard**: Spellcasting step (slot progression, spell/cantrip selection)

### Phase 4: P1 Features (Complete)
- **Smart Session Log**: Auto-tagging (combat, loot, quest, travel, magic keywords), tag filtering
- **Location Detail Cards**: Hover preview on World Map pins
- **NPC Encounter Builder**: Quick NPC Bar in Combat Creator
- **Loot & Economy**: SRD Treasure Generator, gem/magic item gen, auto-split gold
- **Campaign Sidebar Fix**: Group headers auto-navigate on click

### Phase 5: Dice & Progression (Complete - March 31, 2026)
- **3D Dice Roller (BG3-style)**: Sequential animation — dice appear one at a time, spin, land with result, then "smash together" into total with impact shockwave
  - Blue (#4DD0E1) flames for Player theme
  - Dark purple (#8A2BE2) flames for GM theme
  - Red glow + red flames on Natural 1
  - Green glow + green flames on Natural 20
  - Edge glow on all 4 screen borders
  - Corner intensifiers for crit/fumble
  - Compound dice support (2d6+1d4, 8d6)
  - Flame particles, screen shake on impact
- **Player Progression Dashboard**: Default 'overview' tab showing:
  - Character header with level badge, XP Progress bar
  - Stat cards (HP, AC, Spells, Items, Gold)
  - Vitals bars (HP, Hit Dice)
  - Adventure Timeline (level ups, spells learned, items found, combat, quests)
  - Achievement badges (Adventurer, Specialization, Veteran, Arcanist, Collector, Wealthy, Chronicler)
- **rollDice signature fix**: Standardized (notation, modifier, label) across all callers

## Prioritized Backlog

### P2 - Future Tasks
- Event System: Custom activities with configurable costs/risks
- Mini-game Engine: Gambling/racing with dice outcomes
- Session Replay Generator: Narrative-style recaps

### Known Issues
- Production Login/Password Reset: BLOCKED (External host config)
- Production Deployment Risk: Root cause of blank site unknown (BLOCKED)

## Key API Endpoints
- `PATCH /api/characters/{id}` - Partial update (HP, conditions, spell slots, currency, etc.)
- `PUT /api/characters/{id}/resources` - Sync class resources
- `POST /api/characters/{id}/rest` - Short/Long rest
- `POST /api/characters/{id}/level-up` - Level up with spell selections

## Test Iterations
- 62: Backend refactor 100% | 63: Player features 100% | 64: Batch A 100% | 65: Batch B/C 100%
- 67: P1 features 100% | 68: Dice & Progression 100%

---
*Last Updated: March 31, 2026*
