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
    │   ├── CharacterCombatTab.js       # Combat dashboard (HP, attacks, conditions, exhaustion, concentration)
    │   ├── LevelUpWizard.js            # Fighter support (fighting style, subclass, maneuvers)
    │   ├── GMScreen.js                 # GM tools (14 tabs)
    │   └── gm/AISessionPlanner.js      # AI Session Outline, Replay & Prep Checklist
    └── data/
        ├── classFeatures.js            # 2014 + 2024 rules for ALL 12 classes
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
- **16 D&D 5e conditions** with full mechanical effects
- **Visual indicators**: ▲ (green, advantage), ▼ (red, disadvantage), ✕ (red, auto-fail) on every affected skill, save, and attack
- **Effects summary bar**: Shows all active mechanical effects in combat tab
- **D&D 5e cancellation rule**: Advantage + disadvantage from different sources cancel out to normal
- **conditionEffects.js**: Shared data utility

### Phase 10: UI Compaction & Trackers (Complete - March 31, 2026)
- **UI Compaction**: 3-column layout (ability scores | skills | main content) - fits on one screen with minimal scrolling
- **Exhaustion Tracker**: EXHAUST levels 1-6 with clickable toggle buttons, persistent to backend
- **Concentration Tracker**: CONC with spell name input, DROP button, concentration save on damage
- **2024 Class Features**: All 12 classes now have `features_2024` arrays (barbarian, bard, cleric, druid, fighter, monk, paladin, ranger, rogue, sorcerer, warlock, wizard)
- **Edition-aware helper**: `getClassFeatures(className, level, edition)` supports '2014'/'2024' parameter
- **React warning fix**: Deferred setState side effects in toggleCondition

### Phase 11: Session Prep Checklist Auto-generator (Complete - March 31, 2026)
- **AI-generated prep checklist**: Creates actionable checklist items from session outlines or campaign context
- **8 categories**: NPCs, Maps, Encounters, Loot, Story, Atmosphere, Handouts, Rules
- **3 priority levels**: HIGH, MED, LOW with color-coded badges
- **Progress tracking**: Visual progress bar with percentage, checkable items that persist
- **Generate from outline**: Button on expanded outlines to create checklist from that specific outline
- **Backend endpoints**: POST/GET/PATCH for checklists with MongoDB persistence
- **Frontend**: New "Checklist" tab in AI Session Planner (3 modes: Outline, Replay, Checklist)

## Prioritized Backlog

### P2 - Future Tasks
- Event System: Custom activities with configurable costs/risks
- Mini-game Engine: Gambling/racing with dice outcomes

### Known Issues (External)
- Production Login/Password Reset: BLOCKED (external hosting config)
- Production Deployment Risk: BLOCKED (external hosting config)

## Test Iterations (All 100%)
62-65: Core | 67-68: P1 | 69: AI Planner | 70: Fighter | 71: Combat UX | 72: Condition Effects | 73: UI Compaction/Trackers | 74: Prep Checklist

---
*Last Updated: March 31, 2026*
