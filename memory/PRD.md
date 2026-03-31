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
    ├── DiceRoller.js               # GM dice roller with advantage/disadvantage
    ├── DiceRollHistory.js          # Dice roll history sidebar
    ├── CharacterSheetFull.js       # Player page (top stat boxes removed)
    ├── CharacterCombatTab.js       # Combat dashboard
    ├── CharacterSpellbook.js       # Smart Spellbook
    ├── CharacterInventory.js       # Quick-Action Inventory
    ├── PlayerProgressionDashboard.js # Character progression timeline
    ├── LevelUpWizard.js            # Full Fighter support (fighting style, subclass, maneuvers)
    ├── SessionJournal.js           # Auto-tagging session log
    ├── PartyInventory.js           # Loot/Economy with treasure gen
    ├── CampaignDashboard.js        # Fixed sidebar navigation
    ├── GMScreen.js                 # GM tools with 14 tabs (includes AI Planner)
    └── gm/
        ├── AICoGM.js               # AI Co-GM assistant
        ├── AISessionPlanner.js     # AI Session Outline & Replay generator
        ├── SmartSessionLog.js      # Auto-tagging session log
        ├── StoryArcTracker.js      # Story arc tracking
        ├── NPCRelationshipMap.js   # NPC network visualization
        ├── Soundboard.js           # Ambient sound effects
        └── LiveSessionMode.js      # Live session tools
```

## Implemented Features

### Phase 1-4: Core Platform, Refactoring, Player Page (Complete)
Full auth, character CRUD, GM tools, world map, AI, 3D dice, soundboard, NPC network, 18-file backend modularization, Combat Tab, Smart Spellbook, Quick-Action Inventory, Level Up Wizard with spellcasting.

### Phase 5: Dice & Progression (Complete)
- **3D Dice Roller (BG3-style)**: Sequential animation with blue/purple flames, red/green for nat 1/20
- **Player Progression Dashboard**: Visual timeline, achievement badges, stat cards

### Phase 6: AI Planner & History (Complete - March 31, 2026)
- **Dice Roll History Sidebar**: Session-persistent roll log with timestamps, crit/fumble highlights, Share Roll
- **AI Session Outline Auto-generator**: GM tool, configurable focus/tone, GPT-5.2
- **AI Session Replay Generator**: 4 writing styles, stored per campaign

### Phase 7: Fighter System & Bug Fixes (Complete - March 31, 2026)
- **Fighter Level-Up System Overhaul**:
  - Complete 20-level progression with all features (Second Wind, Action Surge, Extra Attack scaling, Indomitable)
  - Fighting Style selection at level 1 (6 styles: Archery, Defense, Dueling, Great Weapon Fighting, Protection, Two-Weapon Fighting)
  - Subclass selection at level 3: Champion, Battle Master, Eldritch Knight with features at levels 3, 7, 10, 15, 18
  - Battle Master maneuvers (16 total) with superiority dice resource tracking
  - Indomitable resource tracking (long rest, scaling at 9/13/17)
  - Auto-scaling Extra Attack (1→2→3 at levels 5/11/20)
  - Backend LevelUpRequest model accepts fighting_style, subclass, maneuvers

- **Removed Duplicate Top Stat Boxes**: HP/AC/Init/Speed row removed from player page header. Stats accessible via Overview tab (PlayerProgressionDashboard) and Combat tab (StatPills).

- **Dice Roller Advantage Bug Fix**: 
  - rollDice now accepts `rollType` parameter ('normal'|'advantage'|'disadvantage')
  - Advantage: rolls 2d20, takes highest (not sum)
  - Disadvantage: rolls 2d20, takes lowest
  - Added Advantage/Disadvantage buttons to GM DiceRoller (D20 only)
  - Result display shows which roll was kept with dropped roll crossed out
  - Reckless Attack action auto-rolls with advantage

## Prioritized Backlog

### P2 - Future Tasks
- Event System: Custom activities with configurable costs/risks
- Mini-game Engine: Gambling/racing with dice outcomes

### Known Issues
- Production Login/Password Reset: BLOCKED (External host config)
- Production Deployment Risk: Root cause of blank site unknown (BLOCKED)

## Key API Endpoints
- `PATCH /api/characters/{id}` - Partial update (HP, conditions, spell slots, currency, etc.)
- `POST /api/characters/{id}/level-up` - Level up with fighting_style, subclass, maneuvers, spells
- `POST /api/ai/session-outline/{campaign_id}` - Generate AI session outline
- `POST /api/ai/session-replay/{campaign_id}` - Generate AI session replay

## Test Iterations
- 62-65: Core features 100% | 67-68: P1 features & Dice 100% | 69: Dice History & AI 100%
- 70: Fighter System, Advantage Fix, Stats Cleanup — 100%

---
*Last Updated: March 31, 2026*
