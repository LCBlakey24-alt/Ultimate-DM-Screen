"""Admin routes: user management, promo codes, reviews, custom creatures."""
from fastapi import APIRouter, HTTPException, Depends, status
from config import db, ADMIN_USERNAMES, logger
from utils.auth import get_current_user, is_admin
from models import (
    SUBSCRIPTION_PLANS, PromoCode, PromoCodeCreate, ApplyPromoCodeRequest,
    Review, ReviewCreate, CustomCreature, CustomCreatureCreate,
    AdminUserUpgrade
)
import uuid
from datetime import datetime, timezone, timedelta

router = APIRouter()


async def verify_admin(username: str):
    # Case-insensitive match so capitalized usernames (e.g. "LCBlakey24") still pass
    admins = {a.lower() for a in ADMIN_USERNAMES}
    if not username or username.lower() not in admins:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")

@router.post("/admin/upgrade-user")
async def admin_upgrade_user(request: AdminUserUpgrade, username: str = Depends(get_current_user)):
    """Admin endpoint to manually upgrade a user's subscription tier"""
    await verify_admin(username)
    
    # Validate tier
    valid_tiers = ['free', 'player', 'gm', 'legendary', 'adventurer']
    if request.new_tier not in valid_tiers:
        raise HTTPException(status_code=400, detail=f"Invalid tier. Must be one of: {', '.join(valid_tiers)}")
    
    # Find target user
    target_user = await db.users.find_one({'username': request.target_username})
    if not target_user:
        # Try by email
        target_user = await db.users.find_one({'email': request.target_username})
    
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Calculate expiration
    if request.duration_days == -1:
        premium_expires_at = None
        is_lifetime = True
    else:
        premium_expires_at = (datetime.now(timezone.utc) + timedelta(days=request.duration_days)).isoformat()
        is_lifetime = False
    
    # Update user subscription
    update_data = {
        'subscription.tier': request.new_tier,
        'subscription.subscription_status': 'active',
        'subscription.admin_upgraded': True,
        'subscription.admin_upgraded_by': username,
        'subscription.admin_upgraded_at': datetime.now(timezone.utc).isoformat(),
        'subscription.admin_upgrade_reason': request.reason
    }
    
    if is_lifetime:
        update_data['subscription.lifetime_access'] = True
        update_data['subscription.premium_expires_at'] = None
    else:
        update_data['subscription.premium_expires_at'] = premium_expires_at
    
    await db.users.update_one(
        {'username': target_user['username']},
        {'$set': update_data}
    )
    
    plan = SUBSCRIPTION_PLANS.get(request.new_tier, SUBSCRIPTION_PLANS['free'])
    
    return {
        "message": f"User {target_user['username']} upgraded to {plan['name']}",
        "username": target_user['username'],
        "email": target_user.get('email'),
        "new_tier": request.new_tier,
        "tier_name": plan['name'],
        "expires_at": premium_expires_at,
        "is_lifetime": is_lifetime
    }

@router.get("/admin/users")
async def admin_get_users(username: str = Depends(get_current_user)):
    """Admin endpoint to list all users with their subscription status"""
    await verify_admin(username)
    
    users = []
    async for user in db.users.find({}, {'_id': 0, 'password_hash': 0}):
        users.append({
            'username': user.get('username'),
            'email': user.get('email'),
            'tier': user.get('subscription', {}).get('tier', 'free'),
            'tier_name': SUBSCRIPTION_PLANS.get(user.get('subscription', {}).get('tier', 'free'), {}).get('name', 'Free'),
            'subscription_status': user.get('subscription', {}).get('subscription_status', 'inactive'),
            'promo_codes_used': user.get('subscription', {}).get('promo_codes_used', []),
            'lifetime_access': user.get('subscription', {}).get('lifetime_access', False),
            'created_at': user.get('created_at')
        })
    
    return users

@router.post("/promo-codes", status_code=status.HTTP_201_CREATED)
async def create_promo_code(promo_data: PromoCodeCreate, username: str = Depends(get_current_user)):
    """Create a new promo code (admin only)"""
    await verify_admin(username)
    
    # Check if code already exists
    existing = await db.promo_codes.find_one({'code': promo_data.code.upper()})
    if existing:
        raise HTTPException(status_code=400, detail="Promo code already exists")
    
    promo = PromoCode(
        code=promo_data.code.upper(),
        tier_granted=promo_data.tier_granted,
        duration_days=promo_data.duration_days,
        uses_remaining=promo_data.uses_remaining,
        expires_at=promo_data.expires_at
    )
    await db.promo_codes.insert_one(promo.model_dump())
    return {"message": "Promo code created", "code": promo.code, "duration_days": promo.duration_days}

@router.post("/promo-codes/apply")
async def apply_promo_code(request: ApplyPromoCodeRequest, username: str = Depends(get_current_user)):
    """Apply a promo code to get free premium access - supports stacking multiple codes"""
    code = request.code.upper().strip()
    
    # Find promo code
    promo = await db.promo_codes.find_one({'code': code})
    if not promo:
        raise HTTPException(status_code=404, detail="Invalid promo code")
    
    # Check if code is active
    if not promo.get('is_active', True):
        raise HTTPException(status_code=400, detail="This promo code is no longer active")
    
    # Check if expired
    if promo.get('expires_at'):
        expires = datetime.fromisoformat(promo['expires_at'].replace('Z', '+00:00'))
        if datetime.now(timezone.utc) > expires:
            raise HTTPException(status_code=400, detail="Promo code has expired")
    
    # Check uses remaining
    uses = promo.get('uses_remaining', -1)
    if uses == 0:
        raise HTTPException(status_code=400, detail="Promo code has no uses remaining")
    
    # Get user's current subscription
    user = await db.users.find_one({'username': username})
    current_sub = user.get('subscription', {}) if user else {}
    
    # Check if user already used THIS SPECIFIC code (prevent re-using same code)
    used_codes = current_sub.get('promo_codes_used', [])
    if code in used_codes:
        raise HTTPException(status_code=400, detail="You have already used this promo code")
    
    # Apply promo code with duration - STACKING LOGIC
    new_tier = promo.get('tier_granted', 'legendary')
    duration_days = promo.get('duration_days', -1)  # Default to lifetime if not specified
    
    # Tier priority: legendary > gm > player > adventurer > free
    tier_priority = {'free': 0, 'player': 1, 'adventurer': 2, 'gm': 3, 'legendary': 4}
    current_tier = current_sub.get('tier', 'free')
    
    # Use higher tier
    if tier_priority.get(new_tier, 0) >= tier_priority.get(current_tier, 0):
        final_tier = new_tier
    else:
        final_tier = current_tier
    
    # Calculate expiration with stacking
    current_expires = current_sub.get('premium_expires_at')
    
    if duration_days == -1:
        # Lifetime code - no expiration
        premium_expires_at = None
        is_lifetime = True
    else:
        is_lifetime = current_sub.get('lifetime_access', False)
        if is_lifetime:
            # Already have lifetime, keep it
            premium_expires_at = None
        elif current_expires:
            # Stack: add new days to existing expiration
            try:
                existing_expires = datetime.fromisoformat(current_expires.replace('Z', '+00:00'))
                # If existing is in the future, add to it; otherwise start from now
                if existing_expires > datetime.now(timezone.utc):
                    premium_expires_at = (existing_expires + timedelta(days=duration_days)).isoformat()
                else:
                    premium_expires_at = (datetime.now(timezone.utc) + timedelta(days=duration_days)).isoformat()
            except:
                premium_expires_at = (datetime.now(timezone.utc) + timedelta(days=duration_days)).isoformat()
        else:
            # No existing expiration, start fresh
            premium_expires_at = (datetime.now(timezone.utc) + timedelta(days=duration_days)).isoformat()
    
    # Track all used promo codes
    used_codes.append(code)
    
    update_data = {
        'subscription.tier': final_tier,
        'subscription.subscription_status': 'active',
        'subscription.promo_codes_used': used_codes,
        'subscription.last_promo_applied': code,
        'subscription.last_promo_applied_at': datetime.now(timezone.utc).isoformat()
    }
    
    if premium_expires_at:
        update_data['subscription.premium_expires_at'] = premium_expires_at
        update_data['subscription.promo_expires_at'] = premium_expires_at
    elif is_lifetime or duration_days == -1:
        # For lifetime, remove any existing expiration
        update_data['subscription.premium_expires_at'] = None
        update_data['subscription.lifetime_access'] = True
    
    await db.users.update_one(
        {'username': username},
        {'$set': update_data}
    )
    
    # Decrement uses if not unlimited
    if uses > 0:
        await db.promo_codes.update_one(
            {'code': code},
            {'$inc': {'uses_remaining': -1}}
        )
    
    plan = SUBSCRIPTION_PLANS.get(tier, SUBSCRIPTION_PLANS['free'])
    
    # Format duration for message
    if duration_days == -1:
        duration_text = "lifetime"
    elif duration_days == 7:
        duration_text = "1 week"
    elif duration_days == 14:
        duration_text = "2 weeks"
    elif duration_days == 30:
        duration_text = "1 month"
    elif duration_days == 60:
        duration_text = "2 months"
    elif duration_days == 90:
        duration_text = "3 months"
    elif duration_days == 180:
        duration_text = "6 months"
    elif duration_days == 365:
        duration_text = "1 year"
    else:
        duration_text = f"{duration_days} days"
    
    return {
        "message": f"Promo code applied! You now have {plan['name']} access for {duration_text}.",
        "tier": tier,
        "tier_name": plan['name'],
        "duration_days": duration_days,
        "expires_at": premium_expires_at
    }

# ============== REVIEWS ==============

@router.post("/reviews")
async def create_review(review_data: ReviewCreate, username: str = Depends(get_current_user)):
    """Submit a review (authenticated users only)"""
    # Validate rating
    if review_data.rating < 1 or review_data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    # Check if user already submitted a review
    existing = await db.reviews.find_one({'username': username})
    if existing:
        raise HTTPException(status_code=400, detail="You have already submitted a review. You can edit your existing review.")
    
    # Auto-approve 4-5 star reviews
    is_approved = review_data.rating >= 4
    is_featured = review_data.rating >= 4  # Auto-feature high ratings
    
    review = Review(
        username=username,
        rating=review_data.rating,
        comment=review_data.comment,
        is_approved=is_approved,
        is_featured=is_featured
    )
    
    await db.reviews.insert_one(review.model_dump())
    return {"message": "Thank you for your review!", "is_featured": is_featured}

@router.put("/reviews")
async def update_review(review_data: ReviewCreate, username: str = Depends(get_current_user)):
    """Update user's own review"""
    if review_data.rating < 1 or review_data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")
    
    existing = await db.reviews.find_one({'username': username})
    if not existing:
        raise HTTPException(status_code=404, detail="You haven't submitted a review yet")
    
    # Re-evaluate approval based on new rating
    is_approved = review_data.rating >= 4
    is_featured = review_data.rating >= 4
    
    await db.reviews.update_one(
        {'username': username},
        {'$set': {
            'rating': review_data.rating,
            'comment': review_data.comment,
            'is_approved': is_approved,
            'is_featured': is_featured
        }}
    )
    return {"message": "Review updated!", "is_featured": is_featured}

@router.get("/reviews/mine")
async def get_my_review(username: str = Depends(get_current_user)):
    """Get the current user's review if they have one"""
    review = await db.reviews.find_one({'username': username}, {'_id': 0})
    return review

@router.get("/reviews/featured")
async def get_featured_reviews():
    """Get featured reviews for landing page (public endpoint)"""
    reviews = await db.reviews.find(
        {'is_featured': True, 'is_approved': True},
        {'_id': 0, 'username': 1, 'rating': 1, 'comment': 1, 'created_at': 1}
    ).sort('created_at', -1).limit(6).to_list(6)
    return reviews

@router.get("/reviews/all")
async def get_all_reviews(username: str = Depends(get_current_user)):
    """Get all reviews (admin only)"""
    await verify_admin(username)
    reviews = await db.reviews.find({}, {'_id': 0}).sort('created_at', -1).to_list(100)
    return reviews

@router.put("/reviews/{review_id}/approve")
async def toggle_review_approval(review_id: str, username: str = Depends(get_current_user)):
    """Toggle review approval status (admin only)"""
    await verify_admin(username)
    
    review = await db.reviews.find_one({'id': review_id})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    new_status = not review.get('is_approved', False)
    await db.reviews.update_one(
        {'id': review_id},
        {'$set': {'is_approved': new_status, 'is_featured': new_status}}
    )
    return {"message": f"Review {'approved' if new_status else 'hidden'}", "is_approved": new_status}

@router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, username: str = Depends(get_current_user)):
    """Delete a review (admin only)"""
    await verify_admin(username)
    
    result = await db.reviews.delete_one({'id': review_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted"}

# ============== CUSTOM CREATURES ==============

@router.get("/campaigns/{campaign_id}/custom-creatures")
async def get_custom_creatures(campaign_id: str, username: str = Depends(get_current_user)):
    """Get all custom creatures for a campaign"""
    creatures = await db.custom_creatures.find(
        {'campaign_id': campaign_id},
        {'_id': 0}
    ).sort('name', 1).to_list(500)
    return creatures

@router.post("/campaigns/{campaign_id}/custom-creatures")
async def create_custom_creature(campaign_id: str, creature_data: CustomCreatureCreate, username: str = Depends(get_current_user)):
    """Create a new custom creature"""
    creature = CustomCreature(
        campaign_id=campaign_id,
        name=creature_data.name,
        cr=creature_data.cr,
        hp=creature_data.hp,
        ac=creature_data.ac,
        type=creature_data.type,
        size=creature_data.size,
        speed=creature_data.speed,
        abilities=creature_data.abilities,
        description=creature_data.description,
        created_by=username
    )
    await db.custom_creatures.insert_one(creature.model_dump())
    return {"message": "Custom creature created!", "creature": creature.model_dump()}

@router.put("/campaigns/{campaign_id}/custom-creatures/{creature_id}")
async def update_custom_creature(campaign_id: str, creature_id: str, creature_data: CustomCreatureCreate, username: str = Depends(get_current_user)):
    """Update a custom creature"""
    result = await db.custom_creatures.update_one(
        {'id': creature_id, 'campaign_id': campaign_id},
        {'$set': {
            'name': creature_data.name,
            'cr': creature_data.cr,
            'hp': creature_data.hp,
            'ac': creature_data.ac,
            'type': creature_data.type,
            'size': creature_data.size,
            'speed': creature_data.speed,
            'abilities': creature_data.abilities,
            'description': creature_data.description
        }}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Creature not found")
    return {"message": "Creature updated!"}

@router.delete("/campaigns/{campaign_id}/custom-creatures/{creature_id}")
async def delete_custom_creature(campaign_id: str, creature_id: str, username: str = Depends(get_current_user)):
    """Delete a custom creature"""
    result = await db.custom_creatures.delete_one({'id': creature_id, 'campaign_id': campaign_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Creature not found")
    return {"message": "Creature deleted!"}

@router.post("/campaigns/{campaign_id}/custom-creatures/import")
async def import_custom_creatures(campaign_id: str, creatures: list[CustomCreatureCreate], username: str = Depends(get_current_user)):
    """Import multiple custom creatures from CSV/JSON data"""
    imported = []
    for creature_data in creatures:
        creature = CustomCreature(
            campaign_id=campaign_id,
            name=creature_data.name,
            cr=creature_data.cr,
            hp=creature_data.hp,
            ac=creature_data.ac,
            type=creature_data.type,
            size=creature_data.size,
            speed=creature_data.speed,
            abilities=creature_data.abilities,
            description=creature_data.description,
            created_by=username
        )
        await db.custom_creatures.insert_one(creature.model_dump())
        imported.append(creature.name)
    return {"message": f"Imported {len(imported)} creatures!", "imported": imported}

@router.get("/subscription/plans")

# ==================== ADMIN ROUTES ====================

@router.get("/admin/check")
async def check_admin_status(username: str = Depends(get_current_user)):
    """Check if current user is admin"""
    return {"is_admin": username.lower() in ADMIN_USERNAMES}

@router.get("/admin/promo-codes")
async def get_all_promo_codes(username: str = Depends(get_current_user)):
    """Get all promo codes (admin only)"""
    await verify_admin(username)
    
    codes = await db.promo_codes.find({}, {'_id': 0}).to_list(100)
    
    # Get stats
    total_users = await db.users.count_documents({})
    total_referrals = await db.users.aggregate([
        {'$group': {'_id': None, 'total': {'$sum': '$subscription.referral_count'}}}
    ]).to_list(1)
    
    return {
        'codes': codes,
        'stats': {
            'total_users': total_users,
            'total_referrals': total_referrals[0]['total'] if total_referrals else 0
        }
    }

@router.delete("/admin/promo-codes/{code_id}")
async def delete_promo_code(code_id: str, username: str = Depends(get_current_user)):
    """Delete a promo code (admin only)"""
    await verify_admin(username)
    
    result = await db.promo_codes.delete_one({'id': code_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Promo code not found")
    return {"message": "Promo code deleted"}


# ==================== IMPERSONATION ====================

@router.post("/admin/users/{target_username}/impersonate")
async def admin_impersonate_user(target_username: str, username: str = Depends(get_current_user)):
    """Admin-only: issue a short-lived JWT for the target user so support can
    reproduce their view. The client should stash its current token before swapping."""
    await verify_admin(username)
    target = await db.users.find_one({'username': target_username}, {'_id': 0})
    if not target:
        # Try by email as a fallback for convenience
        target = await db.users.find_one({'email': target_username}, {'_id': 0})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    from utils.auth import create_token
    token = create_token(target['username'])
    logger.info(f"Admin {username} impersonating {target['username']}")
    return {
        "token": token,
        "username": target['username'],
        "email": target.get('email'),
        "impersonated_by": username
    }


# ==================== CSV EXPORT ====================

def _csv_escape(value) -> str:
    if value is None:
        return ""
    s = str(value)
    if any(ch in s for ch in [',', '"', '\n', '\r']):
        return '"' + s.replace('"', '""') + '"'
    return s


@router.get("/admin/export/users.csv")
async def admin_export_users_csv(username: str = Depends(get_current_user)):
    """Admin-only: stream a CSV of all users (core profile + subscription)."""
    from fastapi.responses import StreamingResponse
    await verify_admin(username)

    async def gen():
        header = ["username", "email", "tier", "tier_name", "subscription_status",
                  "lifetime_access", "ai_calls_this_month", "created_at"]
        yield ",".join(header) + "\n"
        async for user in db.users.find({}, {'_id': 0, 'password_hash': 0}):
            sub = user.get('subscription', {}) or {}
            tier = sub.get('tier', 'free')
            row = [
                _csv_escape(user.get('username')),
                _csv_escape(user.get('email')),
                _csv_escape(tier),
                _csv_escape(SUBSCRIPTION_PLANS.get(tier, {}).get('name', 'Free')),
                _csv_escape(sub.get('subscription_status', 'inactive')),
                _csv_escape(sub.get('lifetime_access', False)),
                _csv_escape(sub.get('ai_calls_this_month', 0)),
                _csv_escape(user.get('created_at')),
            ]
            yield ",".join(row) + "\n"

    return StreamingResponse(
        gen(),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="rook-users.csv"'}
    )


@router.get("/admin/export/campaigns.csv")
async def admin_export_campaigns_csv(username: str = Depends(get_current_user)):
    """Admin-only: stream a CSV of all campaigns."""
    from fastapi.responses import StreamingResponse
    await verify_admin(username)

    async def gen():
        header = ["id", "name", "dm_user_id", "system", "rules_edition",
                  "setting", "player_count", "created_at", "updated_at"]
        yield ",".join(header) + "\n"
        async for c in db.campaigns.find({}, {'_id': 0}):
            players = c.get('players') or []
            row = [
                _csv_escape(c.get('id')),
                _csv_escape(c.get('name')),
                _csv_escape(c.get('dm_user_id')),
                _csv_escape(c.get('system')),
                _csv_escape(c.get('rules_edition', '2024')),
                _csv_escape(c.get('setting')),
                _csv_escape(len(players) if isinstance(players, list) else 0),
                _csv_escape(c.get('created_at')),
                _csv_escape(c.get('updated_at')),
            ]
            yield ",".join(row) + "\n"

    return StreamingResponse(
        gen(),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="rook-campaigns.csv"'}
    )

