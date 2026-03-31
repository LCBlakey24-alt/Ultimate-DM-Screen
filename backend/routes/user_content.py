"""User content routes: personal rulesets with edition tagging."""
from fastapi import APIRouter, HTTPException, Depends, status
from config import db, logger
from utils.auth import get_current_user
from models import (
    UserRuleset, UserRace, UserClass, UserSubclass, UserBackground, UserFeat,
    UserBulkContentUpload
)
from typing import Optional
import uuid
from datetime import datetime, timezone

router = APIRouter()

@router.post("/user/content/upload")
async def upload_user_content(data: UserBulkContentUpload, username: str = Depends(get_current_user)):
    """Upload a personal ruleset with races, classes, etc. for use in character creation"""
    
    # Validate edition
    if data.edition not in ["2014", "2024"]:
        raise HTTPException(status_code=400, detail="Edition must be '2014' or '2024'")
    
    # Check for existing content with same names (to skip duplicates)
    existing_races = await db.user_races.find(
        {'user_id': username, 'edition': data.edition}, 
        {'name': 1, '_id': 0}
    ).to_list(1000)
    existing_race_names = {r['name'].lower() for r in existing_races}
    
    existing_classes = await db.user_classes.find(
        {'user_id': username, 'edition': data.edition}, 
        {'name': 1, '_id': 0}
    ).to_list(1000)
    existing_class_names = {c['name'].lower() for c in existing_classes}
    
    existing_subclasses = await db.user_subclasses.find(
        {'user_id': username, 'edition': data.edition}, 
        {'name': 1, '_id': 0}
    ).to_list(1000)
    existing_subclass_names = {s['name'].lower() for s in existing_subclasses}
    
    existing_backgrounds = await db.user_backgrounds.find(
        {'user_id': username, 'edition': data.edition}, 
        {'name': 1, '_id': 0}
    ).to_list(1000)
    existing_background_names = {b['name'].lower() for b in existing_backgrounds}
    
    existing_feats = await db.user_feats.find(
        {'user_id': username, 'edition': data.edition}, 
        {'name': 1, '_id': 0}
    ).to_list(1000)
    existing_feat_names = {f['name'].lower() for f in existing_feats}
    
    # Create the ruleset
    ruleset = UserRuleset(
        user_id=username,
        name=data.ruleset_name,
        description=data.ruleset_description,
        edition=data.edition
    )
    await db.user_rulesets.insert_one(ruleset.model_dump())
    ruleset_id = ruleset.id
    
    # Track what was uploaded vs skipped
    uploaded = {"races": [], "classes": [], "subclasses": [], "backgrounds": [], "feats": []}
    skipped = {"races": [], "classes": [], "subclasses": [], "backgrounds": [], "feats": []}
    
    # Add races
    for race_data in data.races:
        if race_data.name.lower() in existing_race_names:
            skipped["races"].append(race_data.name)
            continue
        race = UserRace(
            user_id=username,
            ruleset_id=ruleset_id,
            edition=data.edition,
            name=race_data.name,
            description=race_data.description,
            size=race_data.size,
            speed=race_data.speed,
            ability_bonuses=race_data.ability_bonuses,
            traits=race_data.traits,
            languages=race_data.languages,
            subraces=race_data.subraces,
            source=race_data.source
        )
        await db.user_races.insert_one(race.model_dump())
        uploaded["races"].append(race_data.name)
    
    # Add classes
    for class_data in data.classes:
        if class_data.name.lower() in existing_class_names:
            skipped["classes"].append(class_data.name)
            continue
        cls = UserClass(
            user_id=username,
            ruleset_id=ruleset_id,
            edition=data.edition,
            name=class_data.name,
            description=class_data.description,
            hit_die=class_data.hit_die,
            primary_ability=class_data.primary_ability,
            saving_throw_proficiencies=class_data.saving_throw_proficiencies,
            armor_proficiencies=class_data.armor_proficiencies,
            weapon_proficiencies=class_data.weapon_proficiencies,
            features=class_data.features,
            source=class_data.source
        )
        await db.user_classes.insert_one(cls.model_dump())
        uploaded["classes"].append(class_data.name)
    
    # Add subclasses
    for subclass_data in data.subclasses:
        if subclass_data.name.lower() in existing_subclass_names:
            skipped["subclasses"].append(subclass_data.name)
            continue
        subclass = UserSubclass(
            user_id=username,
            ruleset_id=ruleset_id,
            edition=data.edition,
            parent_class=subclass_data.parent_class,
            name=subclass_data.name,
            description=subclass_data.description,
            subclass_level=subclass_data.subclass_level,
            features=subclass_data.features,
            source=subclass_data.source
        )
        await db.user_subclasses.insert_one(subclass.model_dump())
        uploaded["subclasses"].append(subclass_data.name)
    
    # Add backgrounds
    for bg_data in data.backgrounds:
        if bg_data.name.lower() in existing_background_names:
            skipped["backgrounds"].append(bg_data.name)
            continue
        background = UserBackground(
            user_id=username,
            ruleset_id=ruleset_id,
            edition=data.edition,
            name=bg_data.name,
            description=bg_data.description,
            skill_proficiencies=bg_data.skill_proficiencies,
            tool_proficiencies=bg_data.tool_proficiencies,
            languages=bg_data.languages,
            equipment=bg_data.equipment,
            feature_name=bg_data.feature_name,
            feature_description=bg_data.feature_description,
            source=bg_data.source
        )
        await db.user_backgrounds.insert_one(background.model_dump())
        uploaded["backgrounds"].append(bg_data.name)
    
    # Add feats
    for feat_data in data.feats:
        if feat_data.name.lower() in existing_feat_names:
            skipped["feats"].append(feat_data.name)
            continue
        feat = UserFeat(
            user_id=username,
            ruleset_id=ruleset_id,
            edition=data.edition,
            name=feat_data.name,
            description=feat_data.description,
            prerequisites=feat_data.prerequisites,
            benefits=feat_data.benefits,
            source=feat_data.source
        )
        await db.user_feats.insert_one(feat.model_dump())
        uploaded["feats"].append(feat_data.name)
    
    # Build summary
    total_uploaded = sum(len(v) for v in uploaded.values())
    total_skipped = sum(len(v) for v in skipped.values())
    
    return {
        "message": f"Ruleset '{data.ruleset_name}' uploaded to {data.edition} rules!",
        "ruleset_id": ruleset_id,
        "edition": data.edition,
        "uploaded": uploaded,
        "skipped": skipped if total_skipped > 0 else None,
        "summary": {
            "total_uploaded": total_uploaded,
            "total_skipped": total_skipped,
            "races": len(uploaded["races"]),
            "classes": len(uploaded["classes"]),
            "subclasses": len(uploaded["subclasses"]),
            "backgrounds": len(uploaded["backgrounds"]),
            "feats": len(uploaded["feats"])
        }
    }


@router.get("/user/content")
async def get_user_content(edition: str = None, username: str = Depends(get_current_user)):
    """Get all user's personal rulesets and content, optionally filtered by edition"""
    
    query = {'user_id': username}
    if edition:
        if edition not in ["2014", "2024"]:
            raise HTTPException(status_code=400, detail="Edition must be '2014' or '2024'")
        query['edition'] = edition
    
    rulesets = await db.user_rulesets.find(query, {'_id': 0}).to_list(100)
    races = await db.user_races.find(query, {'_id': 0}).to_list(500)
    classes = await db.user_classes.find(query, {'_id': 0}).to_list(500)
    subclasses = await db.user_subclasses.find(query, {'_id': 0}).to_list(500)
    backgrounds = await db.user_backgrounds.find(query, {'_id': 0}).to_list(500)
    feats = await db.user_feats.find(query, {'_id': 0}).to_list(500)
    
    return {
        "rulesets": rulesets,
        "races": races,
        "classes": classes,
        "subclasses": subclasses,
        "backgrounds": backgrounds,
        "feats": feats,
        "has_custom_content": len(races) > 0 or len(classes) > 0,
        "edition_filter": edition
    }


@router.delete("/user/content/rulesets/{ruleset_id}")
async def delete_user_ruleset(ruleset_id: str, username: str = Depends(get_current_user)):
    """Delete a user's ruleset and all its content"""
    
    # Verify ownership
    ruleset = await db.user_rulesets.find_one({'id': ruleset_id, 'user_id': username})
    if not ruleset:
        raise HTTPException(status_code=404, detail="Ruleset not found")
    
    # Delete all content from this ruleset
    await db.user_races.delete_many({'user_id': username, 'ruleset_id': ruleset_id})
    await db.user_classes.delete_many({'user_id': username, 'ruleset_id': ruleset_id})
    await db.user_subclasses.delete_many({'user_id': username, 'ruleset_id': ruleset_id})
    await db.user_backgrounds.delete_many({'user_id': username, 'ruleset_id': ruleset_id})
    await db.user_feats.delete_many({'user_id': username, 'ruleset_id': ruleset_id})
    await db.user_rulesets.delete_one({'id': ruleset_id})
    
    return {"message": "Ruleset deleted successfully"}


@router.get("/user/content/summary")
async def get_user_content_summary(username: str = Depends(get_current_user)):
    """Get a summary of user's content by edition"""
    
    summary = {
        "2014": {"races": 0, "classes": 0, "subclasses": 0, "backgrounds": 0, "feats": 0, "rulesets": 0},
        "2024": {"races": 0, "classes": 0, "subclasses": 0, "backgrounds": 0, "feats": 0, "rulesets": 0}
    }
    
    for edition in ["2014", "2024"]:
        query = {'user_id': username, 'edition': edition}
        summary[edition]["rulesets"] = await db.user_rulesets.count_documents(query)
        summary[edition]["races"] = await db.user_races.count_documents(query)
        summary[edition]["classes"] = await db.user_classes.count_documents(query)
        summary[edition]["subclasses"] = await db.user_subclasses.count_documents(query)
        summary[edition]["backgrounds"] = await db.user_backgrounds.count_documents(query)
        summary[edition]["feats"] = await db.user_feats.count_documents(query)
    
    return summary


# ==================== PLAYER CHARACTER ROUTES ====================
