# ROOK — PRD

## Original problem statement
Immersive SRD-5.1-compliant TTRPG app with GM tools + a Player experience that matches D&D Beyond quality. Four character creation modes (Full / Basic / Premade / Kids). Dual-edition support (2014 + 2024).

## Architecture
```
/app
├── backend/
│   ├── server.py
│   ├── models/__init__.py                        # PlayerCharacter[Create|Update] with subrace, skill/save/tool profs, racial_traits, class_features, ruleset_id, fighting_style
│   ├── routes/
│   │   ├── character_templates.py                # NEW — 24 templates (12 × 2014, 12 × 2024), AI match + tag fallback
│   │   ├── characters.py                         # HP/temp-HP clamping, spell-learn rules, level-up preflight
│   │   ├── srd.py                                # /api/srd/spells?class_name=&level=&school=
│   │   └── ... (18 more)
│   └── data/srd/spells.json                      # 319 SRD spells, 8 caster classes
└── frontend/src/
    ├── App.js                                    # Routes: /characters/new (picker), /full, /basic, /premade, /kids
    ├── components/
    │   ├── CharacterCreationModePicker.js
    │   ├── CharacterBuilder.js                   # 7→9 step dynamic wizard (Spells+Gear conditional)
    │   ├── BasicCharacterBuilder.js              # Rewritten: skill picker, edition, background, stat arrays
    │   ├── PremadeCharacterBuilder.js            # Fetches full template, preserves abilities/skills/spells
    │   ├── KidsCharacterBuilder.js               # Wraps Basic (future: kid-friendly copy)
    │   ├── CharacterSheetFull.js                 # Vitals bar, HP +/- with temp-HP absorption + persistence
    │   ├── CharacterCombatTab.js                 # Damage/heal/temp-HP, 16 conditions, concentration CON save
    │   ├── CharacterSpellbook.js                 # Slots, upcast scaling, pact magic
    │   ├── LevelUpWizard.js                      # Per-class progression, HP roll/average
    │   └── gm/...
    └── data/
        ├── characterRules5e.js                   # RACES (11 + subraces), CLASSES (12), BACKGROUNDS (12)
        ├── conditionEffects.js                   # 16 conditions → roll effects
        └── spellDatabase.js                      # SPELLCASTING_CLASSES, SPELL_SLOTS, PACT_MAGIC_SLOTS
```

## Implemented
### Phase 16 — D&D Beyond-Quality Player (Apr 25)
Full 7-step wizard, vitals bar, backend model extensions.

### Phase 17 — Block B Rule-Correctness Fixes (Apr 30)
**Backend**
- `/api/character-templates` (12 × 2 editions = 24 templates) with `?ruleset_id=` filter
- `/api/character-templates/{id}` full detail incl. ability_scores/skills/spells/fighting_style
- `/api/character-templates/ai-match` playstyle→template with LLM-refined rationale + tag fallback
- PlayerCharacterCreate accepts: `ruleset_id`, `fighting_style`, `equipment_choice`, `starting_equipment`, plus prior Block 16 fields
- HP clamping on PATCH (current_hit_points ≤ max_hit_points)

**Frontend**
- **Full builder** became a **9-step dynamic wizard**: Edition → Race → Class → Background → Abilities → Skills → *Spells* (if spellcaster) → *Gear* → Review
- Half-Elf: floating +1 ASI picker (2 different abilities, CHA disabled as already +2) + Skill Versatility (pick 2 extra skills)
- "One of choice" language picker (Human, Half-Elf, 2014 Elf High-Elf subrace)
- Subclass-at-L1 enforcement for Cleric/Sorcerer/Warlock (2014) with domain/origin/patron labels
- Fighting Style picker (Fighter required at L1, Paladin/Ranger at L2)
- Spells step: fetches SRD spells filtered by class, enforces cantrip + L1 spell counts per class (Bard 2/4, Sorc 4/2, Warlock 2/2, Wizard 3/6, Cleric 3/WIS+1 prepared, Druid 2/WIS+1 prepared)
- Equipment choice step: Option A (class+background gear) vs Option B (starting gold)
- **Basic builder** fully rewritten: edition + level + background picker, real skill-picker with count enforcement, per-class stat arrays (not hardcoded Fighter)
- **Premade builder** now fetches full template on "Use Template" — preserves ability scores, skills, cantrips, spells (was hard-coding 15/14/13/12/10/8 before)
- **HP/temp-HP bug fix**: damage into temp HP now persists to backend (was state-only). Page-reload verified 4/7 persists.

## Prioritized backlog
### P1 — next
- **Block A: design reset** — strip all player + homepage pages down to dark navy + gold-outline theme (user-requested)

### P2 — later
- 2024 feats tagged separately (currently both editions share SRD feats)
- Add "Learn/Prepare Spell" button on Spellbook for mid-game spell management
- Expand exhaustion mechanics (level 3: disadvantage on attacks/saves; level 6: death)
- Multiclass support in builder + level-up
- Creation-time backstory / personality prompts
- Backend `/api/character-templates/admin` for GMs to add their own templates

### Blocked (external)
- Production login / password reset (hosting config)
- Production deployment risk (hosting config)

## Test iterations
77, 78 (Event System 100%), 79 (Tabs+Refactor 35/35), 80 (Builder+Vitals), **81 (Block B full — 14/14 backend, frontend smoke all-clear, HP persistence verified)**

---
*Last updated: April 30, 2026*
