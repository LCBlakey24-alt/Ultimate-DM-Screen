# Rookie Quest - TTRPG Companion
## Product Requirements Document

## Overview
A comprehensive web application for tabletop role-playing game (TTRPG) Dungeon Masters (DMs), serving as an all-in-one "DM Screen" for campaign management and live gameplay. Originally called "DM Screen," rebranded to "Rookie Quest / TTRPG Companion" with a complete UI redesign in February 2026.

## Target Users
- D&D Dungeon Masters
- TTRPG Game Masters (multiple systems supported)
- New and experienced DMs

## Branding
- **Primary Logo**: Rookie Quest (stylized white text)
- **Secondary Logo**: TTRPG Companion (blue/white badge)
- **Tagline**: Your ultimate TTRPG companion

## Core Requirements

### Authentication
- [x] User registration with username/password
- [x] User login with JWT tokens
- [x] Session persistence

### Campaign Management
- [x] Create/Delete campaigns
- [x] TTRPG system selector (D&D 5e 2024, Pathfinder 2e, Call of Cthulhu 7e, etc.)
- [x] Campaign listing with cards

### Campaign Dashboard (Tabbed Interface)
- [x] **Campaign Setting** - World lore and campaign description
- [x] **Gods** - Deity management with AI generation
- [x] **NPCs** - Non-player character tracking with AI generation
- [x] **Locations** - Place management with AI generation
- [x] **Players** - Player character tracking with D&D Beyond-style character creator
  - Level selection (1-20) in Step 1
  - Four stat determination methods: Standard Array, Suggested for Class, Roll Stats (4d6 drop lowest), Custom
- [x] **Combat Creator** - Pre-plan combat encounters with map uploads
- [x] **Calendar** - In-game date tracking with events + custom calendar builder
- [x] **In-Game Notes** - Session notes with AI auto-categorization

### DM Screen (Live Gameplay Hub)
- [x] Current date display
- [x] **Combat Launcher** - Select encounters and launch dedicated Combat Page
- [x] **Quick Start** - Start combat with just players
- [x] Party Overview quick reference
- [x] **Dice Roller** - Animated dice roller with D4-D100, modifiers, roll history
- [x] **Loot Generator** - Generate treasure based on CR tier
- [x] **Party Inventory** - Shared inventory system with currency tracking
- [x] **Session Notes** - Quick notes during gameplay
- [x] **Quick Reference** - Modal for conditions, actions, damage types

### Dedicated Combat Page (NEW)
- [x] Two-column layout: Initiative tracker (left) | Battle Map (right)
- [x] Auto-roll initiative for all combatants
- [x] Turn management with Next Turn button
- [x] HP tracking with +/- buttons (-10, -5, -1, +1, +5, +10)
- [x] AC display on each combatant card
- [x] Condition toggles (Blinded, Charmed, Frightened, etc.)
- [x] Death save tracking with roll button
- [x] Round counter
- [x] End Combat button returns to DM Screen
- [x] Map canvas with grid overlay
- [x] Token rendering with HP bars
- [x] Current turn highlighting

### Party Inventory System (NEW)
- [x] Party Treasury - Track PP, GP, EP, SP, CP with +/- buttons
- [x] Item management - Add, edit, delete items
- [x] Item types: Weapon, Armor, Potion, Scroll, Magic Item, Misc
- [x] Item properties: Quantity, value, weight, magical, attunement
- [x] Search and filter functionality
- [x] Total weight calculation

### AI Features
- [x] Content generation for encounters, traps, NPCs, world-building
- [x] Note processing and auto-categorization
- [x] System-aware content (tailored to selected TTRPG)

### Calendar System
- [x] Multiple preset calendars (Gregorian, Forgotten Realms)
- [x] Custom calendar builder UI
- [x] Advance time functionality
- [x] Event creation and management
- [x] Upcoming events sidebar

## Technical Stack
- **Frontend**: React.js, TailwindCSS, Shadcn/UI
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT
- **AI**: Emergent LLM Key integration

## Design System (February 2026 Redesign)

### Color Palette
- **Background Primary**: #030014 (deep navy black)
- **Background Secondary**: #0a0a2e (dark navy)
- **Panel Background**: rgba(10, 10, 60, 0.7)
- **Glow Blue**: #4a7dff (borders, highlights)
- **Button Green**: #22c55e (primary actions)
- **Button Red**: #ef4444 (secondary/destructive actions)
- **Text Primary**: #ffffff
- **Text Muted**: #94a3b8
- **Text Cyan**: #67e8f9 (accents)
- **Border Blue**: #1e40af

### Typography
- **Primary Font**: Montserrat (headings, buttons)
- **Secondary Font**: Inter (body text)
- **Font Weights**: 400-800

### Components
- Pill-shaped buttons (border-radius: 50px)
- Glowing panel borders with box-shadow effects
- Stat blocks with blue borders
- HP bars with green gradient fill
- System badges with cyan styling

## What's Been Implemented (February 2026)

### Complete UI Redesign
- [x] New color scheme (dark navy/blue glow/green-red buttons)
- [x] Rookie Quest and TTRPG Companion branding
- [x] Pill-shaped buttons throughout
- [x] Glowing panel effects
- [x] Montserrat font integration
- [x] Responsive design maintained

### Features
- [x] User authentication (register/login)
- [x] Campaign CRUD operations
- [x] All 8 dashboard tabs with AI integration
- [x] DM Screen with combat launcher
- [x] Dedicated Combat Page (initiative left, map right)
- [x] Party Inventory with currency tracking
- [x] Calendar with events
- [x] Custom calendar builder UI
- [x] D&D Beyond-style character creator
- [x] Session notes in DM Screen

## Testing Status
- Backend: 100% (35/35 tests passed)
- Frontend: 89% (8/9 combat flow tests passed)
- Test specs: /app/tests/e2e/

## Upcoming Tasks (P2)
- [ ] **AI NPC/Location Generator** - Quick generation tool in dashboard

## Future/Backlog Tasks (P3+)
- [ ] Enhanced Map features (fog of war, AoE templates, distance measurement)
- [ ] Monetization (Stripe integration)
- [ ] Enhanced Players tab (stats on hover)
- [ ] Backend refactoring (split server.py into routers)
- [ ] Database normalization (separate collections)
- [ ] Mobile-optimized views
- [ ] Export/Import campaign data

## API Endpoints
- `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- `/api/campaigns` (CRUD)
- `/api/campaigns/{id}/setting`
- `/api/campaigns/{id}/gods` (CRUD)
- `/api/campaigns/{id}/npcs` (CRUD)
- `/api/campaigns/{id}/locations` (CRUD)
- `/api/campaigns/{id}/players` (CRUD)
- `/api/campaigns/{id}/calendar` (GET/PUT)
- `/api/campaigns/{id}/calendar/advance`
- `/api/campaigns/{id}/calendar-events` (CRUD)
- `/api/campaigns/{id}/combat-scenarios` (CRUD)
- `/api/campaigns/{id}/ingame-notes` (CRUD)
- `/api/campaigns/{id}/inventory` (CRUD) - NEW
- `/api/campaigns/{id}/currency` (GET/PUT) - NEW
- `/api/ai/generate`

## Database Schema
- **users**: {username, hashed_password}
- **campaigns**: {name, system, user_id, created_at}
- **campaign_settings**: {campaign_id, content, dm_rules}
- **gods, npcs, locations, players**: Campaign-linked entities
- **calendars**: {campaign_id, type, current_day/month/year, custom_months}
- **calendar_events**: {campaign_id, name, day, month, year, is_recurring}
- **combat_scenarios**: {campaign_id, name, combatants, map_url, tokens}
- **ingame_notes**: {campaign_id, content, ai_processed}
- **inventory**: {campaign_id, name, quantity, item_type, description, value, weight, is_magical, attunement_required} - NEW
- **party_currency**: {campaign_id, copper, silver, electrum, gold, platinum} - NEW

## Test Credentials
- Users can be created via the registration form
- Example: username: `testdm1`, password: `testpass123`

---
Last Updated: February 28, 2026
