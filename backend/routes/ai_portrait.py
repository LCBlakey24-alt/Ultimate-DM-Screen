"""AI portrait and image generation routes.

Portrait/image generation is optional. When no provider key is configured, these
routes return a clean 503 payload so the frontend can recover and still allow
character creation without an AI portrait.
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import asyncio
import base64
import uuid

from utils.auth import get_current_user
from config import logger
from utils.llm_provider import LlmChat, OpenAIImageGeneration, UserMessage, get_llm_api_key

router = APIRouter()

STYLE_PROMPTS = {
    "photoreal": "photorealistic high-fantasy tabletop RPG character portrait, cinematic lighting, rich detail",
    "painterly": "painterly fantasy illustration, oil painting feel, soft brushwork, tabletop RPG character art",
    "stylized": "stylized fantasy portrait, bold clean shapes, vibrant colour accents, illustrated tabletop RPG hero art",
}

SAFE_PORTRAIT_FRAMING = (
    "Portrait orientation, 3:4 aspect ratio. Single character only. Upper torso / bust portrait. "
    "Entire head fully visible including hair, hood, hat, horns, ears, helmet, or accessories. "
    "Small empty space above the head, face centered, shoulders visible, not cropped, not an extreme close-up, "
    "not full-body, clean character-sheet avatar composition. No text, no watermark, no logo."
)


class PortraitRequest(BaseModel):
    race: Optional[str] = ""
    subrace: Optional[str] = ""
    character_class: Optional[str] = ""
    subclass: Optional[str] = ""
    background: Optional[str] = ""
    alignment: Optional[str] = ""
    gender: Optional[str] = ""
    description: Optional[str] = ""
    style: str = "photoreal"
    portrait_framing: Optional[str] = ""


class ImageBatchRequest(BaseModel):
    subject_type: str = "item"
    name: Optional[str] = ""
    item_type: Optional[str] = ""
    rarity: Optional[str] = ""
    description: Optional[str] = ""
    properties: Optional[str] = ""
    weather: Optional[str] = ""
    lighting: Optional[str] = ""
    mood: Optional[str] = ""
    location: Optional[str] = ""
    campaign_name: Optional[str] = ""
    campaign_notes: Optional[str] = ""
    notes: Optional[str] = ""
    style: str = "concept"


def _provider_status() -> dict:
    gemini_ready = bool(LlmChat is not None and UserMessage is not None and get_llm_api_key("gemini"))
    openai_ready = bool(OpenAIImageGeneration is not None and get_llm_api_key("openai"))
    return {"available": gemini_ready or openai_ready, "gemini": gemini_ready, "openai": openai_ready}


def _not_configured_error() -> HTTPException:
    return HTTPException(
        status_code=503,
        detail={
            "code": "IMAGE_GENERATION_NOT_CONFIGURED",
            "message": "AI image generation is not configured. You can still create characters without an AI portrait or upload your own image.",
        },
    )


def _build_prompt(req: PortraitRequest) -> str:
    style = STYLE_PROMPTS.get(req.style, STYLE_PROMPTS["photoreal"])
    parts = []
    if req.gender:
        parts.append(req.gender.strip()[:80])
    if req.subrace:
        parts.append(req.subrace.strip()[:80])
    elif req.race:
        parts.append(req.race.strip()[:80])
    if req.character_class:
        class_part = req.character_class.strip()[:80]
        if req.subclass:
            class_part = f"{req.subclass.strip()[:80]} {class_part}"
        parts.append(class_part)
    subject = " ".join(parts) if parts else "fantasy adventurer"

    extras = []
    if req.background:
        extras.append(f"{req.background.strip()[:100]} background")
    if req.alignment:
        extras.append(req.alignment.strip()[:60].lower())
    if req.description:
        extras.append(req.description.strip()[:420])
    extras_text = ", ".join(extras) if extras else "simple heroic fantasy details"
    framing = req.portrait_framing or SAFE_PORTRAIT_FRAMING

    return f"Create a fantasy tabletop RPG character portrait of a {subject}. Character details: {extras_text}. {style}. {framing}"


def _build_image_prompt(req: ImageBatchRequest, variant: str) -> str:
    subject_type = (req.subject_type or "item").lower()
    variant_notes = {
        "studio": "single-object studio concept art, centered composition, crisp silhouette",
        "dramatic": "dramatic cinematic lighting, strong red rim light, premium fantasy item render",
        "arcane": "arcane workshop concept art, subtle magical energy, clean readable shape",
        "wide": "wide cinematic establishing shot, landscape orientation, strong depth",
        "immersive": "immersive tabletop battle backdrop, readable foreground and background",
        "moody": "moody atmospheric scene, high contrast, dark fantasy lighting",
    }
    variant_text = variant_notes.get(variant, variant_notes["studio"])

    if subject_type == "environment":
        location = req.location or req.campaign_name or "fantasy adventuring location"
        details = ", ".join(part for part in [req.weather, req.lighting, req.mood, req.notes, req.campaign_notes[:300] if req.campaign_notes else ""] if part)
        return f"Fantasy tabletop RPG environment background for {location}. {details}. {variant_text}. No foreground characters, no text, no watermark, no logo."

    item_name = req.name or "custom fantasy item"
    item_type = req.item_type or "equipment"
    rarity = req.rarity or "common"
    details = ", ".join(part for part in [req.description[:450] if req.description else "", req.properties[:300] if req.properties else ""] if part)
    return f"Fantasy tabletop RPG item concept art of a {rarity} {item_type} named {item_name}. {details}. {variant_text}. One item only on a neutral dark grey background, no text, no watermark, no logo."


async def _generate_prompt_with_gemini(prompt: str, username: str, style: str, subject_type: str) -> dict:
    session_id = f"image-{subject_type}-{username}-{style}-{uuid.uuid4().hex[:8]}"
    chat = LlmChat(api_key=get_llm_api_key("gemini"), session_id=session_id, system_message="You are an expert fantasy concept artist for tabletop RPG tools.")
    chat.with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    _text, images = await chat.send_message_multimodal_response(UserMessage(text=prompt))
    if not images:
        raise RuntimeError("no_image")
    first = images[0]
    return {"image_base64": first.get("data", ""), "mime_type": first.get("mime_type", "image/png"), "style": style, "prompt": prompt, "provider": "gemini"}


async def _generate_prompt_with_openai(prompt: str, style: str) -> dict:
    generator = OpenAIImageGeneration(api_key=get_llm_api_key("openai"))
    images = await generator.generate_images(prompt=prompt, number_of_images=1)
    if not images:
        raise RuntimeError("no_image")
    return {"image_base64": base64.b64encode(images[0]).decode("utf-8"), "mime_type": "image/png", "style": style, "prompt": prompt, "provider": "openai"}


async def _generate_image_option(req: ImageBatchRequest, username: str, variant: str) -> dict:
    status = _provider_status()
    if not status["available"]:
        raise _not_configured_error()
    prompt = _build_image_prompt(req, variant)
    if status["gemini"]:
        return await _generate_prompt_with_gemini(prompt, username, variant, (req.subject_type or "item").lower())
    return await _generate_prompt_with_openai(prompt, variant)


async def _generate_portrait_option(req: PortraitRequest, username: str) -> dict:
    status = _provider_status()
    if not status["available"]:
        raise _not_configured_error()
    if req.style not in STYLE_PROMPTS:
        req.style = "photoreal"
    prompt = _build_prompt(req)
    if status["gemini"]:
        return await _generate_prompt_with_gemini(prompt, username, req.style, "portrait")
    return await _generate_prompt_with_openai(prompt, req.style)


@router.get("/ai/portrait/status")
async def portrait_status(_username: str = Depends(get_current_user)):
    status = _provider_status()
    return {
        "available": status["available"],
        "providers": {"gemini": status["gemini"], "openai": status["openai"]},
        "message": "AI portrait generation is available." if status["available"] else "AI portrait generation is not configured. Character creation can continue without it.",
    }


@router.post("/ai/portrait")
async def generate_portrait(req: PortraitRequest, username: str = Depends(get_current_user)):
    try:
        return await _generate_portrait_option(req, username)
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Portrait generation failed")
        raise HTTPException(status_code=500, detail=f"Portrait generation failed: {type(e).__name__}")


@router.post("/ai/portrait/batch")
async def generate_portrait_batch(req: PortraitRequest, username: str = Depends(get_current_user)):
    if not _provider_status()["available"]:
        raise _not_configured_error()
    styles = ["photoreal", "painterly", "stylized"]

    async def one(style: str):
        copy = req.model_copy(update={"style": style})
        try:
            return await _generate_portrait_option(copy, username)
        except Exception as e:
            logger.exception(f"Portrait ({style}) failed")
            return {"style": style, "error": type(e).__name__, "prompt": _build_prompt(copy)}

    return {"portraits": await asyncio.gather(*[one(style) for style in styles])}


@router.post("/ai/image/batch")
async def generate_image_batch(req: ImageBatchRequest, username: str = Depends(get_current_user)):
    if not _provider_status()["available"]:
        raise _not_configured_error()
    subject_type = (req.subject_type or "item").lower()
    variants = ["wide", "immersive", "moody"] if subject_type == "environment" else ["studio", "dramatic", "arcane"]

    async def one(variant: str):
        try:
            return await _generate_image_option(req, username, variant)
        except Exception as e:
            logger.exception(f"Image generation ({subject_type}:{variant}) failed")
            return {"style": variant, "error": type(e).__name__, "prompt": _build_image_prompt(req, variant)}

    return {"images": await asyncio.gather(*[one(variant) for variant in variants])}
