"""Shared configuration, database, and constants for the ROOK backend."""
import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.security import HTTPBearer

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('rook')

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT
JWT_SECRET = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24
security = HTTPBearer()

# Email
RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'noreply@rookiequestkeeper.com')
APP_URL = 'https://rookiequestkeeper.com'

# Stripe
STRIPE_ENABLED = True
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

# Admin
ADMIN_USERNAMES = ["lcblakey24"]

# D&D Constants
SUBCLASS_LEVELS_2014 = {
    'Barbarian': 3, 'Bard': 3, 'Cleric': 1, 'Druid': 2, 'Fighter': 3,
    'Monk': 3, 'Paladin': 3, 'Ranger': 3, 'Rogue': 3, 'Sorcerer': 1,
    'Warlock': 1, 'Wizard': 2
}
SUBCLASS_LEVELS_2024 = {
    'Barbarian': 3, 'Bard': 3, 'Cleric': 3, 'Druid': 3, 'Fighter': 3,
    'Monk': 3, 'Paladin': 3, 'Ranger': 3, 'Rogue': 3, 'Sorcerer': 3,
    'Warlock': 3, 'Wizard': 3
}
HIT_DICE = {
    'Barbarian': 12, 'Fighter': 10, 'Paladin': 10, 'Ranger': 10,
    'Bard': 8, 'Cleric': 8, 'Druid': 8, 'Monk': 8, 'Rogue': 8, 'Warlock': 8,
    'Sorcerer': 6, 'Wizard': 6
}

def get_subclass_unlock_level(class_name: str, edition: str = "2014") -> int:
    if edition == "2024":
        return SUBCLASS_LEVELS_2024.get(class_name, 3)
    return SUBCLASS_LEVELS_2014.get(class_name, 3)
