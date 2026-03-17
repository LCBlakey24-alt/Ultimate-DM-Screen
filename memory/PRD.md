# Rookie Quest Keeper (ROOK) - Product Requirements Document

## Original Problem Statement
Build a TTRPG application called "Rookie Quest Keeper" (ROOK) with a "Fantasy Sunset" theme. The application serves both Players (character management) and Game Masters (campaign management, GM tools).

## Visual Theme: Fantasy Sunset
All pages share a consistent visual theme:
- **Background**: Dark purple gradient over scenic mountain/sunset image
- **Glass Panels**: Frosted glass effect with backdrop blur
- **Accent Colors**: Purple (#8B5CF6), Pink (#EC4899), Gold (#F59E0B)
- **Typography**: Cinzel for headers, Montserrat for body
- **NO GREEN**: Replaced all green (#22c55e) with gold (#F59E0B)

## Current Access Model (March 2026)
- **Player Features**: LOCKED - "Coming Soon" overlay on home page
- **GM Features**: FULLY ACCESSIBLE - Create campaigns, GM tools, AI, etc.

## Subscription Tiers
| Tier | Price | Status | Features |
|------|-------|--------|----------|
| Free | £0 | Active | View campaigns (read-only), Basic dice roller, Limited access |
| Player | TBD | Coming Soon | Create characters, Join campaigns, Full character sheets, Inventory management |
| Game Master | £3.99/mo | Active | Create campaigns, GM tools & AI, Combat tracker, World building |
| Legendary | £5.99/mo | Active | Full GM access, Player tier included*, Priority AI, Early access |

*Player benefits included when Player tier launches

## Recent Updates (March 2026)

### GM Side Improvements
- [x] **Campaign Settings Modal** - New "Settings" button in Campaign Dashboard header
  - Upload Custom Rulesets (PDFs, JSON)
  - Upload Custom Races & Classes
  - Upload Custom Items & Spells
  - Upload Custom Monsters & NPCs
- [x] **Color Scheme Fixed** - Replaced all green colors with gold/purple across GM tools
  - GM Screen Names tab: Gold accent colors
  - GM Screen Tables tab: Shop Name uses gold
  - GM Screen Party tab: Pink/purple colors
  - Random Tables: Gold "Save to Notes" button

### Previous Bug Fixes (Still Working)
- [x] Level Up Flow - Fixed API URL
- [x] Edit Character - Added missing route
- [x] HP Display - Clamps HP to maxHp
- [x] Combat tracker - Shows all 303 monsters
- [x] Monster Lookup - Uses local database

## Implemented Features

### Landing Page
- [x] Centered logo with "KEEPER" in large white text with glow
- [x] Foggy glass panels for readability
- [x] 4-tier pricing: Free, Player (Coming Soon), GM (£3.99), Legendary (£5.99)

### Home Dashboard
- [x] **Player Section**: LOCKED with "Coming Soon" overlay
- [x] **GM Section**: Fully functional with campaigns visible

### Campaign Dashboard
- [x] **Settings button** in header (purple) - Opens upload modal
- [x] **GM Screen button** (orange/red) - Opens GM tools
- [x] **ROOK assistant** panel on right side
- [x] **World Setting** with style selector (Fantasy, Sci-Fi, Dark Medieval, etc.)
- [x] Sidebar navigation: World, Maps, Gods, Locations, NPCs, Chronicle, Combat, GM Tools

### GM Screen
- [x] **12 tabs**: Combat, Location, NPCs, Dice, Monsters, Creatures, Names, Tables, Loot Gen, Inventory, Party, Notes
- [x] **Fantasy Sunset colors** throughout
- [x] **Gold accents** for GM-specific features
- [x] NPC Name Generator with save functionality
- [x] Random Tables (Tavern Name, Shop Name, NPC Quirk, Weather, Plot Hook, Mundane Loot)
- [x] Monster Lookup (303 SRD creatures)
- [x] Party Overview with stats

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
2. Enable character creation for Player/Legendary subscribers
3. Connect inventory system to character sheet
4. Enable real-time GM loot drops

### Upcoming Features
1. **Implement file uploads** - Connect Settings modal uploads to backend
2. **Real-time GM Loot System** - WebSocket drag-drop
3. **Map Creator Enhancements** - Textured tools, pan/zoom

### Future/Backlog
1. Soundboard with ambient noises
2. PDF export for character sheets
3. Live audio transcription
4. VTT with video/audio chat
5. Backend refactoring (split server.py)

## Technical Architecture
```
/app/frontend/src/components/
├── LandingPage.js        - 4-tier pricing, centered logo
├── UnifiedDashboard.js   - Player section locked, GM functional
├── CampaignDashboard.js  - Settings modal, GM Screen button, ROOK helper
├── GMScreen.js           - 12 tabs, gold accent colors
├── RandomTables.js       - Gold "Save to Notes" button
├── CharacterBuilder.js   - Edit mode support
├── CharacterSheetFull.js - Temp HP, inventory, proficient skills
├── CharacterInventory.js - Equipment slots, 3000+ items
└── LevelUpWizard.js      - Multiclassing support
```

## Test Credentials (Preview Only)
- Email: lcblakey24@outlook.com
- Password: LCBlakey24?!
