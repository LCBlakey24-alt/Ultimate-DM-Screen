# D&D DM Screen Companion - Product Requirements Document

## Overview
A comprehensive web application for Dungeons & Dragons Dungeon Masters, serving as a digital "DM Screen" for managing campaigns, combat, and world-building.

## User Persona
**Primary User**: Dungeon Masters (DMs) running D&D 5e campaigns who need quick access to game information, combat management, and world-building tools during sessions.

## Core Requirements

### Authentication & Subscription
- [x] Username/password registration and login
- [x] JWT-based session management
- [x] Protected routes for authenticated content
- [x] **Freemium subscription model** ($3.99/month Adventurer tier)
- [x] **Promo code system** for free premium access
- [x] Subscription status tracking per user

### Campaign Management
- [x] Create and manage multiple campaigns
- [x] Campaign Dashboard with tabbed interface
- [x] Campaign Setting tab with **Unseen Servant** AI
- [x] Gods pantheon management with **Unseen Servant** auto-save
- [x] NPC creation with **Unseen Servant** auto-save
- [x] **Locations with Places of Interest** (shops, taverns, temples, etc.) with **Unseen Servant**
- [x] Player character management with stat generation
- [x] In-game notes with AI categorization
- [x] **Free tier**: Limited to 2 campaigns
- [x] **Premium tier**: Unlimited campaigns

### **Unseen Servant** - AI Auto-Save Feature
- [x] Renamed from "AI Assistant" to "Unseen Servant" (D&D thematic)
- [x] Auto-generates and saves content directly to database
- [x] Supports: Gods, NPCs, Locations, Places of Interest
- [x] Shows "Just Created" indicator on newly generated items
- [x] Green glow animation on newly created cards
- [x] Click edit button to modify generated content
- [x] **Free tier**: 5 AI generations per month
- [x] **Premium tier**: Unlimited AI generations

### World Builder (NEW)
- [x] **Hierarchical world structure**: Continents → Countries/Regions → Cities/Towns → Places of Interest
- [x] Continent types: Continent, Island/Archipelago, Plane of Existence
- [x] Region types: Kingdom, Empire, Republic, Territory, Wilderness
- [x] Settlement types: Capital, City, Town, Village, Outpost, Ruins, Landmark
- [x] Place types: Shop, Tavern, Temple, Blacksmith, Guild, Library, Residence, Dungeon
- [x] Expandable/collapsible tree view
- [x] AI "Unseen Servant" integration for generating world elements
- [x] Full CRUD operations for all hierarchy levels

### Monetization System
- [x] **Pricing Page** with plan comparison
- [x] **Free Tier**: 2 campaigns, 5 AI generations/month
- [x] **Adventurer Tier** ($3.99/month): Unlimited everything
- [x] Stripe checkout integration
- [x] Promo code input and validation
- [x] Premium badge in UI header
- [x] Feature gating for AI limits

### Combat System
- [x] Combat Creator for preparing encounters
- [x] Monster Database with 2687+ creatures from D&D lore
- [x] Initiative tracker with correct +/- modifiers
- [x] Combat Page with two-column layout (tracker left, map right)
- [x] Enemy loot assignment and collection
- [x] AI Encounter Generator

### DM Screen (Live Session)
- [x] Tabbed interface (Combat, Dice, Loot Gen, Inventory, Party, Notes)
- [x] Dice roller with all standard D&D dice
- [x] AI Loot Generator
- [x] Party Inventory with drag-and-drop item assignment
- [x] Party overview with player stats and **correct initiative modifiers** (+X or -X)
- [x] Session notes with AI recap generator

### Reference System
- [x] **Items Database with 3,076 items** (weapons, armor, magic items, etc.)
- [x] Search and filter by type, rarity, magic items
- [x] **Rules Reference** with:
  - [x] Difficulty Classes (DC 5-30)
  - [x] XP Thresholds per level (Easy/Medium/Hard/Deadly)
  - [x] Conditions Reference (15 conditions)
  - [x] Cover Rules

### Custom Content Creation
- [x] Item Creator for custom magic items
- [x] World Calendar system

### UI/UX
- [x] "Rookie Quest" branded aesthetic
- [x] **Enlarged logos on login page** (both sides + above form)
- [x] Dark fantasy theme with glow effects
- [x] Responsive design
- [x] Consistent tabbed navigation
- [x] **Premium badge** in campaign list header

## Technical Stack
- **Frontend**: React.js, TailwindCSS, react-beautiful-dnd
- **Backend**: FastAPI (Python), Motor (async MongoDB)
- **Database**: MongoDB
- **AI**: Emergent LLM for content generation (via Unseen Servant)
- **Authentication**: JWT
- **Payments**: Stripe (via emergentintegrations)

## Key API Endpoints

### Subscription System (NEW)
- `GET /api/subscription/plans` - Get available subscription plans
- `GET /api/subscription/status` - Get current user's subscription status
- `POST /api/subscription/checkout` - Create Stripe checkout session
- `GET /api/subscription/checkout/status/{session_id}` - Check payment status
- `POST /api/promo-codes` - Create promo code
- `POST /api/promo-codes/apply` - Apply promo code for free premium
- `POST /api/webhook/stripe` - Handle Stripe webhooks

### Unseen Servant
- `POST /api/unseen-servant/generate` - Auto-generate and save entities
  - entity_type: 'god', 'npc', 'location', 'place_of_interest'
  - Returns: entity_id, entity_name, success status
  - **Now checks AI usage limits for free tier users**

### Places of Interest
- `POST /api/campaigns/{id}/locations/{loc_id}/places` - Add place
- `GET /api/campaigns/{id}/locations/{loc_id}/places` - List places
- `PUT /api/campaigns/{id}/locations/{loc_id}/places/{place_id}` - Update place
- `DELETE /api/campaigns/{id}/locations/{loc_id}/places/{place_id}` - Delete place

## Test Status
- **Backend**: 91/91 tests passing (100%)
- **Frontend**: 77/77 E2E tests passing (100%)
- **New Test Files**: subscription-pricing.spec.ts, test_subscription.py

## Upcoming Tasks (Priority Order)
1. **P1: Player Builder Quality Improvements** - Enhance player creator with spells, class/race actions
2. **P2: Enhanced Map & Token System** - Fog of war, AoE templates, distance tools
3. **P3: Merge Combat/Encounter Gen Tabs** - Needs careful refactoring
4. **P4: World Calendar System** - Full customization
5. **P5: Editable Rules Reference** - User-editable content

---
Last Updated: March 1, 2026
