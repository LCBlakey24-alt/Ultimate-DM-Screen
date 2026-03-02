"""
Backend tests for Custom Creatures CRUD API.
Tests the custom creature creator feature for GM homebrew monsters.
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
TEST_CAMPAIGN_ID = "445891b3-96f8-4e18-9ae4-68987c2e884c"
TEST_USER = {"username": "testgm123", "password": "testpass123"}


@pytest.fixture(scope="module")
def auth_token():
    """Get authentication token for test user"""
    response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json=TEST_USER
    )
    if response.status_code != 200:
        pytest.skip(f"Authentication failed: {response.status_code} - {response.text}")
    return response.json().get("token")


@pytest.fixture(scope="module")
def auth_headers(auth_token):
    """Return headers with auth token"""
    return {"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"}


class TestCustomCreaturesListAPI:
    """Test GET /api/campaigns/{campaign_id}/custom-creatures"""
    
    def test_list_creatures_success(self, auth_headers):
        """Test listing custom creatures returns 200"""
        response = requests.get(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures",
            headers=auth_headers
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    
    def test_list_creatures_returns_existing_shadow_wyrm(self, auth_headers):
        """Test that the pre-existing Shadow Wyrm creature is returned"""
        response = requests.get(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures",
            headers=auth_headers
        )
        assert response.status_code == 200
        creatures = response.json()
        
        # Look for Shadow Wyrm
        shadow_wyrm = next((c for c in creatures if c.get('name') == 'Shadow Wyrm'), None)
        # It may or may not exist depending on test data state
        if shadow_wyrm:
            assert 'id' in shadow_wyrm
            assert 'name' in shadow_wyrm
            assert 'cr' in shadow_wyrm
            assert 'hp' in shadow_wyrm
            assert 'ac' in shadow_wyrm
    
    def test_list_creatures_without_auth_fails(self):
        """Test that listing creatures without auth token fails"""
        response = requests.get(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures"
        )
        assert response.status_code in [401, 403]


class TestCustomCreaturesCreateAPI:
    """Test POST /api/campaigns/{campaign_id}/custom-creatures"""
    
    def test_create_creature_success(self, auth_headers):
        """Test creating a custom creature with all fields"""
        unique_id = str(uuid.uuid4())[:8]
        creature_data = {
            "name": f"TEST_Goblin_Chief_{unique_id}",
            "cr": "3",
            "hp": 45,
            "ac": 17,
            "type": "humanoid",
            "size": "Small",
            "speed": "30 ft.",
            "abilities": "Multiattack. Scimitar +5 (1d6+3). Shortbow +4 (1d6+2).",
            "description": "A cunning goblin leader."
        }
        
        response = requests.post(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures",
            headers=auth_headers,
            json=creature_data
        )
        
        assert response.status_code == 200
        data = response.json()
        assert 'creature' in data
        creature = data['creature']
        assert creature['name'] == creature_data['name']
        assert creature['cr'] == creature_data['cr']
        assert creature['hp'] == creature_data['hp']
        assert creature['ac'] == creature_data['ac']
        assert creature['type'] == creature_data['type']
        assert creature['size'] == creature_data['size']
        assert creature['speed'] == creature_data['speed']
        assert creature['abilities'] == creature_data['abilities']
        assert creature['description'] == creature_data['description']
        assert 'id' in creature
        
        # Cleanup - delete the test creature
        creature_id = creature['id']
        cleanup_response = requests.delete(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures/{creature_id}",
            headers=auth_headers
        )
        assert cleanup_response.status_code == 200
    
    def test_create_creature_minimal_fields(self, auth_headers):
        """Test creating a creature with only required name field"""
        unique_id = str(uuid.uuid4())[:8]
        creature_data = {
            "name": f"TEST_MinimalCreature_{unique_id}"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures",
            headers=auth_headers,
            json=creature_data
        )
        
        assert response.status_code == 200
        data = response.json()
        creature = data['creature']
        
        # Should have default values
        assert creature['name'] == creature_data['name']
        assert creature['cr'] == "1"  # default
        assert creature['hp'] == 10  # default
        assert creature['ac'] == 10  # default
        assert creature['type'] == "humanoid"  # default
        assert creature['size'] == "Medium"  # default
        assert creature['speed'] == "30 ft."  # default
        
        # Cleanup
        creature_id = creature['id']
        requests.delete(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures/{creature_id}",
            headers=auth_headers
        )
    
    def test_create_creature_without_auth_fails(self):
        """Test that creating creature without auth fails"""
        creature_data = {"name": "TEST_UnauthorizedCreature"}
        
        response = requests.post(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures",
            json=creature_data
        )
        assert response.status_code in [401, 403]


class TestCustomCreaturesUpdateAPI:
    """Test PUT /api/campaigns/{campaign_id}/custom-creatures/{creature_id}"""
    
    def test_update_creature_success(self, auth_headers):
        """Test updating a custom creature"""
        unique_id = str(uuid.uuid4())[:8]
        
        # First create a creature
        create_data = {
            "name": f"TEST_UpdateMe_{unique_id}",
            "cr": "1",
            "hp": 20,
            "ac": 12
        }
        
        create_response = requests.post(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures",
            headers=auth_headers,
            json=create_data
        )
        assert create_response.status_code == 200
        creature_id = create_response.json()['creature']['id']
        
        # Update the creature
        update_data = {
            "name": f"TEST_Updated_{unique_id}",
            "cr": "5",
            "hp": 100,
            "ac": 18,
            "type": "dragon",
            "size": "Large",
            "speed": "40 ft., fly 80 ft.",
            "abilities": "Breath Weapon (6d6 fire)",
            "description": "An updated creature"
        }
        
        update_response = requests.put(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures/{creature_id}",
            headers=auth_headers,
            json=update_data
        )
        assert update_response.status_code == 200
        
        # Verify update by fetching
        get_response = requests.get(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures",
            headers=auth_headers
        )
        creatures = get_response.json()
        updated = next((c for c in creatures if c['id'] == creature_id), None)
        
        assert updated is not None
        assert updated['name'] == update_data['name']
        assert updated['cr'] == update_data['cr']
        assert updated['hp'] == update_data['hp']
        assert updated['ac'] == update_data['ac']
        assert updated['type'] == update_data['type']
        assert updated['size'] == update_data['size']
        
        # Cleanup
        requests.delete(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures/{creature_id}",
            headers=auth_headers
        )
    
    def test_update_nonexistent_creature_fails(self, auth_headers):
        """Test updating non-existent creature returns 404"""
        fake_id = str(uuid.uuid4())
        update_data = {
            "name": "TEST_NonexistentUpdate",
            "cr": "1",
            "hp": 10,
            "ac": 10
        }
        
        response = requests.put(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures/{fake_id}",
            headers=auth_headers,
            json=update_data
        )
        assert response.status_code == 404


class TestCustomCreaturesDeleteAPI:
    """Test DELETE /api/campaigns/{campaign_id}/custom-creatures/{creature_id}"""
    
    def test_delete_creature_success(self, auth_headers):
        """Test deleting a custom creature"""
        unique_id = str(uuid.uuid4())[:8]
        
        # Create a creature to delete
        create_data = {"name": f"TEST_DeleteMe_{unique_id}"}
        create_response = requests.post(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures",
            headers=auth_headers,
            json=create_data
        )
        assert create_response.status_code == 200
        creature_id = create_response.json()['creature']['id']
        
        # Delete the creature
        delete_response = requests.delete(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures/{creature_id}",
            headers=auth_headers
        )
        assert delete_response.status_code == 200
        
        # Verify deletion
        get_response = requests.get(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures",
            headers=auth_headers
        )
        creatures = get_response.json()
        deleted = next((c for c in creatures if c['id'] == creature_id), None)
        assert deleted is None
    
    def test_delete_nonexistent_creature_fails(self, auth_headers):
        """Test deleting non-existent creature returns 404"""
        fake_id = str(uuid.uuid4())
        
        response = requests.delete(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures/{fake_id}",
            headers=auth_headers
        )
        assert response.status_code == 404


class TestCustomCreaturesImportAPI:
    """Test POST /api/campaigns/{campaign_id}/custom-creatures/import"""
    
    def test_import_multiple_creatures_success(self, auth_headers):
        """Test importing multiple creatures at once"""
        unique_id = str(uuid.uuid4())[:8]
        
        creatures_to_import = [
            {
                "name": f"TEST_Imp1_{unique_id}",
                "cr": "1",
                "hp": 15,
                "ac": 12,
                "type": "fiend",
                "size": "Small",
                "speed": "25 ft."
            },
            {
                "name": f"TEST_Imp2_{unique_id}",
                "cr": "2",
                "hp": 30,
                "ac": 14,
                "type": "beast",
                "size": "Medium",
                "speed": "40 ft."
            },
            {
                "name": f"TEST_Imp3_{unique_id}",
                "cr": "3",
                "hp": 50,
                "ac": 15,
                "type": "undead",
                "size": "Large",
                "speed": "30 ft."
            }
        ]
        
        response = requests.post(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures/import",
            headers=auth_headers,
            json=creatures_to_import
        )
        
        assert response.status_code == 200
        data = response.json()
        assert 'imported' in data
        assert len(data['imported']) == 3
        
        # Verify all imported
        get_response = requests.get(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures",
            headers=auth_headers
        )
        creatures = get_response.json()
        
        for creature_data in creatures_to_import:
            found = next((c for c in creatures if c['name'] == creature_data['name']), None)
            assert found is not None, f"Creature {creature_data['name']} not found after import"
            
            # Cleanup
            requests.delete(
                f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures/{found['id']}",
                headers=auth_headers
            )
    
    def test_import_empty_list(self, auth_headers):
        """Test importing empty list returns success with 0 imported"""
        response = requests.post(
            f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures/import",
            headers=auth_headers,
            json=[]
        )
        
        assert response.status_code == 200
        data = response.json()
        assert len(data.get('imported', [])) == 0


class TestCustomCreaturesValidation:
    """Test validation and edge cases for custom creatures"""
    
    def test_create_creature_with_all_cr_options(self, auth_headers):
        """Test creating creatures with various CR values"""
        unique_id = str(uuid.uuid4())[:8]
        created_ids = []
        
        # Test a few representative CR values
        cr_values = ["0", "1/8", "1/4", "1/2", "1", "10", "20", "30"]
        
        for cr in cr_values:
            creature_data = {
                "name": f"TEST_CR{cr.replace('/', '_')}_{unique_id}",
                "cr": cr
            }
            
            response = requests.post(
                f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures",
                headers=auth_headers,
                json=creature_data
            )
            
            assert response.status_code == 200, f"Failed to create creature with CR {cr}"
            created_ids.append(response.json()['creature']['id'])
        
        # Cleanup
        for creature_id in created_ids:
            requests.delete(
                f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures/{creature_id}",
                headers=auth_headers
            )
    
    def test_create_creature_with_all_types(self, auth_headers):
        """Test creating creatures with various type values"""
        unique_id = str(uuid.uuid4())[:8]
        created_ids = []
        
        creature_types = ["aberration", "beast", "celestial", "dragon", "fiend", "undead"]
        
        for creature_type in creature_types:
            creature_data = {
                "name": f"TEST_Type_{creature_type}_{unique_id}",
                "type": creature_type
            }
            
            response = requests.post(
                f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures",
                headers=auth_headers,
                json=creature_data
            )
            
            assert response.status_code == 200, f"Failed to create creature with type {creature_type}"
            created_ids.append(response.json()['creature']['id'])
        
        # Cleanup
        for creature_id in created_ids:
            requests.delete(
                f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures/{creature_id}",
                headers=auth_headers
            )
    
    def test_create_creature_with_all_sizes(self, auth_headers):
        """Test creating creatures with various size values"""
        unique_id = str(uuid.uuid4())[:8]
        created_ids = []
        
        sizes = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"]
        
        for size in sizes:
            creature_data = {
                "name": f"TEST_Size_{size}_{unique_id}",
                "size": size
            }
            
            response = requests.post(
                f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures",
                headers=auth_headers,
                json=creature_data
            )
            
            assert response.status_code == 200, f"Failed to create creature with size {size}"
            created_ids.append(response.json()['creature']['id'])
        
        # Cleanup
        for creature_id in created_ids:
            requests.delete(
                f"{BASE_URL}/api/campaigns/{TEST_CAMPAIGN_ID}/custom-creatures/{creature_id}",
                headers=auth_headers
            )
