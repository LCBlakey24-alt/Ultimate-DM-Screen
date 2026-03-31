# Rookie Quest Keeper (ROOK) - Product Requirements Document

## Original Problem Statement
Build a TTRPG application called "Rookie Quest Keeper" (ROOK) for Players (character management) and Game Masters (campaign management, GM tools).

## Visual Theme: Cyber-Fantasy Dual Theme (Updated March 2026)

### Theme System
The app uses a **dual-theme system** with distinct color schemes:

#### Landing Page (Neutral Bridging Theme)
- **Background**: Dark (#080A1A) with purple and cyan gradient overlays
- **Accent Colors**: Purple (#8A2BE2) and Cyan (#4DD0E1) gradient

#### GM Mode - "Midnight Neon" (Purple/Violet)
- **Background**: Black (#0B0B0D) at top, fading to purple glow at bottom
- **Primary Accent**: Blue Violet (#8A2BE2)
- **Secondary Accent**: Indigo (#4B0082)
- **Usage**: Campaign Dashboard, GM Screen, Combat Page

#### Player Mode - "Electric Tundra" (Blue/Cyan)
- **Background**: Dark blue (#050A30) at top, fading to cyan glow at bottom
- **Primary Accent**: Cyan (#4DD0E1)
- **Secondary Accent**: Blue (#0066FF)
- **Usage**: Character Builder, Character Sheet

### Typography
- **Headings**: Outfit (sans-serif)
- **Body Text**: Manrope (sans-serif)
- **Logo Only**: Cinzel (serif) - ROOK branding only

### 3D Dice Roller
- **Background**: Dark blurred overlay (85% black with 20px blur)
- **GM Mode**: Purple glow at bottom, purple die borders
- **Player Mode**: Cyan glow at bottom, cyan die borders
- **Animation**: Spinning dice with smooth deceleration

## Current Access Model (March 2026)
- **Player Features**: NOW OPEN - Character creation, sheets, inventory
- **GM Features**: FULLY ACCESSIBLE - Create campaigns, GM tools, AI, etc.

## GM Screen Features (12 Tabs)
1. **Combat** - Combat control, encounters, quick combat
2. **Location** - Party location tracker
3. **NPCs** - Name generator + saved NPCs
4. **Monsters** - Creature lookup + custom creatures
5. **Tables** - Random encounter tables
6. **Loot** - Treasure generator
7. **Dice** - Dice roller
8. **Party** - Party inventory, loot distribution
9. **Notes** - Session notes
10. **Story Arcs** - Quest/plot tracking with milestones
11. **Soundboard** - Ambient audio with built-in + custom sounds
12. **Uploads** - Consolidated file uploads for all campaign assets

### Soundboard Features
- **Built-in sounds**: Tavern, Forest, Campfire, Ocean, Battle, Wind, Rain, Storm, Night, Dungeon, Temple, Tension
- **Custom uploads**: Upload your own audio files
- **Master volume control** with mute toggle
- **Individual volume sliders** per sound

### Story Arc Tracker
- **Priority levels**: Main Quest, Side Quest, Character Arc, Background
- **Status tracking**: Planning, Active, Paused, Completed, Abandoned
- **Plot points**: Add milestones with completion checkboxes

### Uploads Tab
- **5 upload categories**:
  - Campaign Maps (cyan)
  - Character Portraits (green)
  - Documents & PDFs (gold)
  - Audio & Music (pink)
  - Other Files (purple)

## Subscription Tiers
| Tier | Price | Status | Features |
|------|-------|--------|----------|
| Free | £0 | Active | View campaigns (read-only), Basic dice roller |
| Player | TBD | Coming Soon | Create characters, Join campaigns, Full character sheets |
| Game Master | £3.99/mo | Active | Create campaigns, GM tools & AI, Combat tracker |
| Legendary | £5.99/mo | Active | Full GM access, Player tier included*, Priority AI |

## Recent Updates (March 31, 2026)

### Visual Overhaul
- **GM Screen Background**: Black at top → purple glow at bottom
- **Character Sheet Background**: Dark blue at top → cyan glow at bottom
- **3D Dice Roller**: Dark blurred overlay (85% black) with subtle theme-colored glow
- **Color Consistency**: Removed old pink/gold, replaced with purple (GM) and cyan (Player)
- **Live Session Mode**: Merged into GM Screen (removed floating panel)

### Player Section Unlocked
- "Coming Soon" overlay removed from Player section
- Character creation now accessible
- Character sheets now accessible

## Test Results
- **Latest test run**: 26 tests passed, 1 skipped (removed feature)
- **Test file**: `/app/test_reports/iteration_58.json`

## Upcoming Tasks (Priority Order)

### P0 - Critical
1. **Finalize Equipment & Inventory System** - Equip/unequip with stat modifications

### P1 - High Priority
2. **NPC Relationship Mapping** - Visual connections between NPCs
3. **Context-Aware AI Co-GM** - AI suggestions based on current tab
4. **Map Creator Enhancements** - Pins, routes, fog of war
5. **Combat Flow Improvements** - Status effect library, AI tactical suggestions

### P2 - Medium Priority
6. **Economy System** - City wealth, trade routes
7. **Event System** - Festivals, tournaments, markets
8. **Mini-Game Engine** - Horse racing, gambling, card games
9. **Session Replay Generator** - Narrative recaps
10. **Player Sync** - Real-time shared views

### Future Tasks
- PDF export/print for character sheets
- Live audio transcription ("ROOK listener")
- Virtual Tabletop (VTT) functionality
- AI-powered travel encounter generator

## Known Issues
- **Production Login/Password Reset Broken** - External environment configuration issue

## Test Credentials
- Email: lcblakey24@outlook.com
- Password: LCBlakey24?!

---
*Last Updated: March 31, 2026*
