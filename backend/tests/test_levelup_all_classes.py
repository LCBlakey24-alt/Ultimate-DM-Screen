#!/usr/bin/env python3
"""Comprehensive Level-Up Test for All 12 D&D Classes"""
import requests, json, sys, os

API = os.popen("grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2").read().strip() + "/api"

# Login
r = requests.post(f"{API}/auth/login", json={"email": "lcblakey24@outlook.com", "password": "LCBlakey24?!"})
token = r.json()["token"]
headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

results = []
BASE_STATS = {"strength": 15, "dexterity": 14, "constitution": 13, "intelligence": 12, "wisdom": 10, "charisma": 14}

# Test configuration: class, starting level, target level, subclass_key (if applicable at target level), fighting_style (if applicable)
TEST_CASES = [
    {"cls": "Barbarian", "start": 2, "target": 3, "subclass": "berserker", "fs": None},
    {"cls": "Bard", "start": 2, "target": 3, "subclass": "college_of_lore", "fs": None},
    {"cls": "Cleric", "start": 1, "target": 2, "subclass": None, "fs": None},  # Cleric subclass at 1 (set at creation)
    {"cls": "Druid", "start": 1, "target": 2, "subclass": "circle_of_the_land", "fs": None},  # Druid subclass at 2
    {"cls": "Fighter", "start": 2, "target": 3, "subclass": "champion", "fs": None},  # Fighter subclass at 3
    {"cls": "Monk", "start": 2, "target": 3, "subclass": "way_of_the_open_hand", "fs": None},
    {"cls": "Paladin", "start": 1, "target": 2, "subclass": None, "fs": "Dueling"},  # Paladin FS at 2
    {"cls": "Ranger", "start": 1, "target": 2, "subclass": None, "fs": "Archery"},  # Ranger FS at 2
    {"cls": "Rogue", "start": 2, "target": 3, "subclass": "thief", "fs": None},
    {"cls": "Sorcerer", "start": 1, "target": 2, "subclass": None, "fs": None},  # Sorcerer subclass at 1 (set at creation)
    {"cls": "Warlock", "start": 1, "target": 2, "subclass": None, "fs": None},  # Warlock subclass at 1
    {"cls": "Wizard", "start": 1, "target": 2, "subclass": "school_of_evocation", "fs": None},  # Wizard subclass at 2
]

print("=" * 80)
print("COMPREHENSIVE LEVEL-UP TEST - ALL 12 CLASSES")
print("=" * 80)

for tc in TEST_CASES:
    cls = tc["cls"]
    print(f"\n--- {cls} ---")
    
    # 1. Create character
    char_data = {"name": f"LvlUp_{cls}_{tc['start']}to{tc['target']}", "race": "Human", "character_class": cls, "level": tc["start"], **BASE_STATS}
    r = requests.post(f"{API}/characters", headers=headers, json=char_data)
    if r.status_code != 200:
        print(f"  CREATE FAILED: {r.status_code} - {r.text[:200]}")
        results.append({"class": cls, "create": "FAIL", "levelup": "SKIP", "details": r.text[:200]})
        continue
    
    char = r.json()
    char_id = char.get("character_id") or char.get("character", {}).get("id")
    print(f"  Created: ID={char_id}, Level={tc['start']}")
    
    # 2. Level up
    levelup_data = {"new_level": tc["target"], "hp_method": "average"}
    if tc["subclass"]:
        levelup_data["subclass"] = tc["subclass"]
    if tc["fs"]:
        levelup_data["fighting_style"] = tc["fs"]
    
    r = requests.post(f"{API}/characters/{char_id}/level-up", headers=headers, json=levelup_data)
    if r.status_code != 200:
        print(f"  LEVEL-UP FAILED: {r.status_code} - {r.text[:300]}")
        results.append({"class": cls, "create": "PASS", "levelup": "FAIL", "details": r.text[:300]})
        continue
    
    updated = r.json()
    # Response nests under 'character' key
    char_data_resp = updated.get("character", updated)
    new_level = char_data_resp.get("level", "?")
    new_hp = char_data_resp.get("max_hit_points", "?")
    sub = char_data_resp.get("subclass", "")
    fs = char_data_resp.get("fighting_style", "")
    
    status = "PASS" if new_level == tc["target"] else "FAIL"
    print(f"  Level-Up: Level={new_level}, HP={new_hp}, Subclass='{sub}', FightingStyle='{fs}' -> {status}")
    
    results.append({
        "class": cls, "create": "PASS", "levelup": status,
        "details": f"Level {tc['start']}->{new_level}, HP={new_hp}, Sub='{sub}', FS='{fs}'"
    })
    
    # 3. Test level-up-info endpoint
    r = requests.get(f"{API}/characters/{char_id}/level-up-info", headers=headers)
    if r.status_code == 200:
        info = r.json()
        print(f"  Level-Up Info: next_level={info.get('next_level')}, needs_subclass={info.get('needs_subclass')}, subclass_level={info.get('subclass_unlock_level')}")
    else:
        print(f"  Level-Up Info: FAILED {r.status_code}")

# Also test leveling up again (Barbarian 3->4 for ASI test)
print(f"\n--- BARBARIAN Level 3->4 (ASI Test) ---")
barb = [r for r in results if r["class"] == "Barbarian" and r["levelup"] == "PASS"]
if barb:
    # Find the barbarian we created
    r = requests.get(f"{API}/characters", headers=headers)
    chars = r.json()
    barb_char = next((c for c in chars if c["name"].startswith("LvlUp_Barbarian")), None)
    if barb_char:
        r = requests.post(f"{API}/characters/{barb_char['id']}/level-up", headers=headers, json={
            "new_level": 4, "hp_method": "average", "choice_type": "asi", "asi_choices": {"ability1": "strength", "ability2": "constitution"}
        })
        if r.status_code == 200:
            u = r.json().get("character", r.json())
            print(f"  ASI Level-Up: Level={u.get('level')}, STR={u.get('strength')}, CON={u.get('constitution')} -> PASS")
        else:
            print(f"  ASI Level-Up: FAILED {r.status_code} - {r.text[:200]}")

# Summary
print("\n" + "=" * 80)
print("SUMMARY")
print("=" * 80)
passed = sum(1 for r in results if r["levelup"] == "PASS")
failed = sum(1 for r in results if r["levelup"] == "FAIL")
print(f"  Total: {len(results)} classes tested")
print(f"  Passed: {passed}")
print(f"  Failed: {failed}")
for r in results:
    icon = "✓" if r["levelup"] == "PASS" else "✗"
    print(f"  {icon} {r['class']}: {r['details']}")

if failed > 0:
    print("\nFAILED TESTS NEED ATTENTION!")
    sys.exit(1)
else:
    print("\nALL TESTS PASSED!")
    sys.exit(0)
