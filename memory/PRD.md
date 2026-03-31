# Rookie Quest Keeper (ROOK) - Product Requirements Document

## Original Problem Statement
Build an immersive, context-aware TTRPG application with strict SRD 5.1 compliance. Dual-theme design (Midnight Neon for GM, Electric Tundra for Players), advanced GM tools, and a combat-ready player dashboard surpassing D&D Beyond.

## Architecture
```
/app
├── backend/
│   ├── server.py              # Thin orchestrator
│   ├── models/                # Pydantic models (LevelUpRequest: fighting_style, subclass, maneuvers, rules_edition)
│   ├── routes/                # 18 modular route files
│   └── utils/                 
└── frontend/src/
    ├── components/
    │   ├── ui/DiceRoller3D.js          # BG3-style sequential dice animation
    │   ├── DiceRoller.js               # GM dice roller (bright theme, adv/disadv buttons)
    │   ├── DiceRollHistory.js          # Dice roll history sidebar
    │   ├── CharacterSheetFull.js       # Player page (quick dice bar, rollDice → combat)
    │   ├── CharacterCombatTab.js       # Combat dashboard (HP tracker, clickable attacks, death saves w/ skull, roll mode)
    │   ├── CharacterSpellbook.js       # Smart Spellbook
    │   ├── CharacterInventory.js       # Quick-Action Inventory
    │   ├── PlayerProgressionDashboard.js # Overview stats
    │   ├── LevelUpWizard.js            # Fighter support (fighting style, subclass, maneuvers)
    │   ├── GMScreen.js                 # GM tools (14 tabs including AI Planner)
    │   └── gm/AISessionPlanner.js      # AI Session Outline & Replay
    └── data/
        ├── classFeatures.js            # 2014 + 2024 rules (features_2024 per class)
        ├── classResources.js           # Indomitable, superiority_dice
        └── spellDatabase.js
```

## Implemented Features

### Phases 1-5: Core → Dice & Progression (Complete)
Full auth, character CRUD, 18-route backend, GM tools, world map, AI, 3D dice (BG3-style), soundboard, NPC network, Smart Spellbook, Quick-Action Inventory, Player Progression Dashboard.

### Phase 6: AI Planner & Dice History (Complete)
- Dice Roll History Sidebar (Share Roll)
- AI Session Outline Auto-generator (GPT-5.2)
- AI Session Replay Generator (4 styles)

### Phase 7: Fighter System & Advantage Fix (Complete)
- Fighter 20-level progression, subclasses (Champion/Battle Master/Eldritch Knight)
- Dice advantage bug fix (takes highest, not sum)
- Removed duplicate top stat boxes

### Phase 8: Combat UX Overhaul & Rules Edition (Complete - March 31, 2026)
- **Clickable Attacks**: To-hit (red, +mod) and damage (gold, dice notation) buttons on every weapon. Versatile 2H damage button (purple). All trigger 3D dice roller.
- **HP Tracker**: Visual HP bar with DMG/HEAL input field + buttons. Temp HP controls. All in combat tab.
- **Roll Mode Toggle**: Disadvantage / Normal / Advantage toggle in combat tab. Affects all attack rolls.
- **Death Save Animation**: Red skull SVG with scale-and-fade keyframe animation on failed saves. "Roll Save" button auto-handles NAT 1 (2 failures), NAT 20 (regain 1 HP), success/fail. "CHARACTER DEAD" / "STABILIZED" text at 3 fails/successes.
- **Initiative Click**: Init stat pill clickable to roll 1d20+DEX.
- **Quick Dice Bar**: Fixed bottom bar with d4/d6/d8/d10/d12/d20/D% buttons.
- **GM Dice Roller Visibility**: Brightened background (dark purple panel, purple border), improved text contrast.
- **Rules Edition Support (2014/2024)**: Edition badge in combat tab stat pills. Fighter has separate `features_2024` with 2024 PHB features (Weapon Mastery, Tactical Mind, Tactical Shift, Tactical Master, Studied Attacks). Backend model accepts `rules_edition` field.

## Prioritized Backlog

### P2 - Future Tasks
- Event System: Custom activities with configurable costs/risks
- Mini-game Engine: Gambling/racing with dice outcomes
- Expand 2024 rules to other classes (Wizard, Rogue, Cleric, etc.)

### Known Issues (External)
- Production Login/Password Reset: BLOCKED (External host config)
- Production Deployment Risk: BLOCKED (External)

## Test Iterations
- 62-65: Core features 100% | 67-68: P1 features & Dice 100%
- 69: Dice History & AI 100% | 70: Fighter System 100%
- 71: Combat UX, HP Tracker, Clickable Attacks, Death Saves, Quick Dice, Rules Edition — 100%

---
*Last Updated: March 31, 2026*
