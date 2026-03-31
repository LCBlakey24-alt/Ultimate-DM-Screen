# Rookie Quest Keeper (ROOK) - Product Requirements Document

## Original Problem Statement
Build a TTRPG application called "Rookie Quest Keeper" (ROOK) for Players (character management) and Game Masters (campaign management, GM tools).

## Visual Theme: Cyber-Fantasy Dual Theme

### Theme System
The app uses a **dual-theme system** with distinct color schemes:

#### GM Mode - "Midnight Neon" (Purple/Violet)
- **Background**: Black (#0B0B0D) → purple glow at bottom
- **Primary Accent**: Blue Violet (#8A2BE2)
- **Secondary Accent**: Indigo (#4B0082)
- **Gradient**: `linear-gradient(135deg, #4B0082, #8A2BE2)`
- **Usage**: Campaign Dashboard, GM Screen, Combat Page, Maps, all GM tools

#### Player Mode - "Electric Tundra" (Blue/Cyan)
- **Background**: Dark blue (#050A30) → cyan glow at bottom
- **Primary Accent**: Cyan (#4DD0E1)
- **Secondary Accent**: Blue (#0066FF)
- **Usage**: Character Builder, Character Sheet, Player dashboard

### Typography
- **Headings**: Outfit (sans-serif)
- **Body Text**: Manrope (sans-serif)
- **Logo Only**: Cinzel (serif) - ROOK branding only

### 3D Dice Roller
- **Background**: Dark blurred overlay (85% black with 20px blur)
- **GM Mode**: Purple glow at bottom, purple die borders
- **Player Mode**: Cyan glow at bottom, cyan die borders
- **Critical**: Green edge glow for Nat 20, Red edge glow for Nat 1

## GM Screen Features (12 Tabs - Live Play Only)
1. **Combat** - Combat control, encounters, quick combat
2. **Location** - Party location tracker
3. **NPCs** - Name generator + saved NPCs
4. **NPC Network** - Visual relationship map with full stat blocks, AI generation
5. **Monsters** - Creature lookup + custom creatures
6. **Tables** - Random encounter tables
7. **Loot** - Treasure generator
8. **Dice** - Dice roller
9. **Party** - Party inventory, loot distribution
10. **Notes** - Session notes
11. **Story Arcs** - Quest/plot tracking with milestones
12. **Soundboard** - Ambient audio with built-in + custom sounds

**Note**: Uploads tab was REMOVED from GM Screen. GM Screen is strictly for live play viewing. All uploads happen on the Campaign Dashboard.

### NPC Network Features (March 31, 2026)
- Visual graph with draggable NPC nodes on zoomable/pannable canvas
- Full stat blocks: 6 ability scores, HP, AC, Speed, Prof Bonus
- Class-appropriate stats: saving throws, skills, attacks, abilities, spells
- AI generation (GPT-4o): race, class, level, role parameters
- Editable NPCs: 6-section edit modal (Basic, Stats, Combat, Abilities, Spells, Roleplay)
- Relationship mapping: 8 relationship types (Ally, Enemy, Family, Business, Political, Romantic, Rival, Unknown)

### World Map System (March 31, 2026 - Enhanced)
- **Upload Map**: Upload world map images with scale configuration
- **Pin Types**: Capital, City, Town, Village, Landmark, Dungeon, Port, Forest, Custom
- **Draggable Pins**: Click and drag to reposition any pin
- **Instant Pin Placement**: Pins appear immediately without page refresh
- **Mode Toolbar**: View, Add Pin, Move Pin, Line Path, Draw Path, Travel
- **Grid Overlay**: Square, Hexagon, and Diamond grid styles (1 cell = 1 day travel)
- **Custom Drawable Paths**: Freehand drawing between pins for realistic routes (around mountains, rivers, etc.)
- **Line Paths**: Straight-line paths with distance, terrain type, and terrain modifier
- **Travel Calculator**: Calculate travel time based on mode (On Foot, Horseback, Cart, Ship, Flying)
- **Travel Animation**: Animated marker moving along path with day counter
- **Terrain Types**: Road (1x), Trail (1.25x), Wilderness (1.5x), Dense Forest (2x), Mountain Pass (2.5x), Swamp (3x), Desert (1.5x), Water by boat (0.75x)

## Theme Consistency Rules
- **GM pages**: ALL tabs, buttons, borders, accents use dark purple to purple blend
- **Player pages**: ALL tabs, buttons, borders, accents use dark blue to cyan blend
- **NO yellow/gold (#F59E0B) on GM pages** (except warnings/status indicators)
- **NO red (#E11D48) as primary color on any tab** — replaced with purple
- **NO pink (#ff1f8f) on any tab** — replaced with purple

## Subscription Tiers
| Tier | Price | Features |
|------|-------|----------|
| Free | £0 | View campaigns (read-only), Basic dice roller |
| Player | TBD | Create characters, Join campaigns |
| Game Master | £3.99/mo | Create campaigns, GM tools & AI |
| Legendary | £5.99/mo | Full GM + Player, Priority AI |

## Recent Updates

### Map System Overhaul + Theme Cleanup (March 31, 2026 - Latest)
- Rewrote WorldMapTab with draggable pins, grid overlay (square/hex/diamond), drawable paths, travel animation
- Fixed homepage yellow glow → dark purple on GM side
- Updated ALL tabs to use Midnight Neon purple (not red/gold/pink)
- Removed Uploads tab from GM Screen (live play only — no uploads)
- Fixed theme colors in: UnifiedDashboard, CampaignDashboard, CampaignSettingTab, CalendarTab, LocalMapTab, MapsConsolidatedTab, PartyLocationTracker, ChronicleConsolidatedTab, CombatConsolidatedTab, InventoryConsolidatedTab, NPCsConsolidatedTab, ToolsConsolidatedTab, QuickReferenceTab, PlayersTab, RookGuide, PartyInventory

### NPC Network & Full Stat Blocks (March 31, 2026)
- NPC relationship map with visual graph interface
- Expanded NPC model: 6 ability scores, saving throws, skills, attacks, abilities, spells
- AI-powered NPC generation (GPT-4o) with class-appropriate stats

### Previous Completions
- Copyright cleanup (SRD-safe only)
- Dual-theme system implementation
- Player Dashboard unlocked
- 3D Dice Roller with edge glow effects
- Soundboard, Story Arcs, consolidated uploads

## Upcoming Tasks (Priority Order)

### P0 - Critical
1. **Finalize Equipment & Inventory System** - Equip/unequip with stat modifications (AC, attack bonuses)

### P0 - High Priority
2. **Context-Aware AI Co-GM** - AI suggestions based on current GM Screen tab
3. **Combat Flow Improvements** - Status effect library, initiative tracker, AI tactical suggestions

### P1 - High Priority
4. **Smart Session Log** - Auto-tagging, AI recaps
5. **Advanced Map Enhancements** - Interactive pins with more data, fog of war, multi-layer controls

### P2 - Medium Priority
6. **Economy System** - City wealth, trade routes, dynamic world engine
7. **Event System** - Festivals, tournaments, markets
8. **Mini-Game Engine** - Horse racing, gambling, card games
9. **Session Replay Generator** - Narrative recaps
10. **Player Sync** - Real-time shared views

### Refactoring
- `backend/server.py` is 9600+ lines — needs breaking into domain-specific routers

## Known Issues
- **Production Login/Password Reset Broken** - External environment configuration issue (BLOCKED)

## Test Results
- iteration_60: Frontend 100% pass (theme + map features)
- iteration_59: Backend 7/7 + Frontend 100% (NPC Network)
- iteration_58: 26 tests passed (UI overhauls)

## Test Credentials
- Email: lcblakey24@outlook.com
- Password: LCBlakey24?!

---
*Last Updated: March 31, 2026*
