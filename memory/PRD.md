# Rookie Quest Keeper (ROOK) - Product Requirements Document

## Original Problem Statement
Build a TTRPG application called "Rookie Quest Keeper" (ROOK) for Players (character management) and Game Masters (campaign management, GM tools).

## Visual Theme: Cyber-Fantasy Dual Theme

### GM Mode - "Midnight Neon" (Purple/Violet)
- Background: Black (#0B0B0D) to purple glow at bottom
- Primary: #8A2BE2, Secondary: #4B0082

### Player Mode - "Electric Tundra" (Blue/Cyan)
- Background: Dark blue (#050A30) to cyan glow at bottom
- Primary: #4DD0E1, Secondary: #0066FF

## Code Architecture (Modular Backend)
```
/app/backend/
├── server.py              # Thin orchestrator (~147 lines)
├── config.py              # Shared config, DB, constants
├── models/__init__.py     # All Pydantic models (~1850 lines)
├── utils/
│   ├── auth.py            # JWT, passwords, subscription, campaign access, rest/resource helpers
│   ├── helpers.py         # Campaign context, SRD data loading
│   └── ws_manager.py      # WebSocket connection manager
├── routes/                # 18 domain-specific route files
│   ├── auth.py, subscriptions.py, admin.py, campaigns.py
│   ├── campaign_content.py, world.py, notes.py, npcs.py
│   ├── combat.py, players.py, maps.py, ai.py
│   ├── inventory.py, user_content.py, characters.py
│   ├── srd.py, progression.py, rule_systems.py
└── data/srd/              # SRD-safe JSON data files

/app/frontend/src/
├── components/
│   ├── CharacterSheetFull.js     # Player character sheet with 5 tabs
│   ├── CharacterCombatTab.js     # NEW: Resource-aware combat dashboard
│   ├── CharacterInventory.js     # Equipment + custom item creation
│   ├── LevelUpWizard.js          # Enhanced with features-gained display
│   ├── GMScreen.js               # 12 tabs for GM tools
│   ├── gm/AICoGM.js              # Floating AI assistant
│   └── gm/NPCRelationshipMap.js  # NPC network graph
├── data/
│   ├── classResources.js         # NEW: Ki Points, Rage, etc. definitions
│   ├── classFeatures.js          # Per-level class features with types
│   ├── equipmentDatabase.js      # Weapons, armor, gear
│   ├── spellDatabase.js          # Spell data
│   └── itemsDatabase.js          # Clean SRD items
```

## Completed Features

### Player Experience Overhaul (March 31, 2026) - LATEST
- **Combat Tab redesign**: Weapon attacks derived from equipped items with calculated to-hit and damage
- **Class Resource Tracking**: Clickable dot trackers for Ki Points, Rage, Sorcery Points, Channel Divinity, etc. with short/long rest indicators
- **Compact Feature List**: Features shown as single-line entries with type badges (A=Action, BA=Bonus, R=Reaction, P=Passive) and expand-on-click for full description
- **Resource-linked abilities**: "Use" button on features that cost resources (e.g., Flurry of Blows spends 1 Ki Point)
- **Rest System**: Short Rest (spend hit dice to heal, restore short-rest resources) and Long Rest (full HP, half hit dice, all resources)
- **Level Up Wizard**: Shows features gained at new level (e.g., "Action Surge" at Fighter 2)
- **Custom Item Creation**: Add homebrew weapons/armor/gear with damage/AC values
- **Backend REST endpoints**: PUT /characters/{id}/resources, POST /characters/{id}/short-rest, POST /characters/{id}/long-rest

### Backend Refactoring (March 31, 2026)
- 9,717-line monolith → 18 modular route files + models + utils
- 40/40 backend tests passed, zero regressions (iteration_62)

### Previous Completions
- NPC Network with full stat blocks and AI generation
- World Map with draggable pins, grid overlay, custom freehand paths
- AI Co-GM floating panel with 9 context-aware modes
- Combat flow with 16 status conditions
- Equipment auto-save with AC calculation
- Copyright cleanup (SRD-safe only), Dual-theme system

## Upcoming Tasks (Priority Order)

### P1 - High Priority
1. **Smart Session Log** - Auto-tagging NPCs/locations in notes, AI recaps
2. **Location Detail Cards** - Hover previews on World Map pins
3. **AI Session Outline Auto-generator** - From story arcs/NPCs/party location
4. **NPC Encounter Builder** - Drag NPCs from network graph into Combat tracker

### P2 - Medium Priority
5. **Loot & Economy System** - Shared party loot, regional wealth tracking
6. **Event System** - Festivals, tournaments with configurable risks
7. **Mini-Game Engine** - Gambling, racing with dice
8. **Session Replay Generator** - Narrative recaps

## Known Issues
- Production Login/Password Reset: External server config issue (BLOCKED)

## Test Results
- iteration_63: Backend 100% (16/16), Frontend 100% - Player experience features
- iteration_62: Backend 100% (40/40), Frontend 100% - Post-refactoring regression
- iteration_61: Backend 90%, Frontend 100% - AI Co-GM + Combat + Equipment
- iteration_60: Frontend 100% - Theme + Map
- iteration_59: Backend+Frontend 100% - NPC Network

## Test Credentials
- Email: lcblakey24@outlook.com
- Password: LCBlakey24?!

---
*Last Updated: March 31, 2026*
