"""Webhook API routes."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.core.webhooks import WEBHOOK_EVENTS, trigger_event
from app.db import User, Webhook
from app.db.session import get_db

router = APIRouter(prefix="/api/v1/webhooks", tags=["webhooks"])


class WebhookCreate(BaseModel):
    url: str
    events: List[str]
    secret: Optional[str] = None


class WebhookResponse(BaseModel):
    id: int
    url: str
    events: List[str]
    secret: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True


@router.get("", response_model=List[WebhookResponse])
def list_webhooks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all webhooks for the current user."""
    # For now, all webhooks are global - could add owner_id later
    webhooks = db.query(Webhook).all()
    return [
        WebhookResponse(
            id=w.id,
            url=w.url,
            events=w.events,
            secret=w.secret,
            is_active=w.is_active,
        )
        for w in webhooks
    ]


@router.post("", response_model=WebhookResponse, status_code=status.HTTP_201_CREATED)
def create_webhook(
    webhook_data: WebhookCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new webhook."""
    # Validate events
    for event in webhook_data.events:
        if event not in WEBHOOK_EVENTS:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid event: {event}. Valid events: {WEBHOOK_EVENTS}",
            )
    
    webhook = Webhook(
        url=webhook_data.url,
        events=webhook_data.events,
        secret=webhook_data.secret,
    )
    db.add(webhook)
    db.commit()
    db.refresh(webhook)
    
    return WebhookResponse(
        id=webhook.id,
        url=webhook.url,
        events=webhook.events,
        secret=webhook.secret,
        is_active=webhook.is_active,
    )


@router.delete("/{webhook_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_webhook(
    webhook_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a webhook."""
    webhook = db.query(Webhook).filter(Webhook.id == webhook_id).first()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    db.delete(webhook)
    db.commit()
    return None


@router.post("/{webhook_id}/test", status_code=status.HTTP_200_OK)
async def test_webhook(
    webhook_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Test a webhook by sending a ping event."""
    webhook = db.query(Webhook).filter(Webhook.id == webhook_id).first()
    if not webhook:
        raise HTTPException(status_code=404, detail="Webhook not found")
    
    from app.core.webhooks import trigger_webhook
    success = await trigger_webhook(webhook, "board.created", {"id": 1, "name": "Test"})
    
    return {"success": success}
