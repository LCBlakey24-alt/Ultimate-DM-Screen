# Rookie Quest Keeper (ROOK) - Product Requirements Document

## Original Problem Statement
Build an immersive, context-aware TTRPG application with strict SRD 5.1 compliance. Dual-theme design (Midnight Neon for GM, Electric Tundra for Players), advanced GM tools, and a combat-ready player dashboard surpassing D&D Beyond.

## Architecture
```
/app
├── backend/
│   ├── server.py              # Thin orchestrator
│   ├── models/                # Pydantic models
│   ├── routes/                # 20 modular route files
│   │   ├── events.py          # Event System + Location Economy
│   │   └── ...
│   └── tests/
└── frontend/src/
    ├── components/
    │   ├── GMScreen.js                 # Live Play Mode (~905 lines, grouped tabs)
    │   ├── CharacterBuilder.js         # NEW 7-step wizard (~870 lines)
    │   ├── CharacterSheetFull.js       # NEW vitals bar header
    │   ├── LevelUpWizard.js            # Full class progression
    │   └── gm/...
    └── data/
        ├── characterRules5e.js         # RACES (11), CLASSES (12), BACKGROUNDS (12)
        ├── classFeatures.js
        └── levelUpData.js
```

## Implemented Features

### Phases 1-13 (Complete)
Full auth, character CRUD, 18-route backend, GM tools, world map, AI, 3D dice, soundboard, NPC network, Smart Spellbook, Quick-Action Inventory, Player Progression Dashboard, AI Session Planner, Dice Roll History, Combat UX, 16 conditions, UI Compaction, Checklist, All 12 Classes, Rest Panel, Backstory, Initiative Tracker, Session Timer, Quick NPC Generator.

### Phase 14: Event System & Live Play Mode (Complete - April 25, 2026)
- GM Screen renamed to Live Play Mode
- Event System: Major events (Horse Racing, Boxing, Tournament, Festival, Market), Minor events (Arm Wrestling, Drinking, Cards, etc.)
- Location Economy: City tracking with gold treasury, population, reputation
- Financial Engine: Realistic cost-ripple model, Live Financial Preview, Day-by-day history

### Phase 15: Tab Organization & Refactoring (Complete - April 25, 2026)
- Grouped Sidebar Tabs: 16 tabs into 5 collapsible categories
- GMScreen.js refactored 1441 → 905 lines
- LevelUpWizard.js extracted FEATS, HIT_DICE, ASI_LEVELS to /data/levelUpData.js
- MapMaker polished: Fill, Undo, Templates, Import/Export, 12 terrain types

### Phase 16: D&D Beyond-Quality Player Experience (Complete - April 25, 2026)
**CharacterBuilder.js** - Complete rewrite as a 7-step wizard:
1. Edition (2014/2024 visual cards with info banner)
2. Race (12 visual cards + subraces with traits/speed/size/ASI pills, detail panel showing all traits and languages)
3. Class (12 visual cards with hit die/spellcaster/saving throws, detail panel: saves/armor/weapons/level-1 features/starting equipment, optional subclass dropdown)
4. Background (12 visual cards with skills/feature/2024 ASI, detail panel: granted skills/tools/feature/equipment/origin feat)
5. Abilities (3 methods: Standard Array, Point Buy 27pts, Roll 4d6 drop lowest; primary ability highlighted with gold star border; ASI bonus shown as "+ N = total"; live combat preview HP/AC/Init/Speed)
6. Skills (class options visible, background-granted skills auto-locked in gold, count-enforced selection, modifier shown with proficiency bonus added when proficient)
7. Review & Name (name, alignment dropdown, portrait URL, full summary card with portrait/identity/stats/derived combat stats/skill proficiencies/saving throws)

Stepper UI with collapsible categories and forward-jump validation. Auto-save draft to `rq_character_builder_draft_v2`.

**CharacterSheetFull.js** - Always-visible Vitals Header Bar:
- Portrait + Identity (race/subrace, class/subclass, level)
- HP with quick +/- buttons (clamped to max), color-coded (red when ≤25%)
- AC chip
- INIT chip (clickable to roll initiative)
- SPD chip
- INSP toggle (persists to backend)
- All testids for E2E: vitals-bar, current-hp, hp-decrease, hp-increase, vital-ac, vital-init, vital-speed, inspiration-toggle, sheet-back-btn

**Backend model extensions** (PlayerCharacter, PlayerCharacterCreate, PlayerCharacterUpdate):
- Added `subrace` field (e.g. "High Elf", "Hill Dwarf")
- PlayerCharacterCreate now accepts: skill_proficiencies, saving_throw_proficiencies, weapon_proficiencies, armor_proficiencies, tool_proficiencies, languages, racial_traits, class_features
- PlayerCharacterUpdate now accepts: tool_proficiencies, subrace
- Pre-existing HP field-name mismatch fixed (max_hp/hp → max_hit_points/current_hit_points) — surfaced by new vitals bar

## Prioritized Backlog

### P1 - Upcoming
- Party View Panel (see allies' HP/AC/conditions at a glance)
- Spell Slot visual overhaul

### P2 - Future
- Combat Log per character
- Player Handout System
- Session Recap Sharing
- Additional MapMaker features (custom brushes, layers)
- Assess `MiniGameEngine.js` for deletion (rendered obsolete by Event System)

### Known Issues (External)
- Production Login/Password Reset: BLOCKED (external hosting config)
- Production Deployment Risk: BLOCKED (external hosting config)

## Test Iterations
62-77: prior phases | 78: Event System (100%) | 79: Tab Grouping + Refactoring + MapMaker (35/35, 100%) | 80: Builder/Sheet overhaul (code review pass + live E2E run by main agent verified all 7 wizard steps + backend persistence + vitals bar interactions)

---
*Last Updated: April 25, 2026*
