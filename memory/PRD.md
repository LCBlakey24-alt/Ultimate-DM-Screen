# Rookie Quest - TTRPG Companion
## Product Requirements Document

## Overview
A comprehensive web application for tabletop role-playing game (TTRPG) Dungeon Masters (DMs), serving as an all-in-one "DM Screen" for campaign management and live gameplay.

## Core Features

### Campaign Dashboard (Unified Tab Design)
All tabs use consistent horizontal tab bar matching DM Screen:
- **Setting** - Campaign world and lore
- **Gods** - Deity management with AI
- **NPCs** - Character tracking with AI
- **Locations** - Place management with AI
- **Players** - D&D Beyond-style character creator
- **Combat** - Combat Creator with enemy loot
- **Encounter Gen** - AI Random Encounter Generator (NEW)
- **Calendar** - Custom calendar system
- **Notes** - Session notes with AI

### DM Screen (Tabbed Interface)
- **Combat Tab** - Launch encounters
- **Dice Tab** - Animated dice roller
- **Loot Gen Tab** - AI treasure generation
- **Inventory Tab** - Party inventory with drag-drop
- **Party Tab** - Full character stat cards
- **Notes Tab** - Quick session notes

### Random Encounter Generator (NEW)
AI-powered balanced combat encounters:
- **Party Configuration**: Auto-detects players, adjustable size/level
- **Difficulty**: Easy, Medium, Hard, Deadly
- **Encounter Types**: Combat, Ambush, Boss Fight, Horde
- **Environments**: 12 options (Forest, Cave, Dungeon, etc.)
- **Custom Prompts**: Add specific requirements
- **Generated Output**:
  - Encounter name and narrative description
  - Enemies with CR, AC, HP, special abilities
  - Enemy loot (auto-included)
  - Combat tactics
  - Terrain features
  - XP estimation
- **Save to Combat**: One-click add to Combat Creator

### Combat System
- **Combat Creator**: Add enemies with loot items
- **Combat Page**: Two-column (initiative | map)
- **Loot Collection**: "Collect Loot" button on defeated enemies
- **Inventory Transfer**: Add collected loot to party inventory

### Party Inventory
- Currency tracking (PP, GP, EP, SP, CP)
- Drag-and-drop item assignment to players
- Item types, values, magical properties

## Technical Stack
- **Frontend**: React.js, TailwindCSS, Shadcn/UI
- **Backend**: FastAPI (Python), MongoDB
- **AI**: Emergent LLM Key integration

## API Endpoints
- `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- `/api/campaigns` (CRUD)
- `/api/campaigns/{id}/players` (CRUD)
- `/api/campaigns/{id}/npcs` (CRUD)
- `/api/campaigns/{id}/locations` (CRUD)
- `/api/campaigns/{id}/gods` (CRUD)
- `/api/campaigns/{id}/combat-scenarios` (CRUD)
- `/api/campaigns/{id}/inventory` (CRUD)
- `/api/campaigns/{id}/currency` (GET/PUT)
- `/api/campaigns/{id}/calendar` (GET/PUT)
- `/api/campaigns/{id}/calendar-events` (CRUD)
- `/api/campaigns/{id}/ingame-notes` (CRUD)
- `/api/ai/generate`

## Completed Features
- [x] User authentication (JWT)
- [x] Campaign CRUD
- [x] All campaign dashboard tabs
- [x] DM Screen with 6 tabs
- [x] Dedicated Combat Page (initiative left, map right)
- [x] Party Inventory with drag-drop
- [x] Combat loot system (enemy loot → collection → inventory)
- [x] Random Encounter Generator with AI
- [x] Unified tab design across all pages

## Future/Backlog
- [ ] Enhanced Map (fog of war, AoE templates)
- [ ] Monetization (Stripe)
- [ ] Mobile optimization
- [ ] Export/Import campaigns
- [ ] Backend refactoring

## Test Credentials
- Create via registration form
- Example: `testdm1` / `testpass123`

---
Last Updated: February 28, 2026
