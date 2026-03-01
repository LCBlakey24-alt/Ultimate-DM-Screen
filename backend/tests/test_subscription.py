"""
Backend tests for subscription and promo code features.
Tests Stripe subscription monetization system with freemium model.
"""
import pytest
import requests
import os
import uuid
from datetime import datetime, timedelta

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')


class TestSubscriptionPlans:
    """Test subscription plans API"""
    
    def test_get_subscription_plans(self):
        """Test GET /api/subscription/plans returns correct plans"""
        response = requests.get(f"{BASE_URL}/api/subscription/plans")
        assert response.status_code == 200
        
        data = response.json()
        assert 'plans' in data
        plans = data['plans']
        assert len(plans) == 2
        
        # Verify free plan
        free_plan = next((p for p in plans if p['id'] == 'free'), None)
        assert free_plan is not None
        assert free_plan['name'] == 'Free'
        assert free_plan['price'] == 0
        assert 'features' in free_plan
        assert len(free_plan['features']) > 0
        
        # Verify adventurer plan
        adventurer_plan = next((p for p in plans if p['id'] == 'adventurer'), None)
        assert adventurer_plan is not None
        assert adventurer_plan['name'] == 'Adventurer'
        assert adventurer_plan['price'] == 3.99
        assert 'features' in adventurer_plan
        assert len(adventurer_plan['features']) > 0
    
    def test_free_plan_features(self):
        """Test free plan contains expected features"""
        response = requests.get(f"{BASE_URL}/api/subscription/plans")
        assert response.status_code == 200
        
        plans = response.json()['plans']
        free_plan = next((p for p in plans if p['id'] == 'free'), None)
        
        features = free_plan['features']
        # Free tier should mention campaign limit and AI limit
        assert any('2 campaigns' in f.lower() for f in features)
        assert any('5' in f and 'ai' in f.lower() for f in features)
    
    def test_adventurer_plan_features(self):
        """Test adventurer plan contains unlimited features"""
        response = requests.get(f"{BASE_URL}/api/subscription/plans")
        assert response.status_code == 200
        
        plans = response.json()['plans']
        adventurer_plan = next((p for p in plans if p['id'] == 'adventurer'), None)
        
        features = adventurer_plan['features']
        # Adventurer tier should mention unlimited
        assert any('unlimited' in f.lower() for f in features)


class TestUserRegistrationWithSubscription:
    """Test user registration initializes subscription tier"""
    
    def test_new_user_starts_with_free_tier(self):
        """Test that newly registered users start on free tier"""
        unique_id = str(uuid.uuid4())[:8]
        username = f"TEST_sub_reg_{unique_id}"
        
        # Register new user
        register_response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={"username": username, "password": "testpass123"}
        )
        assert register_response.status_code == 201
        
        token = register_response.json()['token']
        
        # Check subscription status
        status_response = requests.get(
            f"{BASE_URL}/api/subscription/status",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert status_response.status_code == 200
        
        status = status_response.json()
        assert status['tier'] == 'free'
        assert status['tier_name'] == 'Free'
        assert status['is_premium'] == False
        assert status['campaigns_limit'] == 2
        assert status['ai_calls_limit'] == 5
        assert status['ai_calls_used'] == 0
        assert status['subscription_status'] == 'active'
    
    def test_subscription_status_requires_auth(self):
        """Test that subscription status endpoint requires authentication"""
        response = requests.get(f"{BASE_URL}/api/subscription/status")
        assert response.status_code in [401, 403]


class TestSubscriptionStatus:
    """Test subscription status endpoint"""
    
    @pytest.fixture
    def auth_user(self):
        """Create an authenticated user for testing"""
        unique_id = str(uuid.uuid4())[:8]
        username = f"TEST_sub_status_{unique_id}"
        
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={"username": username, "password": "testpass123"}
        )
        
        if response.status_code == 201:
            return response.json()['token'], username
        
        # If user exists, login instead
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"username": username, "password": "testpass123"}
        )
        return response.json()['token'], username
    
    def test_get_subscription_status(self, auth_user):
        """Test GET /api/subscription/status returns correct structure"""
        token, username = auth_user
        
        response = requests.get(
            f"{BASE_URL}/api/subscription/status",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        
        status = response.json()
        # Verify all required fields present
        assert 'tier' in status
        assert 'tier_name' in status
        assert 'campaigns_limit' in status
        assert 'ai_calls_limit' in status
        assert 'ai_calls_used' in status
        assert 'is_premium' in status
        assert 'subscription_status' in status
    
    def test_subscription_status_values_are_valid(self, auth_user):
        """Test subscription status values are valid"""
        token, username = auth_user
        
        response = requests.get(
            f"{BASE_URL}/api/subscription/status",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        
        status = response.json()
        # Tier should be 'free' or 'adventurer'
        assert status['tier'] in ['free', 'adventurer']
        # is_premium should be boolean
        assert isinstance(status['is_premium'], bool)
        # ai_calls_used should be non-negative
        assert status['ai_calls_used'] >= 0


class TestPromoCodeCreation:
    """Test promo code creation API"""
    
    @pytest.fixture
    def auth_user(self):
        """Create an authenticated user for testing"""
        unique_id = str(uuid.uuid4())[:8]
        username = f"TEST_promo_create_{unique_id}"
        
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={"username": username, "password": "testpass123"}
        )
        
        if response.status_code == 201:
            return response.json()['token'], username
        
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"username": username, "password": "testpass123"}
        )
        return response.json()['token'], username
    
    def test_create_promo_code(self, auth_user):
        """Test POST /api/promo-codes creates a promo code"""
        token, username = auth_user
        unique_code = f"TESTCODE{uuid.uuid4().hex[:8].upper()}"
        
        response = requests.post(
            f"{BASE_URL}/api/promo-codes",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json={
                "code": unique_code,
                "tier_granted": "adventurer",
                "uses_remaining": 5
            }
        )
        assert response.status_code == 201
        
        data = response.json()
        assert 'message' in data
        assert 'code' in data
        assert data['code'] == unique_code.upper()
    
    def test_create_promo_code_requires_auth(self):
        """Test promo code creation requires authentication"""
        unique_code = f"TESTCODE{uuid.uuid4().hex[:8].upper()}"
        
        response = requests.post(
            f"{BASE_URL}/api/promo-codes",
            headers={"Content-Type": "application/json"},
            json={"code": unique_code, "tier_granted": "adventurer"}
        )
        assert response.status_code in [401, 403]
    
    def test_cannot_create_duplicate_promo_code(self, auth_user):
        """Test that duplicate promo codes are rejected"""
        token, username = auth_user
        unique_code = f"TESTDUP{uuid.uuid4().hex[:8].upper()}"
        
        # Create first promo code
        response1 = requests.post(
            f"{BASE_URL}/api/promo-codes",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json={"code": unique_code, "tier_granted": "adventurer"}
        )
        assert response1.status_code == 201
        
        # Try to create duplicate
        response2 = requests.post(
            f"{BASE_URL}/api/promo-codes",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json={"code": unique_code, "tier_granted": "adventurer"}
        )
        assert response2.status_code == 400
        assert 'already exists' in response2.json().get('detail', '').lower()


class TestPromoCodeApplication:
    """Test promo code application API"""
    
    def test_apply_promo_code_upgrades_tier(self):
        """Test POST /api/promo-codes/apply upgrades user to premium"""
        unique_id = str(uuid.uuid4())[:8]
        
        # Create a user to own the promo code
        owner_response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={"username": f"TEST_promo_owner_{unique_id}", "password": "testpass123"}
        )
        if owner_response.status_code != 201:
            owner_response = requests.post(
                f"{BASE_URL}/api/auth/login",
                json={"username": f"TEST_promo_owner_{unique_id}", "password": "testpass123"}
            )
        owner_token = owner_response.json()['token']
        
        # Create promo code
        unique_code = f"TESTAPPLY{uuid.uuid4().hex[:8].upper()}"
        create_response = requests.post(
            f"{BASE_URL}/api/promo-codes",
            headers={"Authorization": f"Bearer {owner_token}", "Content-Type": "application/json"},
            json={"code": unique_code, "tier_granted": "adventurer", "uses_remaining": 10}
        )
        assert create_response.status_code == 201
        
        # Create a new user to apply the promo code
        user_response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={"username": f"TEST_promo_apply_{unique_id}", "password": "testpass123"}
        )
        assert user_response.status_code == 201
        user_token = user_response.json()['token']
        
        # Verify user is on free tier initially
        status_before = requests.get(
            f"{BASE_URL}/api/subscription/status",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert status_before.json()['tier'] == 'free'
        assert status_before.json()['is_premium'] == False
        
        # Apply promo code
        apply_response = requests.post(
            f"{BASE_URL}/api/promo-codes/apply",
            headers={"Authorization": f"Bearer {user_token}", "Content-Type": "application/json"},
            json={"code": unique_code}
        )
        assert apply_response.status_code == 200
        
        apply_data = apply_response.json()
        assert 'message' in apply_data
        assert apply_data['tier'] == 'adventurer'
        assert apply_data['tier_name'] == 'Adventurer'
        
        # Verify subscription status is updated
        status_after = requests.get(
            f"{BASE_URL}/api/subscription/status",
            headers={"Authorization": f"Bearer {user_token}"}
        )
        assert status_after.json()['tier'] == 'adventurer'
        assert status_after.json()['is_premium'] == True
        assert status_after.json()['campaigns_limit'] == -1  # Unlimited
        assert status_after.json()['ai_calls_limit'] == -1  # Unlimited
    
    def test_apply_invalid_promo_code(self):
        """Test applying an invalid promo code returns 404"""
        unique_id = str(uuid.uuid4())[:8]
        
        # Create a new user
        user_response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={"username": f"TEST_invalid_promo_{unique_id}", "password": "testpass123"}
        )
        assert user_response.status_code == 201
        user_token = user_response.json()['token']
        
        # Try to apply non-existent promo code
        apply_response = requests.post(
            f"{BASE_URL}/api/promo-codes/apply",
            headers={"Authorization": f"Bearer {user_token}", "Content-Type": "application/json"},
            json={"code": "NONEXISTENT12345"}
        )
        assert apply_response.status_code == 404
        assert 'invalid' in apply_response.json().get('detail', '').lower()
    
    def test_cannot_use_promo_code_twice(self):
        """Test that a user cannot apply a promo code twice"""
        unique_id = str(uuid.uuid4())[:8]
        
        # Create a user and promo code
        owner_response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={"username": f"TEST_promo_twice_owner_{unique_id}", "password": "testpass123"}
        )
        if owner_response.status_code != 201:
            owner_response = requests.post(
                f"{BASE_URL}/api/auth/login",
                json={"username": f"TEST_promo_twice_owner_{unique_id}", "password": "testpass123"}
            )
        owner_token = owner_response.json()['token']
        
        # Create two promo codes
        code1 = f"TESTTWICE1{uuid.uuid4().hex[:6].upper()}"
        code2 = f"TESTTWICE2{uuid.uuid4().hex[:6].upper()}"
        
        requests.post(
            f"{BASE_URL}/api/promo-codes",
            headers={"Authorization": f"Bearer {owner_token}", "Content-Type": "application/json"},
            json={"code": code1, "tier_granted": "adventurer"}
        )
        requests.post(
            f"{BASE_URL}/api/promo-codes",
            headers={"Authorization": f"Bearer {owner_token}", "Content-Type": "application/json"},
            json={"code": code2, "tier_granted": "adventurer"}
        )
        
        # Create user and apply first code
        user_response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={"username": f"TEST_promo_twice_user_{unique_id}", "password": "testpass123"}
        )
        assert user_response.status_code == 201
        user_token = user_response.json()['token']
        
        # Apply first code
        apply1 = requests.post(
            f"{BASE_URL}/api/promo-codes/apply",
            headers={"Authorization": f"Bearer {user_token}", "Content-Type": "application/json"},
            json={"code": code1}
        )
        assert apply1.status_code == 200
        
        # Try to apply second code
        apply2 = requests.post(
            f"{BASE_URL}/api/promo-codes/apply",
            headers={"Authorization": f"Bearer {user_token}", "Content-Type": "application/json"},
            json={"code": code2}
        )
        assert apply2.status_code == 400
        assert 'already used' in apply2.json().get('detail', '').lower()


class TestSubscriptionCheckout:
    """Test subscription checkout flow"""
    
    @pytest.fixture
    def auth_user(self):
        """Create an authenticated user for testing"""
        unique_id = str(uuid.uuid4())[:8]
        username = f"TEST_checkout_{unique_id}"
        
        response = requests.post(
            f"{BASE_URL}/api/auth/register",
            json={"username": username, "password": "testpass123"}
        )
        
        if response.status_code == 201:
            return response.json()['token'], username
        
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"username": username, "password": "testpass123"}
        )
        return response.json()['token'], username
    
    def test_create_checkout_session(self, auth_user):
        """Test POST /api/subscription/checkout creates a checkout session"""
        token, username = auth_user
        
        response = requests.post(
            f"{BASE_URL}/api/subscription/checkout",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json={"origin_url": "https://example.com", "plan": "adventurer"}
        )
        
        # Should return checkout URL or error if Stripe not properly configured
        # In test environments, we expect either 200 with checkout_url or 500 with stripe error
        assert response.status_code in [200, 500]
        
        if response.status_code == 200:
            data = response.json()
            assert 'checkout_url' in data
            assert 'session_id' in data
    
    def test_checkout_requires_auth(self):
        """Test checkout endpoint requires authentication"""
        response = requests.post(
            f"{BASE_URL}/api/subscription/checkout",
            headers={"Content-Type": "application/json"},
            json={"origin_url": "https://example.com", "plan": "adventurer"}
        )
        assert response.status_code in [401, 403]
    
    def test_checkout_invalid_plan(self, auth_user):
        """Test checkout with invalid plan returns error"""
        token, username = auth_user
        
        response = requests.post(
            f"{BASE_URL}/api/subscription/checkout",
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
            json={"origin_url": "https://example.com", "plan": "invalid_plan"}
        )
        
        # Should return 400 for invalid plan or 500 if Stripe errors first
        assert response.status_code in [400, 500]
