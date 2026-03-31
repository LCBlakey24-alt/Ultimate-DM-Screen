"""Authentication and subscription utilities."""
import jwt
import bcrypt
import hashlib
import uuid
from datetime import datetime, timezone, timedelta
from typing import Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from config import db, JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION_HOURS, security, ADMIN_USERNAMES


def create_token(username: str) -> str:
    payload = {
        'sub': username,
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS),
        'iat': datetime.now(timezone.utc)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username = payload.get('sub')
        if username is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        user = await db.users.find_one({'username': username}, {'_id': 0})
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


async def verify_campaign_ownership(campaign_id: str, username: str) -> None:
    campaign = await db.campaigns.find_one({'id': campaign_id, 'dm_user_id': username}, {'_id': 1})
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found or access denied")


async def verify_campaign_membership(campaign_id: str, username: str) -> dict:
    campaign = await db.campaigns.find_one({'id': campaign_id}, {'_id': 0})
    if not campaign:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    if campaign.get('dm_user_id') == username:
        return campaign
    player_character = await db.player_characters.find_one({
        'user_id': username, 'campaign_id': campaign_id
    }, {'_id': 1})
    if player_character:
        return campaign
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You must be a member of this campaign")


async def is_admin(username: str) -> bool:
    return username in ADMIN_USERNAMES


def generate_referral_code(username: str) -> str:
    base = f"{username}-{uuid.uuid4().hex[:4]}"
    code = hashlib.md5(base.encode()).hexdigest()[:8].upper()
    return f"ROOK-{code}"


async def get_user_subscription(username: str) -> dict:
    """Get user subscription status with expiry checks and AI call resets."""
    from models import SubscriptionTier
    user = await db.users.find_one({'username': username})
    if not user:
        return None

    subscription = user.get('subscription', SubscriptionTier().model_dump())

    # Check if promo code access has expired
    promo_expires = subscription.get('promo_expires_at')
    if promo_expires and subscription.get('promo_code_used'):
        expires_dt = datetime.fromisoformat(promo_expires.replace('Z', '+00:00'))
        if datetime.now(timezone.utc) >= expires_dt:
            subscription['tier'] = 'free'
            subscription['subscription_status'] = 'expired'
            await db.users.update_one(
                {'username': username},
                {'$set': {
                    'subscription.tier': 'free',
                    'subscription.subscription_status': 'expired',
                    'subscription.promo_expires_at': None
                }}
            )

    # Check if referral/other premium has expired
    premium_expires = subscription.get('premium_expires_at')
    if premium_expires and not subscription.get('promo_code_used') and subscription.get('tier') != 'free':
        expires_dt = datetime.fromisoformat(premium_expires.replace('Z', '+00:00'))
        if datetime.now(timezone.utc) >= expires_dt:
            subscription['tier'] = 'free'
            subscription['subscription_status'] = 'expired'
            await db.users.update_one(
                {'username': username},
                {'$set': {
                    'subscription.tier': 'free',
                    'subscription.subscription_status': 'expired'
                }}
            )

    # Reset AI calls monthly
    reset_date = subscription.get('ai_calls_reset_date')
    if reset_date:
        reset_dt = datetime.fromisoformat(reset_date.replace('Z', '+00:00'))
        if datetime.now(timezone.utc) >= reset_dt:
            subscription['ai_calls_this_month'] = 0
            next_reset = datetime.now(timezone.utc) + timedelta(days=30)
            subscription['ai_calls_reset_date'] = next_reset.isoformat()
            await db.users.update_one(
                {'username': username},
                {'$set': {'subscription': subscription}}
            )
    else:
        next_reset = datetime.now(timezone.utc) + timedelta(days=30)
        subscription['ai_calls_reset_date'] = next_reset.isoformat()
        await db.users.update_one(
            {'username': username},
            {'$set': {'subscription': subscription}}
        )

    return subscription


async def check_premium_feature(username: str, feature: str = 'ai') -> bool:
    """Check if user can access premium features based on subscription."""
    from models import SUBSCRIPTION_PLANS
    subscription = await get_user_subscription(username)
    tier = subscription.get('tier', 'free')
    plan = SUBSCRIPTION_PLANS.get(tier, SUBSCRIPTION_PLANS['free'])

    if tier == 'adventurer' and subscription.get('subscription_status') == 'active':
        return True

    if feature == 'ai':
        limit = plan.get('ai_calls_per_month', 5)
        used = subscription.get('ai_calls_this_month', 0)
        return limit == -1 or used < limit

    return False


async def increment_ai_usage(username: str):
    """Increment AI call counter for free tier users."""
    subscription = await get_user_subscription(username)
    if subscription.get('tier') == 'free':
        await db.users.update_one(
            {'username': username},
            {'$inc': {'subscription.ai_calls_this_month': 1}}
        )


async def get_campaign_rule_system(campaign_id: str) -> Dict[str, Any]:
    """Get the rule system for a campaign."""
    campaign = await db.campaigns.find_one({'id': campaign_id}, {'_id': 0})
    if not campaign:
        return None
    system_name = campaign.get('system', 'Fantasy d20')
    system = await db.rule_systems.find_one({'name': {'$regex': system_name, '$options': 'i'}}, {'_id': 0})
    if not system:
        system = await db.rule_systems.find_one({'short_code': {'$regex': system_name.replace(' ', '_').lower(), '$options': 'i'}}, {'_id': 0})
    return system
