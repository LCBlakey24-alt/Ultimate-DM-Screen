# ROOK — PRD

## Original problem statement
Immersive SRD-5.1-compliant TTRPG app with GM tools + a Player experience that matches D&D Beyond quality. Four character creation modes (Full / Basic / Premade / Kids). Dual-edition support (2014 + 2024). Dark navy + gold-outline simple design.

## Architecture
```
/app
├── backend/
│   ├── server.py
│   ├── models/__init__.py                       # PlayerCharacter[Create|Update] + multiclass model
│   ├── routes/
│   │   ├── character_templates.py               # 24 templates (12×2 editions), AI match
│   │   ├── characters.py                        # CRUD, level-up, /multiclass, HP/temp-HP/exhaustion clamping
│   │   ├── srd.py                               # /api/srd/spells filtered by class+level
│   │   └── ... (18 more)
│   └── data/srd/spells.json
└── frontend/src/
    ├── App.js
    ├── components/
    │   ├── CharacterCreationModePicker.js
    │   ├── CharacterBuilder.js                  # 9-step dynamic wizard (Spells+Gear conditional)
    │   ├── BasicCharacterBuilder.js
    │   ├── PremadeCharacterBuilder.js
    │   ├── KidsCharacterBuilder.js
    │   ├── CharacterSheetFull.js                # Vitals bar, exhaustion-aware HP/speed, multiclass display
    │   ├── CharacterCombatTab.js                # 16 conditions + exhaustion levels passed through
    │   ├── CharacterSpellbook.js                # Slot tracker, Learn Spell modal, prepare/known/spellbook
    │   ├── LevelUpWizard.js                     # Multiclass + ASI/Feat + spell pick + HP roll
    │   └── gm/...
    └── data/
        ├── characterRules5e.js                  # MULTICLASS_REQUIREMENTS + canMulticlassFrom/Into
        ├── conditionEffects.js                  # CONDITIONS + getExhaustionEffects (1–6) + getConditionRollEffect
        └── spellDatabase.js
```

## Implemented

### Phase 16 — D&D Beyond Quality Player (Apr 25)
7-step wizard, vitals bar, backend extensions.

### Phase 17 — Block B Rule Correctness (Apr 30)
- 24 premade templates with AI match
- 9-step dynamic wizard (Spells + Gear show conditionally)
- Half-Elf floating ASI + Skill Versatility, language picker
- Subclass-at-L1 enforcement, Fighting Style picker
- Spell selection step per class (Wizard 3/6, Sorc 4/2, Bard 2/4, Warlock 2/2, Cleric 3/WIS+1, Druid 2/WIS+1)
- Equipment choice step (gear vs gold)
- Basic builder rewritten with real skill picker
- Premade builder uses full template data
- HP/temp-HP persistence bug fixed

### Phase 18 — Mid-game Spell Mgmt + Exhaustion + Multiclass (Apr 30)
- **Learn/Prepare Spell modal** on Spellbook: gold "LEARN SPELL" button → modal with cantrip/L1-9 filter + search → fetches SRD spells filtered by character's class → "LEARN" persists to spells_known/spells_prepared/cantrips_known via PATCH
- **Exhaustion mechanics expanded** to all 6 levels:
  - L1: disadvantage on ability checks
  - L2: speed halved (vitals bar reflects)
  - L3: disadvantage on attacks AND saves
  - L4: HP max halved (vitals bar reflects)
  - L5: speed → 0
  - L6: death
  - Wired into `getConditionRollEffect` and `getConditionIndicator`. Both Sheet save/skill rolls and Combat Tab attack rolls pass `exhaustion_level` through.
- **Multiclass support**: backend `/api/characters/{id}/multiclass` and `class_levels` already existed. LevelUpWizard already had multiclass branch. Character sheet header now displays multiclass progression e.g. "Fighter 3 / Wizard 2" (falls back to single class display).

## Prioritized backlog
### P1 — next
- **Block A: design reset** — strip all player + homepage pages to dark navy + gold-outline (user-requested next)

### P2 — later
- 2024-specific feats (currently shared with 2014)
- Creation-time backstory/personality prompts
- GM-authored custom templates endpoint
- Multiclass spell-slot calculation on the Spellbook (currently shows base class only)

### Blocked
- Production login / password reset (hosting config)

## Phase 21 — P2 Cleanup Sweep (Apr 30)
- **GM theme parity**: GMScreen.js theme object swapped to navy/gold; bulk sed-replaced all purple (`#8A2BE2`, `#4B0082`, `#9932CC`, `#BA55D3`) and cyan (`rgba(77,208,225,*)`, `rgba(138,43,226,*)`) tokens across GMScreen + every gm/* tab
- **Login icon overrides**: AuthPage.js purple icon colors (`#8A2BE2`, `#4DD0E1`) replaced with gold (`#D4A017`)
- **Multiclass spell slots**: new `getMulticlassSpellSlots(classLevels)` helper in spellDatabase.js applies SRD multiclass rules — full casters contribute full level, half casters `floor(level/2)`, Warlock pact tracked separately. CharacterSpellbook detects `class_levels`/`multiclass_levels` with 2+ entries and uses the multiclass slot table (with separate Pact Magic display for Warlock multiclass).
- **2024-specific feats**: every feat in `levelUpData.js` now has `editions: ['2014', '2024']` + `category: 'origin'|'general'|'epic'`. Added 6 new 2024-only Origin feats (Crafter, Musician, Lucky-Origin, Healer-Origin, Savage Attacker-Origin, Alert-Origin) and 8 Epic Boons (Combat Prowess, Dimensional Travel, Fate, Fortitude, Irresistible Offense, Spell Recall, Night Spirit, Truesight). New `getFeatsByEdition(edition, category?)` helper. LevelUpWizard now filters via `getFeatsByEdition(character.edition || '2014')`.
- **Residual purple/cyan purge**: bulk sed across CharacterBuilder, CharacterSheetFull, CharacterSpellbook, CharacterCombatTab, UnifiedDashboard removed all remaining `rgba(138, 43, 226, *)` and `rgba(77, 208, 225, *)` tokens → gold.

## Phase 22 — Spellbook Rest, Conditions Audit, Class Accents, Combat Log (Apr 30 / Iter 83)
- **Spellbook Short / Long Rest buttons** replaced the single Reset All. Short Rest restores Pact Magic only; Long Rest restores all slots + decrements exhaustion (RAW). Both buttons hook into existing `handleRest` flow so backend `/long-rest` / `/short-rest` endpoints fire.
- **`used_spell_slots` persistence**: CharacterSheetFull hydrates from `character.used_spell_slots` on fetch and PATCHes via a `persistUsedSlots` wrapper on every change → slot consumption now survives page reloads.
- **Conditions → sheet linkage audit**: speed-zero conditions (`grappled`, `restrained`, `paralyzed`, `petrified`, `stunned`, `unconscious`) now force SPD vital chip to 0; new `active-conditions-strip` in the header shows active conditions + exhaustion as labeled chips; `incapacitated` chain detection added. Existing roll-mode mapping (advantage/disadvantage/auto-fail) for blinded, paralyzed, poisoned, frightened, prone, restrained, stunned, unconscious, invisible, petrified — re-verified working through `getConditionRollEffect`.
- **Per-class color accents**: new `CLASS_ACCENTS` map + `getClassAccent(character)` helper in `lib/theme.js`. Applied as: small accent crest dot on the character portrait (data-testid='class-accent-dot'), and slot-fill color on gem-style spell slots. Subtle by design — borders + surfaces remain strict Dark Navy + Gold.
- **Gem-style spell slots**: rotated-square (45°) diamond shapes with flat fills, gold borders, class-tinted active fill. Applied in both CharacterSpellbook and CharacterCombatTab.
- **Per-character Combat Log** (`CombatLog.js`): new collapsible panel in Combat tab. Captures HP delta, rolls (classified into attack / spell / roll), rests, condition changes, exhaustion changes. Filter buttons + clear, auto-expands on first entry.
- **Tests**: backend 6/6 pass (used_spell_slots PATCH persistence, conditions PATCH persistence, /long-rest, /short-rest). Frontend 100% on critical flows (class dot, conditions strip, speed-zero under grappled, rest buttons, gem slots, persistence, combat log present). See `/app/test_reports/iteration_83.json`.

## Test iterations
77, 78, 79, 80, 81 (Block B 14/14 backend pass), 82 (Phase 18 - Learn Spell bug fix verified), Phase 20 (Block A visual verification via screenshots), 83 (Phase 22 - 100% backend, 100% critical frontend)

---
*Last updated: April 30, 2026*
