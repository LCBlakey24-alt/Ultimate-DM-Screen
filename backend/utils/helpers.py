"""Helper utilities: campaign context, AI helpers, SRD data loading."""
import json
from pathlib import Path
from config import db, ROOT_DIR


async def get_campaign_context(campaign_id: str, limit: int = 5) -> str:
    """Gather campaign context for AI-aware generation."""
    context_parts = []
    
    setting = await db.campaign_settings.find_one({'campaign_id': campaign_id}, {'_id': 0})
    if setting and setting.get('content'):
        context_parts.append(f"WORLD SETTING:\n{setting['content'][:500]}")
    
    npcs = await db.npcs.find({'campaign_id': campaign_id}, {'_id': 0, 'name': 1, 'description': 1, 'location': 1}).limit(limit).to_list(limit)
    if npcs:
        npc_list = [f"- {n['name']}" + (f" ({n.get('location', '')})" if n.get('location') else "") for n in npcs]
        context_parts.append("EXISTING NPCS:\n" + "\n".join(npc_list))
    
    locations = await db.locations.find({'campaign_id': campaign_id}, {'_id': 0, 'name': 1, 'location_type': 1}).limit(limit).to_list(limit)
    if locations:
        loc_list = [f"- {loc['name']} ({loc.get('location_type', 'location')})" for loc in locations]
        context_parts.append("EXISTING LOCATIONS:\n" + "\n".join(loc_list))
    
    gods = await db.gods.find({'campaign_id': campaign_id}, {'_id': 0, 'name': 1, 'domain': 1}).limit(limit).to_list(limit)
    if gods:
        god_list = [f"- {g['name']} (Domain: {g.get('domain', 'unknown')})" for g in gods]
        context_parts.append("EXISTING DEITIES:\n" + "\n".join(god_list))
    
    notes = await db.in_game_notes.find({'campaign_id': campaign_id}, {'_id': 0, 'content': 1}).sort('created_at', -1).limit(3).to_list(3)
    if notes:
        recent_notes = " ".join([n['content'][:200] for n in notes])
        context_parts.append(f"RECENT SESSION NOTES:\n{recent_notes[:400]}")
    
    if context_parts:
        return "\n\n".join(context_parts)
    return ""


def load_srd_data(filename: str):
    """Load SRD data from the data/srd directory."""
    filepath = ROOT_DIR / 'data' / 'srd' / filename
    if filepath.exists():
        with open(filepath, 'r') as f:
            return json.load(f)
    return []


def load_srd_file(filename):
    """Load SRD JSON file with caching support."""
    filepath = ROOT_DIR / 'data' / 'srd' / filename
    if filepath.exists():
        with open(filepath, 'r') as f:
            return json.load(f)
    return None
