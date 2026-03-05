"""
Test suite for SRD (System Reference Document) API endpoints
Tests spell, class, race, and feat data retrieval from D&D 5e SRD
"""
import pytest
import requests
import os

# Use conftest.py value or default
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://dm-battle-maps.preview.emergentagent.com').rstrip('/')


@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


class TestSRDSpellsAPI:
    """Test /api/srd/spells endpoints"""
    
    def test_get_all_spells(self, api_client):
        """GET /api/srd/spells - should return all spells"""
        response = api_client.get(f"{BASE_URL}/api/srd/spells")
        assert response.status_code == 200
        data = response.json()
        
        assert "spells" in data
        assert "count" in data
        assert "source" in data
        assert data["count"] > 30  # Should have at least 30+ spells
        assert "SRD" in data["source"]
        
        # Verify spell structure
        spell = data["spells"][0]
        assert "name" in spell
        assert "level" in spell
        assert "school" in spell
        assert "casting_time" in spell
        assert "range" in spell
        assert "description" in spell
    
    def test_filter_spells_by_level(self, api_client):
        """GET /api/srd/spells?level=0 - should return only cantrips"""
        response = api_client.get(f"{BASE_URL}/api/srd/spells?level=0")
        assert response.status_code == 200
        data = response.json()
        
        assert data["count"] > 0
        for spell in data["spells"]:
            assert spell["level"] == 0  # All should be cantrips
    
    def test_filter_spells_by_school(self, api_client):
        """GET /api/srd/spells?school=evocation - should return evocation spells"""
        response = api_client.get(f"{BASE_URL}/api/srd/spells?school=evocation")
        assert response.status_code == 200
        data = response.json()
        
        assert data["count"] > 0
        for spell in data["spells"]:
            assert spell["school"] == "evocation"
    
    def test_filter_spells_by_class(self, api_client):
        """GET /api/srd/spells?class_name=wizard - should return wizard spells"""
        response = api_client.get(f"{BASE_URL}/api/srd/spells?class_name=wizard")
        assert response.status_code == 200
        data = response.json()
        
        assert data["count"] > 0
        for spell in data["spells"]:
            assert "wizard" in spell["classes"]
    
    def test_get_specific_spell_fireball(self, api_client):
        """GET /api/srd/spells/Fireball - should return Fireball spell details"""
        response = api_client.get(f"{BASE_URL}/api/srd/spells/Fireball")
        assert response.status_code == 200
        spell = response.json()
        
        assert spell["name"] == "Fireball"
        assert spell["level"] == 3
        assert spell["school"] == "evocation"
        assert "8d6" in spell["damage_dice"]
        assert spell["damage_type"] == "fire"
        assert "sorcerer" in spell["classes"] or "wizard" in spell["classes"]
    
    def test_get_specific_spell_magic_missile(self, api_client):
        """GET /api/srd/spells/Magic Missile - should return Magic Missile"""
        response = api_client.get(f"{BASE_URL}/api/srd/spells/Magic%20Missile")
        assert response.status_code == 200
        spell = response.json()
        
        assert spell["name"] == "Magic Missile"
        assert spell["level"] == 1
    
    def test_get_nonexistent_spell(self, api_client):
        """GET /api/srd/spells/NonExistentSpell - should return 404"""
        response = api_client.get(f"{BASE_URL}/api/srd/spells/NonExistentSpell123")
        assert response.status_code == 404


class TestSRDClassesAPI:
    """Test /api/srd/classes endpoints"""
    
    def test_get_all_classes(self, api_client):
        """GET /api/srd/classes - should return all classes"""
        response = api_client.get(f"{BASE_URL}/api/srd/classes")
        assert response.status_code == 200
        data = response.json()
        
        assert "classes" in data
        assert "source" in data
        assert len(data["classes"]) >= 6  # Should have at least 6 classes
        
        # Verify class structure
        cls = data["classes"][0]
        assert "name" in cls
        assert "hit_die" in cls
        assert "features" in cls
    
    def test_get_specific_class_fighter(self, api_client):
        """GET /api/srd/classes/Fighter - should return Fighter class"""
        response = api_client.get(f"{BASE_URL}/api/srd/classes/Fighter")
        assert response.status_code == 200
        cls = response.json()
        
        assert cls["name"] == "Fighter"
        assert cls["hit_die"] == "d10"
        assert "features" in cls
        
        # Check for key features
        feature_names = [f["name"] for f in cls["features"]]
        assert "Fighting Style" in feature_names
        assert "Second Wind" in feature_names
    
    def test_get_specific_class_wizard(self, api_client):
        """GET /api/srd/classes/Wizard - should return Wizard class"""
        response = api_client.get(f"{BASE_URL}/api/srd/classes/Wizard")
        assert response.status_code == 200
        cls = response.json()
        
        assert cls["name"] == "Wizard"
        assert cls["hit_die"] == "d6"
        assert "spellcasting" in cls
    
    def test_get_nonexistent_class(self, api_client):
        """GET /api/srd/classes/NonExistentClass - should return 404"""
        response = api_client.get(f"{BASE_URL}/api/srd/classes/NonExistentClass123")
        assert response.status_code == 404


class TestSRDClassFeaturesAPI:
    """Test /api/srd/class-features endpoints"""
    
    def test_get_fighter_level_1_features(self, api_client):
        """GET /api/srd/class-features/Fighter/1 - should return level 1 features"""
        response = api_client.get(f"{BASE_URL}/api/srd/class-features/Fighter/1")
        assert response.status_code == 200
        data = response.json()
        
        assert data["class"] == "Fighter"
        assert data["level"] == 1
        assert "features" in data
        assert len(data["features"]) > 0
        
        # Fighter level 1 should have Fighting Style and Second Wind
        feature_names = [f["name"] for f in data["features"]]
        assert "Fighting Style" in feature_names
        assert "Second Wind" in feature_names
    
    def test_get_barbarian_level_2_features(self, api_client):
        """GET /api/srd/class-features/Barbarian/2 - should return level 2 features"""
        response = api_client.get(f"{BASE_URL}/api/srd/class-features/Barbarian/2")
        assert response.status_code == 200
        data = response.json()
        
        assert data["class"] == "Barbarian"
        assert data["level"] == 2
        assert "features" in data
        
        # Barbarian level 2 should have Reckless Attack and Danger Sense
        feature_names = [f["name"] for f in data["features"]]
        assert "Reckless Attack" in feature_names
    
    def test_get_nonexistent_class_features(self, api_client):
        """GET /api/srd/class-features/NonExistent/1 - should return 404"""
        response = api_client.get(f"{BASE_URL}/api/srd/class-features/NonExistentClass/1")
        assert response.status_code == 404


class TestSRDRacesAPI:
    """Test /api/srd/races endpoint"""
    
    def test_get_all_races(self, api_client):
        """GET /api/srd/races - should return all races"""
        response = api_client.get(f"{BASE_URL}/api/srd/races")
        assert response.status_code == 200
        data = response.json()
        
        assert "races" in data
        assert "source" in data
        assert len(data["races"]) >= 4  # Should have at least 4 races
        
        # Verify race names present
        race_names = [r["name"] for r in data["races"]]
        assert "Human" in race_names
        assert "Elf" in race_names
        assert "Dwarf" in race_names
        assert "Halfling" in race_names
    
    def test_race_structure(self, api_client):
        """Verify race data structure is correct"""
        response = api_client.get(f"{BASE_URL}/api/srd/races")
        assert response.status_code == 200
        data = response.json()
        
        # Check Elf race structure
        elf = next((r for r in data["races"] if r["name"] == "Elf"), None)
        assert elf is not None
        assert "ability_bonuses" in elf
        assert elf["ability_bonuses"]["dexterity"] == 2
        assert "traits" in elf
        assert "speed" in elf
        assert elf["speed"] == 30


class TestSRDFeatsAPI:
    """Test /api/srd/feats endpoint"""
    
    def test_get_all_feats(self, api_client):
        """GET /api/srd/feats - should return all feats"""
        response = api_client.get(f"{BASE_URL}/api/srd/feats")
        assert response.status_code == 200
        data = response.json()
        
        assert "feats" in data
        assert "source" in data
        assert len(data["feats"]) >= 8  # Should have at least 8 feats
        
        # Verify feat names present
        feat_names = [f["name"] for f in data["feats"]]
        assert "Alert" in feat_names
        assert "Great Weapon Master" in feat_names
        assert "Sharpshooter" in feat_names
    
    def test_feat_structure(self, api_client):
        """Verify feat data structure is correct"""
        response = api_client.get(f"{BASE_URL}/api/srd/feats")
        assert response.status_code == 200
        data = response.json()
        
        # Check Great Weapon Master feat
        gwm = next((f for f in data["feats"] if f["name"] == "Great Weapon Master"), None)
        assert gwm is not None
        assert "description" in gwm
        assert "benefits" in gwm
        assert len(gwm["benefits"]) > 0
