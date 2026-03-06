"""Webhook service for Flume."""
import hashlib
import hmac
import json
from typing import Any, Dict, List, Optional

import httpx

from app.db.models import Webhook
from app.db.session import SessionLocal


# Events that can trigger webhooks
WEBHOOK_EVENTS = [
    "board.created",
    "board.updated",
    "board.deleted",
    "list.created",
    "list.updated",
    "list.deleted",
    "card.created",
    "card.updated",
    "card.deleted",
    "card.moved",
    "comment.created",
    "comment.updated",
    "comment.deleted",
]


def get_webhooks_for_event(event: str) -> List[Webhook]:
    """Get all active webhooks that should trigger for an event."""
    db = SessionLocal()
    try:
        webhooks = db.query(Webhook).filter(Webhook.is_active == True).all()
        return [w for w in webhooks if event in json.loads(w.events)]
    finally:
        db.close()


def generate_signature(payload: str, secret: Optional[str]) -> Optional[str]:
    """Generate HMAC signature for webhook payload."""
    if not secret:
        return None
    return hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()


async def trigger_webhook(webhook: Webhook, event: str, data: Dict[str, Any]) -> bool:
    """Send a webhook POST request."""
    payload = json.dumps({
        "event": event,
        "data": data,
    })
    
    headers = {
        "Content-Type": "application/json",
        "X-Flume-Event": event,
    }
    
    if webhook.secret:
        signature = generate_signature(payload, webhook.secret)
        headers["X-Flume-Signature"] = signature
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(webhook.url, content=payload, headers=headers)
            return response.status_code < 400
    except Exception as e:
        print(f"Webhook failed for {webhook.url}: {e}")
        return False


async def trigger_event(event: str, data: Dict[str, Any]) -> None:
    """Trigger all webhooks for an event."""
    if event not in WEBHOOK_EVENTS:
        return
    
    webhooks = get_webhooks_for_event(event)
    for webhook in webhooks:
        await trigger_webhook(webhook, event, data)
