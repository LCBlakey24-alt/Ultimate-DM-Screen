# DM Screen - Product Requirements Document

## Overview
A comprehensive web application for Dungeons & Dragons (D&D) Dungeon Masters (DMs), serving as an all-in-one "DM Screen" for campaign management and live gameplay.

## Target Users
- D&D Dungeon Masters
- TTRPG Game Masters (multiple systems supported)

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
- [x] **Players** - Player character tracking with stats
- [x] **Combat Creator** - Pre-plan combat encounters
- [x] **Calendar** - In-game date tracking with events
- [x] **In-Game Notes** - Session notes with AI auto-categorization

### DM Screen (Live Gameplay)
- [x] Current date display
- [x] Upcoming events reminder
- [x] Players quick reference
- [x] NPCs quick reference
- [x] AI Quick Notes with auto-filing
- [x] Rules Reference (searchable, editable)

### AI Features
- [x] Content generation for encounters, traps, NPCs, world-building
- [x] Note processing and auto-categorization
- [x] System-aware content (tailored to selected TTRPG)

### Calendar System
- [x] Multiple preset calendars (Gregorian, Forgotten Realms)
- [x] Advance time functionality
- [x] Event creation and management
- [x] Upcoming events sidebar

## Technical Stack
- **Frontend**: React.js, TailwindCSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT
- **AI**: Emergent LLM Key integration

## Design System (Updated Dec 2024)
- **Background**: Dark blue (#0a1628 to #0d1d33 gradient)
- **Primary Color**: Light blue (#38bdf8)
- **Accent Color**: Hot pink (#ff1f8f)
- **Text**: Light (#e0f2fe), Muted (#7dd3fc)
- **Borders**: Navy blue (#1e3a5f)

## What's Been Implemented
- [x] User authentication (register/login)
- [x] Campaign CRUD operations
- [x] All 8 dashboard tabs with AI integration
- [x] DM Screen with rules reference
- [x] Calendar with events
- [x] Responsive design
- [x] New color scheme (dark blue/light blue/hot pink)

## Upcoming Tasks (P1-P2)
- [ ] **Combat Tracker in DM Screen** - Live initiative tracker for gameplay
- [ ] **Map & Token System** - Upload maps and place tokens
- [ ] **Enhanced DM Screen** - Quick-access panels for Players, NPCs, Notes

## Future/Backlog Tasks (P3+)
- [ ] Monetization (Stripe integration)
- [ ] Enhanced Players tab (stats on hover)
- [ ] Backend refactoring (split server.py into routers)
- [ ] Custom calendar builder UI improvements

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
- `/api/ai/generate`

## Database Schema
- **users**: {username, hashed_password}
- **campaigns**: {name, system, user_id, created_at}
- **campaign_settings**: {campaign_id, content, dm_rules}
- **gods, npcs, locations, players**: Campaign-linked entities
- **calendars**: {campaign_id, type, current_day/month/year, custom_months}
- **calendar_events**: {campaign_id, name, day, month, year, is_recurring}
- **combat_scenarios**: {campaign_id, name, combatants}
- **ingame_notes**: {campaign_id, content, ai_processed}

## Test Coverage
- Backend: 100% (35/35 tests)
- Frontend: All flows verified
