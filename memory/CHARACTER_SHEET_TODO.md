# Character Sheet / Creator Follow-up TODO

## Mobile polish
- HP amount + Damage + Heal row has CSS override in `mobileSheetPolish.css`.
- Attack/spell cards have CSS support for top info + bottom stat boxes.
- Dice flicker/hold CSS added in `mobileSheetPolish.css`.
- Remaining JS task: change `CleanCharacterSheet.js` rollBurst timeout from 1800ms to 6000ms so the full 3s flicker + 3s hold is visible. Avoid full-file rewrite; patch carefully.

## Equipment / attacks
- Equipment flow still needs proper attack values from equipped items.
- Weapons should display:
  - name
  - range / properties
  - to-hit or save
  - damage dice and modifier
  - damage type
- Inventory should support structured weapon fields, not only free-text item names.

## Rules audit
- Continue class/resource audit from `memory/RULES_AUDIT.md`.
- Confirm 2014/2024 subclass timing in builder.
- Add starting level flow and per-level choices.
