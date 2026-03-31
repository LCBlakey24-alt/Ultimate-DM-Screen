# Rookie Quest Keeper (ROOK) - Product Requirements Document

## Original Problem Statement
Build an immersive, context-aware TTRPG application with strict SRD 5.1 compliance. Dual-theme design (Midnight Neon for GM, Electric Tundra for Players), advanced GM tools, and a combat-ready player dashboard surpassing D&D Beyond.

## Architecture
```
/app
├── backend/
│   ├── server.py              # Thin orchestrator
│   ├── models/                # Pydantic models
│   ├── routes/                # 18 modular route files
│   └── utils/                 
└── frontend/src/
    ├── components/
    │   ├── ui/DiceRoller3D.js          # BG3-style sequential dice animation
    │   ├── DiceRoller.js               # GM dice roller (adv/disadv buttons)
    │   ├── DiceRollHistory.js          # Dice roll history sidebar
    │   ├── CharacterSheetFull.js       # Player page (condition-aware skills/saves, quick dice bar)
    │   ├── CharacterCombatTab.js       # Combat dashboard (HP tracker, clickable attacks, conditions, death saves)
    │   ├── LevelUpWizard.js            # Fighter support (fighting style, subclass, maneuvers)
    │   ├── GMScreen.js                 # GM tools (14 tabs)
    │   └── gm/AISessionPlanner.js      # AI Session Outline & Replay
    └── data/
        ├── classFeatures.js            # 2014 + 2024 rules
        ├── classResources.js           # Indomitable, superiority dice
        ├── conditionEffects.js         # D&D 5e condition → roll effect mapping
        └── spellDatabase.js
```

## Implemented Features

### Phases 1-7: Core → Fighter System (Complete)
Full auth, character CRUD, 18-route backend, GM tools, world map, AI, 3D dice (BG3-style), soundboard, NPC network, Smart Spellbook, Quick-Action Inventory, Player Progression Dashboard, AI Session Planner, Dice Roll History, Fighter 20-level progression with subclasses, advantage/disadvantage fix.

### Phase 8: Combat UX Overhaul (Complete)
- Clickable attacks (to-hit + damage)
- HP Tracker with DMG/HEAL input
- Roll Mode Toggle (Disadv/Normal/Adv)
- Death Save animation (red skull SVG)
- Quick Dice Bar (d4-d20, D%)
- 2014/2024 rules edition

### Phase 9: Condition Auto-Effects System (Complete - March 31, 2026)
- **16 D&D 5e conditions** with full mechanical effects:
  - Blinded: disadvantage on attacks
  - Frightened: disadvantage on attacks + ability checks
  - Invisible: advantage on attacks
  - Paralyzed/Petrified/Stunned/Unconscious: auto-fail STR/DEX saves
  - Poisoned: disadvantage on attacks + ability checks
  - Prone: disadvantage on attacks
  - Restrained: disadvantage on attacks + DEX saves
  - Exhaustion: disadvantage on ability checks
- **Visual indicators**: ▲ (green, advantage), ▼ (red, disadvantage), ✕ (red, auto-fail) on every affected skill, save, and attack
- **Effects summary bar**: Shows all active mechanical effects in combat tab
- **Attack section banner**: Shows current advantage/disadvantage status with source reasons
- **D&D 5e cancellation rule**: Advantage + disadvantage from different sources cancel out to normal
- **Auto-fail saves**: Paralyzed/Stunned/Unconscious show toast error instead of rolling
- **conditionEffects.js**: Shared data utility with `getConditionRollEffect()` and `getConditionIndicator()`

## Prioritized Backlog

### P2 - Future Tasks
- Event System: Custom activities with configurable costs/risks
- Mini-game Engine: Gambling/racing with dice outcomes
- Expand 2024 rules to other classes

### Known Issues (External)
- Production Login/Password Reset: BLOCKED
- Production Deployment Risk: BLOCKED

## Test Iterations (All 100%)
62-65: Core | 67-68: P1 | 69: AI Planner | 70: Fighter | 71: Combat UX | 72: Condition Effects

---
*Last Updated: March 31, 2026*
