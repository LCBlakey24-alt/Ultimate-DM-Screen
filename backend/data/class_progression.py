"""
SRD class progression reference — used by `/level-up-options` to return the FULL
legal option set (subclasses, spells/cantrips gained, feats) so the LevelUpWizard
can render only valid choices instead of computing them client-side.

Source-of-truth lookup: _CLASS_SUBCLASSES / _SPELLS_KNOWN_PROGRESSION /
_CANTRIPS_KNOWN_PROGRESSION / _FEATS_BY_EDITION.

All content is SRD/OGL only.
"""
from typing import List, Dict, Any

# Subclasses per class (SRD-friendly only). Editions matter — 2024 dropped a few.
_CLASS_SUBCLASSES: Dict[str, List[str]] = {
    'Barbarian': ['Path of the Berserker', 'Path of the Wild Heart', 'Path of the World Tree', 'Path of the Zealot'],
    'Bard':      ['College of Lore', 'College of Valor', 'College of Glamour', 'College of Swords', 'College of Whispers'],
    'Cleric':    ['Life Domain', 'Light Domain', 'Trickery Domain', 'War Domain', 'Knowledge Domain', 'Nature Domain', 'Tempest Domain'],
    'Druid':     ['Circle of the Land', 'Circle of the Moon', 'Circle of the Sea', 'Circle of the Stars'],
    'Fighter':   ['Champion', 'Battle Master', 'Eldritch Knight', 'Psi Warrior'],
    'Monk':      ['Warrior of the Open Hand', 'Warrior of Shadow', 'Warrior of the Elements', 'Warrior of Mercy'],
    'Paladin':   ['Oath of Devotion', 'Oath of the Ancients', 'Oath of Vengeance', 'Oath of Glory'],
    'Ranger':    ['Hunter', 'Beast Master', 'Gloom Stalker', 'Fey Wanderer'],
    'Rogue':     ['Thief', 'Assassin', 'Arcane Trickster', 'Soulknife', 'Swashbuckler'],
    'Sorcerer':  ['Draconic Sorcery', 'Wild Magic', 'Aberrant Sorcery', 'Clockwork Sorcery'],
    'Warlock':   ['Fiend Patron', 'Archfey Patron', 'Great Old One Patron', 'Celestial Patron'],
    'Wizard':    ['Abjurer', 'Diviner', 'Evoker', 'Illusionist'],
}

# 2014 spells known at each level (for "spells known" casters: Bard / Ranger / Sorcerer / Warlock).
# Prepared casters (Cleric / Druid / Paladin / Wizard) compute prepared = ability_mod + level.
_SPELLS_KNOWN_PROGRESSION: Dict[str, Dict[int, int]] = {
    'Bard':     {1:4,2:5,3:6,4:7,5:8,6:9,7:10,8:11,9:12,10:14,11:15,12:15,13:16,14:18,15:19,16:19,17:20,18:22,19:22,20:22},
    'Ranger':   {2:2,3:3,4:3,5:4,6:4,7:5,8:5,9:6,10:6,11:7,12:7,13:8,14:8,15:9,16:9,17:10,18:10,19:11,20:11},
    'Sorcerer': {1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:11,11:12,12:12,13:13,14:13,15:14,16:14,17:15,18:15,19:15,20:15},
    'Warlock':  {1:2,2:3,3:4,4:5,5:6,6:7,7:8,8:9,9:10,10:10,11:11,12:11,13:12,14:12,15:13,16:13,17:14,18:14,19:15,20:15},
    'Wizard':   {1:6,2:8,3:10,4:12,5:14,6:16,7:18,8:20,9:22,10:24,11:26,12:28,13:30,14:32,15:34,16:36,17:38,18:40,19:42,20:44},
}

# Cantrips known at each level.
_CANTRIPS_KNOWN_PROGRESSION: Dict[str, Dict[int, int]] = {
    'Bard':     {1:2,4:3,10:4},
    'Cleric':   {1:3,4:4,10:5},
    'Druid':    {1:2,4:3,10:4},
    'Sorcerer': {1:4,4:5,10:6},
    'Warlock':  {1:2,4:3,10:4},
    'Wizard':   {1:3,4:4,10:5},
}

# Origin Feats (2024 only) — picked at character creation as part of background.
_ORIGIN_FEATS_2024: List[str] = [
    'Crafter', 'Healer', 'Lucky', 'Magic Initiate', 'Musician',
    'Savage Attacker', 'Skilled', 'Tavern Brawler', 'Tough', 'Alert',
]

# General feats — most are shared 2014/2024 SRD; a handful are 2024-only or 2014-only.
_GENERAL_FEATS_BOTH: List[str] = [
    'Alert', 'Athlete', 'Charger', 'Chef', 'Crusher', 'Defensive Duelist',
    'Dual Wielder', 'Durable', 'Elemental Adept', 'Fey Touched', 'Grappler',
    'Great Weapon Master', 'Heavily Armored', 'Heavy Armor Master',
    'Inspiring Leader', 'Keen Mind', 'Lightly Armored', 'Linguist',
    'Lucky', 'Mage Slayer', 'Magic Initiate', 'Martial Adept',
    'Medium Armor Master', 'Mobile', 'Mounted Combatant', 'Observant',
    'Piercer', 'Polearm Master', 'Resilient', 'Ritual Caster',
    'Savage Attacker', 'Sentinel', 'Shadow Touched', 'Sharpshooter',
    'Shield Master', 'Skill Expert', 'Skulker', 'Slasher',
    'Spell Sniper', 'Tavern Brawler', 'Telekinetic', 'Telepathic',
    'Tough', 'War Caster', 'Weapon Master',
]
_GENERAL_FEATS_2024_ONLY: List[str] = []  # add any pure-2024 general feats here

# Spell-school subclass list for Wizard (fallback when subclass list is "schools").
def feats_for_edition(edition: str, category: str = 'general') -> List[str]:
    """Return the feat list for the given edition + category.
    category: 'origin' (2024 only) or 'general' (any non-origin feat) or 'all'.
    """
    if category == 'origin':
        return _ORIGIN_FEATS_2024 if edition == '2024' else []
    if category == 'general':
        return list(_GENERAL_FEATS_BOTH) + (_GENERAL_FEATS_2024_ONLY if edition == '2024' else [])
    return list(_GENERAL_FEATS_BOTH) + _ORIGIN_FEATS_2024 + _GENERAL_FEATS_2024_ONLY

def subclasses_for(class_name: str) -> List[str]:
    return list(_CLASS_SUBCLASSES.get(class_name, []))

def spells_to_learn(class_name: str, current_level: int, target_level: int) -> int:
    """Net new spells learned when going from current_level → target_level (>=0)."""
    table = _SPELLS_KNOWN_PROGRESSION.get(class_name)
    if not table:
        return 0
    cur = table.get(current_level, 0)
    nxt = table.get(target_level, cur)
    return max(0, nxt - cur)

def cantrips_to_learn(class_name: str, current_level: int, target_level: int) -> int:
    table = _CANTRIPS_KNOWN_PROGRESSION.get(class_name)
    if not table:
        return 0
    # cantrip progression is sparse — use last-seen value
    def _at(level: int) -> int:
        seen = 0
        for lv in sorted(table.keys()):
            if lv <= level:
                seen = table[lv]
            else:
                break
        return seen
    return max(0, _at(target_level) - _at(current_level))

def spells_known_table(class_name: str) -> Dict[int, int]:
    """Public accessor for the spells-known progression table."""
    return dict(_SPELLS_KNOWN_PROGRESSION.get(class_name, {}))

def cantrips_known_table(class_name: str) -> Dict[int, int]:
    """Public accessor for the cantrips-known progression table."""
    return dict(_CANTRIPS_KNOWN_PROGRESSION.get(class_name, {}))

def class_progression_summary(class_name: str, edition: str) -> Dict[str, Any]:
    """All level-up reference data for one class — frontend uses this for the wizard."""
    return {
        'class_name': class_name,
        'edition': edition,
        'subclasses': subclasses_for(class_name),
        'spells_known_table': _SPELLS_KNOWN_PROGRESSION.get(class_name, {}),
        'cantrips_known_table': _CANTRIPS_KNOWN_PROGRESSION.get(class_name, {}),
        'origin_feats': feats_for_edition(edition, 'origin'),
        'general_feats': feats_for_edition(edition, 'general'),
    }
