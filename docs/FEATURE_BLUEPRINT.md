# Rookie Quest Keeper Feature Blueprint

## Purpose

This file defines the major feature areas Rookie Quest Keeper should support. It exists so future AI assistants, developers, and design work can understand the intended product direction before adding or changing features.

For visual styling rules, read `docs/DESIGN_SYSTEM.md` first.

---

# 1. Product Overview

Rookie Quest Keeper is a TTRPG companion site for:

- Game Masters
- Players
- Worldbuilders
- Homebrew creators
- Campaign organizers

It should combine:

- character management
- campaign management
- live GM tools
- combat tracking
- notes and lore organization
- map/location support
- homebrew creation
- AI-assisted preparation
- session recap generation
- player handouts and campaign sharing

The app should reduce table friction and help campaigns feel easier to run.

---

# 2. User Roles

## 2.1 Game Master

The GM needs tools for:

- campaigns
- worldbuilding
- live play
- combat
- NPCs
- notes
- locations
- maps
- player management
- encounters
- handouts
- loot
- recaps
- AI prep support

## 2.2 Player

The player needs tools for:

- character creation
- character sheet management
- HP / spell / condition tracking
- inventory
- notes
- campaign-linked content
- handouts
- live combat participation

## 2.3 Admin / Owner

The admin needs tools for:

- user management
- account support
- template management
- exports
- impersonation/support workflows
- moderation or cleanup where needed

---

# 3. Dashboard

## Purpose

The dashboard is the user's main hub.

It should answer:

- What characters do I have?
- What campaigns do I have?
- What was I doing last?
- What can I quickly create or continue?

## Core Features

- Character list
- Campaign list
- Search characters
- Search campaigns
- Sort characters
- Sort campaigns
- Create character
- Create campaign
- Enter Homebrew Workshop
- Quick links to recent activity
- Quick access to Rook AI helper
- Rules edition badges
- Recent session/notes summary in future

## Design Notes

The dashboard should feel like a command centre, not a feed. Use modular cards, clear headers, and practical quick actions.

---

# 4. Character Builder

## Purpose

A step-by-step character creation and editing workflow.

## Modes

- Full Builder
- Basic Builder
- Premade Builder
- Kids Builder

## Full Builder Features

- Character name
- Rules edition / ruleset
- Race / ancestry / species
- Subrace where applicable
- Class
- Subclass where available
- Background
- Alignment
- Ability scores
- Skill choices
- Saving throw proficiencies
- Languages
- Equipment
- Spells
- Cantrips
- Feats
- Personality fields
- Backstory
- Portrait upload/generation where enabled
- Review step
- Save/create character

## Ability Score Methods

The builder should support:

- Standard array
- Point buy
- Roll 4d6 drop lowest
- Custom/manual entry for physical dice

## Builder UX Rules

- Must not lose progress between steps.
- Must show a clear progress indicator.
- Must show selected choices clearly.
- Must block impossible choices where the app knows the rules.
- Must explain why options are unavailable.
- Must stay mobile-friendly.
- Must avoid copying protected rulebook text.

---

# 5. Character Sheet

## Purpose

The character sheet is the player's live play page.

## Core Features

- Character identity
- Portrait
- Class/race/level summary
- HP
- Temp HP
- AC
- Initiative
- Speed
- Proficiency bonus
- Ability scores
- Saving throws
- Skills
- Passive scores
- Conditions
- Exhaustion
- Inspiration
- Death saves
- Hit dice
- Short rest
- Long rest
- Attacks
- Spell slots
- Spells known/prepared
- Inventory
- Currency
- Notes
- Backstory/personality
- Level-up access

## Mobile Priorities

On mobile, the following should be immediately easy to reach:

1. HP / temp HP
2. AC / initiative / speed
3. conditions
4. attacks
5. spells
6. notes
7. inventory

## Save Reliability

Live sheet changes should save quickly and consistently. HP, conditions, spell slots, notes, and inventory should not silently fail.

---

# 6. GM Screen

## Purpose

The GM screen is the live session workspace.

## Core Features

- Campaign overview
- Player status
- Initiative tracker
- Combat tools
- NPC quick reference
- Location quick reference
- Notes
- Session notes
- Event tools
- Dice roller
- Rules/reference search
- Encounter management
- Map access
- Soundboard/ambience
- Handouts
- Rook AI helper

## UX Direction

The GM screen should feel like a tactical control panel. It can be information-dense, but it must stay organized.

---

# 7. Campaign Manager

## Purpose

The campaign manager stores everything about a campaign outside live play.

## Core Features

- Campaign details
- System/rules edition
- World setting notes
- Player list
- Characters linked to campaign
- Session notes
- Session recaps
- Locations
- NPCs
- Factions
- Gods
- Timeline
- Events
- Maps
- Uploads
- Handouts
- Loot
- City funds / economy tools in future

## Campaign Structure

Campaign content should be organized by category, not stored as one giant note.

Useful categories:

- Overview
- Players
- Notes
- Locations
- NPCs
- Factions
- Timeline
- Maps
- Events
- Handouts
- Inventory/Loot
- AI/Rook

---

# 8. Combat Tools

## Purpose

Support fast live combat.

## Core Features

- Create encounter
- Add player characters
- Add monsters/NPCs
- Roll initiative
- Reorder initiative
- Track turn/round
- HP tracking
- Temp HP tracking
- Conditions
- Concentration reminders
- Hide/show monster HP
- Combat log
- Session recap from combat log
- End combat and persist relevant player HP/conditions

## Future Features

- Token support
- Battle map link
- Player synced combat view
- Condition automation
- Encounter difficulty helper
- Monster image support

---

# 9. Maps and Location Tools

## Purpose

Help GMs manage campaign geography and travel.

## Core Features

- Upload world map
- Drop location pins
- Link pins to saved locations
- Measure distance between locations
- Local maps
- Battle maps in future
- Travel overlays
- Route planning
- Teleportation circle support

## Future Travel Grid Overlay

The travel overlay should allow the GM to:

- calibrate two map points to a known distance or travel time
- draw a route
- count route distance
- estimate travel days
- mark difficult terrain
- add roads
- add sea routes
- add teleport routes

---

# 10. NPC and Relationship Tools

## Purpose

Help GMs manage important characters in the world.

## Core Features

- NPC name
- Role/job
- Location
- Description
- Personality
- Relationship to party
- Relationship to other NPCs
- Secrets
- Notes
- Image/portrait support in future

## Future Features

- Relationship web
- Faction links
- Session appearance log
- AI-generated dialogue prompts

---

# 11. Notes and Worldbuilding

## Purpose

Provide a structured campaign knowledge base.

## Core Features

- Campaign notes
- Session notes
- Location notes
- NPC notes
- Timeline entries
- Lore entries
- Faction records
- Plot threads
- Mysteries
- GM-only notes

## Rules

- Notes should be searchable.
- Notes should be linkable where possible.
- GM-only content must stay private.
- AI should use notes as context but not overwrite them automatically.

---

# 12. Homebrew Workshop

## Purpose

Create and manage custom game content.

## Content Types

- Magic items
- Races/species/ancestries
- Classes
- Subclasses
- Backgrounds
- Feats
- Monsters in future
- Spells in future

## Core Features

- Manual creation
- Text paste import
- DOCX import
- AI-assisted parsing
- Draft review
- Missing field warnings
- Save private homebrew
- Edit existing homebrew
- Delete homebrew
- Campaign use in future
- Export/import packs in future

## UX Rules

- AI drafts must remain editable.
- Missing fields must be obvious.
- Users should approve before saving major generated content.
- Do not copy protected publisher text into app data by default.

---

# 13. Inventory, Loot, and Economy

## Character Inventory

Features:

- Item list
- Equipped items
- Consumables
- Currency
- Notes
- Magical items
- Item images in future

## Party Inventory

Features:

- Shared loot
- Party funds
- Who is carrying what
- Valuable items
- Quest items

## Settlement / City Economy Future

Potential features:

- City funds
- Town income sources
- Trade routes
- Resource production
- Events/festivals
- Revenue and cost estimates
- Consequences from damaged infrastructure

---

# 14. Events and Mini-Games

## Purpose

Help GMs run events beyond normal combat.

## Examples

- fairs
- festivals
- tournaments
- horse races
- arena events
- markets
- competitions
- political councils

## Event Tool Features

- Event type
- Cost to run
- Potential revenue
- Participants
- Success/failure outcomes
- Skill challenges
- Random events
- Rewards
- Consequences

## Mini-Game Support

The system should eventually support structured mini-games such as:

- horse racing
- gambling-free betting-style fantasy wagers using in-game currency only if appropriate
- arena tournaments
- sports events
- chase scenes
- downtime competitions

---

# 15. Handouts

## Purpose

Let GMs share information with players.

## Core Features

- Create handout
- Text handout
- Image handout
- Assign to whole campaign
- Assign to specific players
- Mark as read
- Archive handouts

## Future Features

- Scheduled release
- Secret handouts
- Puzzle handouts
- Clue board
- Player comments

---

# 16. Soundboard and Ambience

## Purpose

Support atmosphere during sessions.

## Core Features

- Soundboard panel
- Categorized sounds
- Ambience tracks
- Quick play/pause
- Volume controls
- Scene-linked suggestions in future

## Categories

- tavern
- town
- wilderness
- dungeon
- combat
- ocean
- storm
- horror
- magic
- crowd

---

# 17. Rook AI Assistant

## Purpose

Rook is the assistant layer that helps GMs and players prepare, organize, and recap.

## Core Features

- Session prep
- Session recap
- NPC generation
- Location generation
- Encounter suggestions
- Item descriptions
- Homebrew drafting
- Notes summarization
- Campaign-aware answers
- Rules edition aware suggestions

## AI Rules

Rook should:

- use saved campaign notes when available
- respect GM-authored lore
- not overwrite user content automatically
- ask for confirmation before major changes
- avoid protected publisher text
- produce original wording
- clearly present suggestions as suggestions

---

# 18. Admin Tools

## Purpose

Help the site owner manage users and content.

## Core Features

- User list
- Search users
- Export users CSV
- Export campaigns CSV
- Impersonation for support
- Template editor
- Clone template
- Activate/deactivate template
- Delete non-core templates

## Future Features

- AI usage monitoring
- Storage usage monitoring
- Account support notes
- User safety/moderation tools
- Billing/subscription state if needed

---

# 19. Public / Marketing Site

## Purpose

Explain what Rookie Quest Keeper is and encourage users to sign up.

## Core Sections

- Hero section
- Main value proposition
- Feature highlights
- GM tools
- Player tools
- Homebrew tools
- Screenshots/previews
- Call to action
- Pricing in future

## Tone

The marketing page should be confident and clear. It should not overpromise.

---

# 20. Feature Priority Summary

## Highest Priority

- Character save reliability
- Mobile character sheet usability
- Account deletion cleanup
- Auth/AI rate limiting
- Large component cleanup
- Consistent design system

## Medium Priority

- Player handouts
- Travel grid overlay
- Homebrew Workshop expansion
- NPC/monster/item image support
- Combat sync improvements
- GM screen modularity

## Lower Priority

- Advanced economy simulation
- Full soundscape system
- Exportable books/PDFs
- Advanced AI campaign planning
- Marketplace/community sharing

---

# 21. Master Product Summary

Rookie Quest Keeper should become a clean, powerful, dark-themed TTRPG companion that helps Game Masters and Players run campaigns with less stress. It should combine character sheets, campaign notes, GM tools, combat tracking, maps, homebrew, handouts, and AI-assisted prep into one cohesive app. Every feature should make live play easier, campaign prep smoother, or worldbuilding more organized.
