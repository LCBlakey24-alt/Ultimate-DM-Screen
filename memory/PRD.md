# Rookie Quest Keeper (ROOK) - Product Requirements Document

## Original Problem Statement
Build a TTRPG application called "Rookie Quest Keeper" (ROOK) for Players (character management) and Game Masters (campaign management, GM tools).

## Visual Theme: Cyber-Fantasy Dual Theme

### GM Mode - "Midnight Neon" (Purple/Violet)
- Background: Black (#0B0B0D) → purple glow at bottom
- Primary: #8A2BE2, Secondary: #4B0082
- Gradient: `linear-gradient(135deg, #4B0082, #8A2BE2)`

### Player Mode - "Electric Tundra" (Blue/Cyan)
- Background: Dark blue (#050A30) → cyan glow at bottom
- Primary: #4DD0E1, Secondary: #0066FF

## GM Screen Features (12 Tabs - Live Play Only)
1. Combat, 2. Location, 3. NPCs, 4. NPC Network, 5. Monsters, 6. Tables, 7. Loot, 8. Dice, 9. Party, 10. Notes, 11. Story Arcs, 12. Soundboard

**AI Co-GM**: Floating assistant panel accessible on every tab, context-aware

## Code Architecture (Post-Refactor)
```
/app/backend/
├── server.py              # Thin orchestrator (~147 lines) - assembles routers
├── config.py              # Shared config, DB, constants
├── models/__init__.py     # All Pydantic models (~1840 lines)
├── utils/
│   ├── auth.py            # JWT, passwords, subscription, campaign access
│   ├── helpers.py         # Campaign context, SRD data loading
│   └── ws_manager.py      # WebSocket connection manager
├── routes/
│   ├── auth.py            # Register, login, password reset, account
│   ├── subscriptions.py   # Checkout, plans, referrals
│   ├── admin.py           # Admin, promo codes, reviews, creatures
│   ├── campaigns.py       # Campaign CRUD, settings, invites, members
│   ├── campaign_content.py # Races, classes, backgrounds, feats
│   ├── world.py           # Gods, calendar, locations, world builder
│   ├── notes.py           # In-game notes, timeline, session recap
│   ├── npcs.py            # NPC CRUD, relationships, AI generation
│   ├── combat.py          # Combat scenarios, initiative
│   ├── players.py         # Player CRUD
│   ├── maps.py            # Game maps, world maps, local maps
│   ├── ai.py              # AI generation, chat, portraits, tokens
│   ├── inventory.py       # Party inventory, currency, custom items
│   ├── user_content.py    # User rulesets
│   ├── characters.py      # Characters, level up, multiclass, journal
│   ├── srd.py             # SRD 5.1 reference data API
│   ├── progression.py     # Modular progression system
│   └── rule_systems.py    # Rule systems, content, bulk upload
└── data/srd/              # SRD-safe JSON data files
```

## Completed Features

### Backend Refactoring (March 31, 2026)
- Broke down 9,717-line monolithic server.py into 18 modular route files
- Created shared config, models, and utils directories
- 40/40 backend API tests passed, 100% frontend verification
- Zero regressions confirmed by testing agent (iteration_62)

### NPC Network (March 31, 2026)
- Visual graph with draggable NPC nodes, full stat blocks
- AI generation (GPT-4o) with class-appropriate stats
- 8 relationship types between NPCs

### World Map System (March 31, 2026)
- Draggable pins, grid overlay, custom freehand paths
- Travel calculator (5 modes), travel animation

### AI Co-GM (March 31, 2026)
- 9 tab-context modes, GPT-4o powered, floating chat panel

### Equipment & Inventory Enhancement (March 31, 2026)
- Auto-save on equip/unequip, AC auto-calculation

### Combat Flow Enhancement (March 31, 2026)
- 16 status conditions with SRD tooltips

### Previous Completions
- Copyright cleanup (SRD-safe only)
- Dual-theme system, Player Dashboard unlocked
- 3D Dice Roller, Soundboard, Story Arcs

## Upcoming Tasks (Priority Order)

### P1 - High Priority
1. **Smart Session Log** - Auto-tagging NPCs/locations, AI recaps
2. **Location Detail Cards** - Hover previews on World Map pins
3. **AI Session Outline Auto-generator** - From story arcs/NPCs/party location
4. **NPC Encounter Builder** - Drag NPCs from network into combat tracker

### P2 - Medium Priority
5. **Loot & Economy System** - Shared party loot, regional wealth
6. **Event System** - Festivals, tournaments with risk/reward
7. **Mini-Game Engine** - Gambling, racing with dice
8. **Session Replay Generator** - Narrative recaps

## Known Issues
- Production Login/Password Reset Broken (BLOCKED - external server config)

## Test Results
- iteration_62: Backend 100% (40/40), Frontend 100% - Post-refactoring regression test
- iteration_61: Backend 90%, Frontend 100% (AI Co-GM + Combat + Equipment)
- iteration_60: Frontend 100% (Theme + Map)
- iteration_59: Backend+Frontend 100% (NPC Network)

## Test Credentials
- Email: lcblakey24@outlook.com
- Password: LCBlakey24?!

---
*Last Updated: March 31, 2026*
