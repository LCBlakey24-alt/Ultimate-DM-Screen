# Rookie Quest Keeper (ROOK) - Product Requirements Document

## Original Problem Statement
Build a TTRPG application called "Rookie Quest Keeper" (ROOK) with a "Fantasy Sunset" theme. The application serves both Players (character management) and Game Masters (campaign management, GM tools).

## Visual Theme: Fantasy Sunset
All pages share a consistent visual theme:
- **Background**: Dark purple gradient over scenic mountain/sunset image
- **Glass Panels**: Frosted glass effect with backdrop blur
- **Accent Colors**: Purple (#8B5CF6), Pink (#EC4899), Gold (#F59E0B)
- **Typography**: Cinzel for headers, Montserrat for body
- **NO GREEN**: All green (#22c55e) replaced with gold (#F59E0B)

## Current Access Model (March 2026)
- **Player Features**: LOCKED - "Coming Soon" overlay on home page
- **GM Features**: FULLY ACCESSIBLE - Create campaigns, GM tools, AI, etc.

## Subscription Tiers
| Tier | Price | Status | Features |
|------|-------|--------|----------|
| Free | £0 | Active | View campaigns (read-only), Basic dice roller, Limited access |
| Player | TBD | Coming Soon | Create characters, Join campaigns, Full character sheets |
| Game Master | £3.99/mo | Active | Create campaigns, GM tools & AI, Combat tracker, World building |
| Legendary | £5.99/mo | Active | Full GM access, Player tier included*, Priority AI, Early access |

## Recent Updates (March 2026)

### Persistent Quick Dice Panel (NEW)
- **Always visible** on right side of GM Screen across all tabs
- **Quick Roll buttons**: d4, d6, d8, d10, d12, d20
- **Common Rolls**: Attack (d20), Advantage (2d20 high), Disadvantage (2d20 low), Damage (2d6), Fireball (8d6)
- **Percentile**: Roll d100
- **Collapsible**: Can minimize to icon-only mode

### Color Theme Cleanup (Complete)
Replaced ALL green (#22c55e) with gold (#F59E0B) in:
- GMScreen.js - Names, Tables, Party stats
- DiceRoller.js - All roll buttons
- RandomTables.js - Shop Name, save buttons
- CombatCreatorTab.js - Monster CR colors, selected states
- EncounterGeneratorTab.js - Easy difficulty, selection states
- CalendarTab.js - Today highlights
- CampaignSettingTab.js - Player management, buttons
- AccountSettings.js - All green buttons/highlights
- AdminPage.js - Status indicators
- CombatPage.js - HP/status colors
- CustomCreatureManager.js - Success states
- CharacterSheetFull.js - Heal buttons

### GM Screen Tab Consolidation (9 Tabs)
1. **Combat** - Combat control, saved encounters, spontaneous combat
2. **Location** - Location management
3. **NPCs** - Saved NPCs + Name Generator (side by side)
4. **Monsters** - SRD Lookup + Custom Creatures (side by side)
5. **Tables** - Random tables (Tavern, Shop, NPC Quirk, Weather, Plot Hook, Loot)
6. **Loot** - Loot generator
7. **Dice** - Full dice roller (separate from quick panel)
8. **Party** - Party overview
9. **Notes** - GM notes with sync

### Campaign Settings Modal
- **Settings button** in Campaign Dashboard header
- Upload Custom Rulesets, Races/Classes, Items/Spells, Monsters/NPCs

## Implemented Features

### Landing Page
- [x] Centered logo with "KEEPER" in large white text with glow
- [x] Foggy glass panels for readability
- [x] 4-tier pricing: Free, Player (Coming Soon), GM (£3.99), Legendary (£5.99)

### Home Dashboard
- [x] **Player Section**: LOCKED with "Coming Soon" overlay
- [x] **GM Section**: Fully functional with campaigns visible

### Campaign Dashboard
- [x] Settings button - Opens upload modal
- [x] GM Screen button - Opens GM tools
- [x] ROOK assistant panel
- [x] World Setting with style selector

### GM Screen (9 Tabs + Quick Dice)
- [x] **Quick Dice Panel** - Persistent sidebar with d4-d20, common rolls, d100
- [x] **Combat** - Saved encounters + spontaneous combat
- [x] **Location** - Location management
- [x] **NPCs** - Two-column: Saved NPCs + Name Generator
- [x] **Monsters** - Two-column: SRD Lookup + Custom Creatures
- [x] **Tables** - Random tables (gold colors)
- [x] **Loot** - Loot generator
- [x] **Dice** - Full dice roller
- [x] **Party** - Party overview
- [x] **Notes** - GM notes with sync

### Character System (Locked but Ready)
- [x] Character Builder with edit mode
- [x] 3D Dice Roller
- [x] Equipment & Inventory System (3,059 items)
- [x] Temporary HP with damage absorption
- [x] Proficient skills with purple glow
- [x] Level Up Wizard with Multiclassing

## Remaining Tasks

### When Player Tier Launches
1. Remove "Coming Soon" overlay from Player section
2. Enable character creation for subscribers
3. Connect inventory system
4. Enable real-time GM loot drops

### Upcoming Features
1. File upload backend implementation
2. Real-time GM Loot System (WebSocket)
3. Map Creator Enhancements

### Future/Backlog
1. Soundboard with ambient noises
2. PDF export for character sheets
3. Live audio transcription
4. VTT with video/audio chat
5. Backend refactoring

## Technical Architecture
```
/app/frontend/src/components/
├── GMScreen.js           - 9 tabs + persistent Quick Dice panel
│   ├── Quick Dice (persistent right sidebar)
│   ├── Combat, Location, NPCs, Monsters, Tables
│   ├── Loot, Dice, Party, Notes
├── CampaignDashboard.js  - Settings modal, GM Screen button
├── LandingPage.js        - 4-tier pricing
├── UnifiedDashboard.js   - Player section locked
└── All components        - Gold (#F59E0B) instead of green
```

## Test Credentials (Preview Only)
- Email: lcblakey24@outlook.com
- Password: LCBlakey24?!
