# Critical Fixes Test Plan — May 11, 2026

**All 5 critical fixes have been implemented and code-verified.** This document provides manual test cases.

---

## AUTOMATED VERIFICATION ✅

- ✅ CleanCharacterSheet.js: 0 compilation errors
- ✅ CharacterBuilder.js: 0 compilation errors
- ✅ CharacterCombatTab.js: 0 compilation errors
- ✅ CharacterSpellbook.js: 0 compilation errors

---

## MANUAL TEST CASES

### Test 1: Dice Popup Visibility (5 min)
**Location:** Any character sheet → Overview / Combat / Spells tab  
**Steps:**
1. Navigate to a character sheet
2. Roll a d20 (or any die) by clicking "Roll" button  
3. Observe the result pop-up
4. **EXPECTED:** Result stays visible for **6 seconds** (visual timer: 3s flicker animation + 3s hold)
5. **REGRESSION CHECK:** After disappearing, no visual artifacts

**Verification:**
```javascript
// Change verified in CleanCharacterSheet.js line 163:
// FROM: const timeout = setTimeout(() => setRollBurst(null), 1800);
// TO:   const timeout = setTimeout(() => setRollBurst(null), 6000);
```

---

### Test 2: Level Up Button Wired (10 min)
**Location:** Character sheet header → "Level Up" button  
**Steps:**
1. Go to any player character sheet
2. Click the **"Level Up"** button in the top right
3. **EXPECTED:** A modal dialog opens showing LevelUpWizard
4. Modal title should be "Choose Your Level" or similar
5. Modal has HP selection, ASI/Feat choice steps
6. Complete the level-up flow (select HP method → ASI/Feat → confirm)
7. Character should advance to next level
8. **REGRESSION CHECK:** Page reloads cleanly, character level incremented

**Verification:**
```javascript
// Changes verified in CleanCharacterSheet.js:
// Line 31: import LevelUpWizard from '@/components/LevelUpWizard';
// Line 136: const [showLevelUpWizard, setShowLevelUpWizard] = useState(false);
// Line 477: onClick={() => setShowLevelUpWizard(true)}
// Lines 438-445: Modal render + onLevelUp callback
```

---

### Test 3: Skills Over-selection Bug (10 min)
**Location:** Character editor → Skills step  
**Steps:**
1. Go to `/characters/{id}/edit` for any character
2. Navigate to the **Skills** step
3. Observe the UI:
   - Top section shows "Granted by [Background]:" with background skills grayed out
   - Counter shows "Selected: X / Y" for class skills only
4. Verify background skills are **NOT** counted in the "Selected" counter
5. Change a class skill selection (unselect one, select another)
6. Click **Save** 
7. Go back to character editor
8. **EXPECTED:** 
   - Background skills still appear as "granted"
   - Class skills counter matches what you saved
   - No background skills counted as "class-selected"

**Verification:**
```javascript
// Changes verified in CharacterBuilder.js lines 209-211:
// const bgSkills = backgroundData?.skillProficiencies || [];
// const editedSkills = (char.skill_proficiencies || []).filter(s => !bgSkills.includes(s));
// setSelectedSkills(editedSkills);
```

---

### Test 4: Equipped Weapons Display (15 min)
**Location:** Character sheet → Combat tab → Attacks section  
**Steps:**
1. Go to any character sheet
2. Click the **Inventory** tab
3. "Equip" a weapon (Longsword, Rapier, Greatsword, Dagger, etc.)
4. Go back to **Combat** tab
5. Look at the "Attacks" section
6. **EXPECTED:** Equipped weapon appears with:
   - ✅ Real weapon name (not "Unarmed Strike")
   - ✅ To-hit bonus (e.g., "+5" = STR mod + proficiency)
   - ✅ Damage dice (e.g., "1d8" for Longsword)
   - ✅ Damage type (e.g., "slashing", "piercing")
   - ✅ Range (e.g., "Melee", "20/60 ft")
   - ✅ Properties (e.g., "versatile", "finesse", "light")
7. Roll the attack dice
8. **REGRESSION CHECK:** Damage and AC calculations still work

**Test Variants:**
- Finesse weapon (Rapier, Dagger) → to-hit should use DEX if DEX > STR
- Ranged weapon (Shortbow, Hand Crossbow) → to-hit uses DEX
- Two-handed weapon (Greatsword, Longbow) → damage uses full ability mod
- Custom weapon (not in SRD) → falls back to generic template

**Verification:**
```javascript
// Changes verified in CharacterCombatTab.js:
// Line 5: import { findWeaponRule, getWeaponAbilityMod } from '../data/equipmentRules5e';
// Lines 151-158: getWeaponAttacks() uses findWeaponRule() + getWeaponAbilityMod()
// Attack object structure: { name, toHit, damage, damageType, properties, range }
```

---

### Test 5: Prepared Spells Management (10 min)
**Location:** Character sheet → Spells tab (Cleric / Druid / Wizard only)  
**Steps:**
1. Create or load a **Cleric, Druid, or Wizard** character
2. Go to the **Spells** tab
3. Look for "Prepared: X/Y" counter near the top
4. Observe spell list:
   - Each spell row has a **checkbox** on the left
   - Checkboxes are **unchecked** for unprepared spells
   - Checkboxes are **checked** for prepared spells
5. **Toggle a spell prepared/unprepared:**
   - Click an unchecked spell checkbox
   - **EXPECTED:** Checkbox becomes checked, prepared count increases
   - Click a checked spell checkbox
   - **EXPECTED:** Checkbox becomes unchecked, prepared count decreases
6. Verify the count never exceeds the **Prepared: X/Y** limit
7. **Save character**
8. **Reload page**
9. **EXPECTED:** Prepared spell state persists (checkboxes still in same position)

**Edge Cases:**
- Maximum prepared limit reached → new checkbox clicks should do nothing
- Prepared caster without spells → show "No spells prepared yet" message
- Non-prepared casters (Bard, Sorcerer) → should NOT show checkboxes

**Verification:**
```javascript
// Changes verified in CharacterSpellbook.js:
// Line 116: const maxPrepared = classInfo.type === 'prepared' ? ...
// Line 135: const preparedCount = preparedSpells.size;
// Lines 160-169: togglePrepared() handler
// Lines ~765+: Checkbox UI for each spell when classInfo.type === 'prepared'
```

---

## REGRESSION SMOKE TEST (5 min)

Run these quick checks to ensure no side effects:

1. **Home page loads** → No 404 errors
2. **Character list shows** → Characters load correctly
3. **Create new character** → Full builder works
4. **Edit character** → All steps accessible
5. **Console errors** → Should be 0 new errors (press F12 → Console tab)

---

## TEST EXECUTION CHECKLIST

- [ ] Test 1: Dice Popup (6 sec visibility)
- [ ] Test 2: Level Up Button (opens modal)
- [ ] Test 3: Skills Bug (background not counted)
- [ ] Test 4: Equipped Weapons (correct to-hit/damage/type)
- [ ] Test 5: Prepared Spells (checkbox toggle + persistence)
- [ ] Regression: Home / Character list / New builder / Console clean

---

## SIGN-OFF

**Date Tested:** ___________  
**Tester Name:** ___________  
**All Tests Passed:** ☐ Yes ☐ No  
**Browser / OS:** _________________  

**Notes:**
```
[Space for test notes]
```

---

## IF ISSUES FOUND

1. **Check browser console** (F12) for error messages
2. **Verify deployed commit** includes all 4 fixes
3. **Hard refresh** (Ctrl+Shift+R) to clear cache
4. **Check that these files were updated:**
   - `frontend/src/components/CleanCharacterSheet.js`
   - `frontend/src/components/CharacterBuilder.js`
   - `frontend/src/components/CharacterCombatTab.js`

---

**Document Version:** 1.0  
**Last Updated:** May 11, 2026  
**Status:** Ready for QA Testing
