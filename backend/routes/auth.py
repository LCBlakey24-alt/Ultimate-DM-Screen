"""Authentication routes: register, login, password reset, account management."""
from fastapi import APIRouter, HTTPException, Depends, status
from config import db, RESEND_API_KEY, SENDER_EMAIL, APP_URL, RESERVED_USERNAMES, logger
from utils.auth import (
    get_current_user, hash_password, verify_password, create_token,
    generate_referral_code
)
from models import (
    UserRegister, UserLogin, TokenResponse, ForgotPasswordRequest,
    ResetPasswordRequest, ChangePasswordRequest, UpdateAccountRequest,
    SubscriptionTier
)
import re
import uuid
import secrets
from datetime import datetime, timezone, timedelta
import resend

if RESEND_API_KEY and RESEND_API_KEY != 'your_resend_api_key_here':
    resend.api_key = RESEND_API_KEY

router = APIRouter()

USERNAME_RE = re.compile(r"^[a-zA-Z0-9_-]{3,24}$")


def validate_username(username: str) -> str:
    username = (username or "").strip()
    username_lower = username.lower()
    if not USERNAME_RE.fullmatch(username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username must be 3-24 characters and can only use letters, numbers, underscores, or hyphens"
        )
    if username_lower in RESERVED_USERNAMES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="That username is reserved")
    return username


def validate_password(password: str) -> None:
    if not password or len(password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must be at least 8 characters long")
    if len(password) > 128:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password is too long")
    if password.strip() != password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password cannot start or end with spaces")


def generate_referral_code(username: str) -> str:
    """Generate a unique referral code for a user"""
    base = f"{username}-{uuid.uuid4().hex[:4]}"
    return base.upper()[:12]

@router.post("/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    username = validate_username(user_data.username)
    username_lower = username.lower()
    validate_password(user_data.password)

    # Check if email already exists
    existing_email = await db.users.find_one({'email': user_data.email.lower()})
    if existing_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    # Check if username already exists, case-insensitively
    existing_user = await db.users.find_one({
        'username': {'$regex': f"^{re.escape(username)}$", '$options': 'i'}
    })
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
    
    # Generate unique referral code for new user
    referral_code = generate_referral_code(username)
    
    # Check if they were referred by someone
    referred_by = None
    if user_data.referral_code:
        referrer = await db.users.find_one({'subscription.referral_code': user_data.referral_code.upper()})
        if referrer:
            referred_by = referrer['username']
    
    # Create subscription with referral code. Admin/premium access must be granted separately, not by registering a reserved username.
    subscription = SubscriptionTier(referral_code=referral_code, referred_by=referred_by)
    
    user_doc = {
        'id': str(uuid.uuid4()),
        'email': user_data.email.lower(),
        'username': username,
        'username_lower': username_lower,
        'password_hash': hash_password(user_data.password),
        'created_at': datetime.now(timezone.utc).isoformat(),
        'subscription': subscription.model_dump()
    }
    
    await db.users.insert_one(user_doc)
    
    # If referred, give the referrer 1 free month!
    if referred_by:
        # Calculate new expiration date for referrer
        referrer_user = await db.users.find_one({'username': referred_by})
        referrer_sub = referrer_user.get('subscription', {})
        
        current_expires = referrer_sub.get('premium_expires_at')
        if current_expires:
            expires_dt = datetime.fromisoformat(current_expires.replace('Z', '+00:00'))
            if expires_dt < datetime.now(timezone.utc):
                expires_dt = datetime.now(timezone.utc)
        else:
            expires_dt = datetime.now(timezone.utc)
        
        # Add 30 days
        new_expires = expires_dt + timedelta(days=30)
        
        await db.users.update_one(
            {'username': referred_by},
            {
                '$inc': {
                    'subscription.referral_count': 1,
                    'subscription.free_months_earned': 1
                },
                '$set': {
                    'subscription.tier': 'adventurer',
                    'subscription.subscription_status': 'active',
                    'subscription.premium_expires_at': new_expires.isoformat()
                }
            }
        )
    
    token = create_token(username)
    
    return TokenResponse(token=token, username=username, email=user_data.email.lower())

@router.post("/auth/login", response_model=TokenResponse)
async def login(user_data: UserLogin):
    user = await db.users.find_one({'email': user_data.email.lower()})
    if not user or not verify_password(user_data.password, user['password_hash']):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    token = create_token(user['username'])
    return TokenResponse(token=token, username=user['username'], email=user['email'])

# ==================== PASSWORD RESET ====================

@router.post("/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    """Send password reset email"""
    user = await db.users.find_one({'email': request.email.lower()})
    
    # Always return success to prevent email enumeration
    if not user:
        return {"message": "If an account exists with this email, a reset link has been sent"}
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    
    # Store reset token in database
    await db.password_resets.delete_many({'email': request.email.lower()})  # Remove old tokens
    await db.password_resets.insert_one({
        'email': request.email.lower(),
        'token': reset_token,
        'expires_at': expires_at.isoformat(),
        'created_at': datetime.now(timezone.utc).isoformat()
    })
    
    # Send email
    reset_link = f"{APP_URL}/reset-password?token={reset_token}"
    
    if RESEND_API_KEY and RESEND_API_KEY != 'your_resend_api_key_here':
        try:
            resend.Emails.send({
                "from": SENDER_EMAIL,
                "to": [request.email.lower()],
                "subject": "Reset Your Rookie Quest Keeper Password",
                "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #DC2626;">Rookie Quest Keeper</h1>
                    <h2>Password Reset Request</h2>
                    <p>You requested to reset your password. Click the button below to set a new password:</p>
                    <a href="{reset_link}" style="display: inline-block; background: #DC2626; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">
                        Reset Password
                    </a>
                    <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">Rookie Quest Keeper - Your Ultimate GM Companion</p>
                </div>
                """
            })
            logger.info(f"Password reset email sent to {request.email}")
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            # Still return success to prevent enumeration
    else:
        logger.warning("Resend not configured; password reset email was not sent")
    
    return {"message": "If an account exists with this email, a reset link has been sent"}

@router.post("/auth/reset-password")
async def reset_password(request: ResetPasswordRequest):
    """Reset password using token"""
    validate_password(request.new_password)
    reset_record = await db.password_resets.find_one({'token': request.token})
    
    if not reset_record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Check expiration
    expires_at = datetime.fromisoformat(reset_record['expires_at'].replace('Z', '+00:00'))
    if datetime.now(timezone.utc) > expires_at:
        await db.password_resets.delete_one({'token': request.token})
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    # Update password
    await db.users.update_one(
        {'email': reset_record['email']},
        {'$set': {'password_hash': hash_password(request.new_password)}}
    )
    
    # Delete used token
    await db.password_resets.delete_one({'token': request.token})
    
    return {"message": "Password reset successfully"}

# ==================== ACCOUNT MANAGEMENT ====================

@router.post("/account/change-password")
async def change_password(request: ChangePasswordRequest, username: str = Depends(get_current_user)):
    """Change password for logged-in user"""
    validate_password(request.new_password)
    user = await db.users.find_one({'username': username})
    
    if not verify_password(request.current_password, user['password_hash']):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    await db.users.update_one(
        {'username': username},
        {'$set': {'password_hash': hash_password(request.new_password)}}
    )
    
    return {"message": "Password changed successfully"}

@router.put("/account/update")
async def update_account(request: UpdateAccountRequest, username: str = Depends(get_current_user)):
    """Update username or email"""
    updates = {}
    
    if request.username and request.username != username:
        new_username = validate_username(request.username)
        # Check if new username is taken
        existing = await db.users.find_one({
            'username': {'$regex': f"^{re.escape(new_username)}$", '$options': 'i'}
        })
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
        updates['username'] = new_username
        updates['username_lower'] = new_username.lower()
        
        # Also update username in campaigns
        await db.campaigns.update_many(
            {'user_id': username},
            {'$set': {'user_id': new_username}}
        )
    
    if request.email:
        # Check if new email is taken
        existing = await db.users.find_one({'email': request.email.lower()})
        if existing and existing['username'] != username:
            raise HTTPException(status_code=400, detail="Email already registered")
        updates['email'] = request.email.lower()
    
    if updates:
        await db.users.update_one({'username': username}, {'$set': updates})
    
    # Get updated user
    new_username = updates.get('username', username)
    user = await db.users.find_one({'username': new_username})
    
    # Generate new token if username changed
    token = create_token(new_username)
    
    return {
        "message": "Account updated successfully",
        "token": token,
        "username": new_username,
        "email": user['email']
    }

@router.get("/account/profile")
async def get_account_profile(username: str = Depends(get_current_user)):
    """Get current user's account details"""
    user = await db.users.find_one({'username': username}, {'_id': 0, 'password_hash': 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/account/delete")
async def delete_account(username: str = Depends(get_current_user)):
    """Delete user account and all associated data"""
    # Delete user's campaigns
    await db.campaigns.delete_many({'user_id': username})
    
    # Delete user's custom creatures
    await db.custom_creatures.delete_many({'created_by': username})
    
    # Delete user's reviews
    await db.reviews.delete_many({'username': username})
    
    # Delete the user
    await db.users.delete_one({'username': username})
    
    return {"message": "Account deleted successfully"}

@router.get("/auth/me")
async def get_me(username: str = Depends(get_current_user)):
    user = await db.users.find_one({'username': username}, {'_id': 0, 'password_hash': 0})
    return user
