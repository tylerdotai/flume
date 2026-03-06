"""AI Assistant API for Flume - Allows AI agents to manage boards and tasks.
Supports both JWT (user) and API Key (agent) authentication.
"""
import secrets
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db import User, Board, BoardList, Card, Comment, APIKey
from app.db.session import get_db
from app.core.api_auth import get_api_key_user
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])


# ============= MODELS =============

class TaskReport(BaseModel):
    """Structured task report format."""
    what: str
    why: str
    how: str
    when_start: Optional[str] = None
    when_end: Optional[str] = None


class CardCreateAI(BaseModel):
    """Create card with full task report."""
    list_id: int
    title: str
    task_report: Optional[TaskReport] = None
    priority: str = "medium"  # low, medium, high


class CardUpdateAI(BaseModel):
    """Update card."""
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    assignee_id: Optional[int] = None


class APIKeyCreate(BaseModel):
    """Create API key request."""
    name: str  # Agent name


class APIKeyResponse(BaseModel):
    """API key response."""
    id: int
    name: str
    key: str  # Only shown on creation
    created_at: str

    model_config = {"from_attributes": True}


# ============= HELPER FUNCTIONS =============

def description_from_report(report: TaskReport) -> str:
    """Convert task report to markdown description."""
    desc = f"## What\n{report.what}\n\n"
    desc += f"## Why\n{report.why}\n\n"
    desc += f"## How\n{report.how}\n\n"
    desc += f"## When\n"
    if report.when_start:
        desc += f"- Start: {report.when_start}\n"
    if report.when_end:
        desc += f"- End: {report.when_end}\n"
    return desc


# ============= API KEY MANAGEMENT =============

@router.post("/keys", response_model=APIKeyResponse)
def create_api_key(
    key_data: APIKeyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create an API key for AI agents. Returns the key ONCE - save it!"""
    # Generate secure random key
    key = f"flume_{secrets.token_urlsafe(32)}"
    
    api_key = APIKey(
        key=key,
        name=key_data.name,
        user_id=current_user.id,
    )
    db.add(api_key)
    db.commit()
    db.refresh(api_key)
    
    return APIKeyResponse(
        id=api_key.id,
        name=api_key.name,
        key=key,  # Only returned on creation!
        created_at=api_key.created_at.isoformat(),
    )


@router.get("/keys")
def list_api_keys(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List your API keys (without showing the actual keys)."""
    keys = db.query(APIKey).filter(APIKey.user_id == current_user.id).all()
    return [
        {
            "id": k.id,
            "name": k.name,
            "is_active": k.is_active,
            "created_at": k.created_at.isoformat(),
        }
        for k in keys
    ]


@router.delete("/keys/{key_id}")
def delete_api_key(
    key_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Revoke an API key."""
    key = db.query(APIKey).filter(APIKey.id == key_id, APIKey.user_id == current_user.id).first()
    if not key:
        raise HTTPException(status_code=404, detail="API key not found")
    
    key.is_active = False
    db.commit()
    
    return {"status": "revoked", "id": key_id}


# ============= BOARD ENDPOINTS (API Key Auth) =============

@router.get("/boards")
def list_boards(
    db: Session = Depends(get_db),
    user: User = Depends(get_api_key_user),
):
    """List all boards. Auth: API Key required."""
    boards = db.query(Board).filter(Board.owner_id == user.id).all()
    return [
        {
            "id": b.id,
            "name": b.name,
            "description": b.description,
            "color": b.color,
            "lists_count": len(b.lists),
        }
        for b in boards
    ]


@router.get("/boards/{board_id}")
def get_board(
    board_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_api_key_user),
):
    """Get board details with lists and cards. Auth: API Key required."""
    board = db.query(Board).filter(Board.id == board_id, Board.owner_id == user.id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    
    lists = db.query(BoardList).filter(BoardList.board_id == board_id).order_by(BoardList.position).all()
    
    return {
        "id": board.id,
        "name": board.name,
        "description": board.description,
        "color": board.color,
        "lists": [
            {
                "id": lst.id,
                "name": lst.name,
                "cards": [
                    {
                        "id": c.id,
                        "title": c.title,
                        "description": c.description,
                        "priority": c.priority,
                        "assignee_id": c.assignee_id,
                        "due_date": c.due_date.isoformat() if c.due_date else None,
                    }
                    for c in lst.cards
                ]
            }
            for lst in lists
        ]
    }


# ============= CARD ENDPOINTS (API Key Auth) =============

@router.post("/cards")
def create_card_ai(
    card_data: CardCreateAI,
    db: Session = Depends(get_db),
    user: User = Depends(get_api_key_user),
):
    """Create a card with full task report. Auth: API Key required."""
    # Verify list belongs to user's board
    lst = db.query(BoardList).filter(BoardList.id == card_data.list_id).first()
    if not lst:
        raise HTTPException(status_code=404, detail="List not found")
    
    board = db.query(Board).filter(Board.id == lst.board_id, Board.owner_id == user.id).first()
    if not board:
        raise HTTPException(status_code=403, detail="Not your list")
    
    # Build description
    description = ""
    if card_data.task_report:
        description = description_from_report(card_data.task_report)
    
    card = Card(
        title=card_data.title,
        description=description,
        list_id=card_data.list_id,
        priority=card_data.priority,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    
    return {
        "id": card.id,
        "title": card.title,
        "description": card.description,
        "priority": card.priority,
        "list_id": card.list_id,
    }


@router.patch("/cards/{card_id}")
def update_card_ai(
    card_id: int,
    card_data: CardUpdateAI,
    db: Session = Depends(get_db),
    user: User = Depends(get_api_key_user),
):
    """Update a card. Auth: API Key required."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    # Verify ownership
    lst = db.query(BoardList).filter(BoardList.id == card.list_id).first()
    board = db.query(Board).filter(Board.id == lst.board_id, Board.owner_id == user.id).first()
    if not board:
        raise HTTPException(status_code=403, detail="Not your card")
    
    if card_data.title is not None:
        card.title = card_data.title
    if card_data.description is not None:
        card.description = card_data.description
    if card_data.priority is not None:
        card.priority = card_data.priority
    if card_data.assignee_id is not None:
        card.assignee_id = card_data.assignee_id
    
    db.commit()
    db.refresh(card)
    
    return {
        "id": card.id,
        "title": card.title,
        "description": card.description,
        "priority": card.priority,
    }


@router.delete("/cards/{card_id}")
def delete_card_ai(
    card_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_api_key_user),
):
    """Delete a card. Auth: API Key required."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    # Verify ownership
    lst = db.query(BoardList).filter(BoardList.id == card.list_id).first()
    board = db.query(Board).filter(Board.id == lst.board_id, Board.owner_id == user.id).first()
    if not board:
        raise HTTPException(status_code=403, detail="Not your card")
    
    db.delete(card)
    db.commit()
    
    return {"status": "deleted", "id": card_id}


@router.post("/cards/{card_id}/complete")
def complete_card(
    card_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_api_key_user),
):
    """Mark a card as complete (adds [DONE] to title). Auth: API Key required."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    # Verify ownership
    lst = db.query(BoardList).filter(BoardList.id == card.list_id).first()
    board = db.query(Board).filter(Board.id == lst.board_id, Board.owner_id == user.id).first()
    if not board:
        raise HTTPException(status_code=403, detail="Not your card")
    
    if not card.title.startswith("[DONE]"):
        card.title = f"[DONE] {card.title}"
    
    db.commit()
    db.refresh(card)
    
    return {
        "id": card.id,
        "title": card.title,
        "status": "completed"
    }


@router.get("/lists/{list_id}")
def get_list(
    list_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_api_key_user),
):
    """Get a list with its cards. Auth: API Key required."""
    lst = db.query(BoardList).filter(BoardList.id == list_id).first()
    if not lst:
        raise HTTPException(status_code=404, detail="List not found")
    
    # Verify ownership
    board = db.query(Board).filter(Board.id == lst.board_id, Board.owner_id == user.id).first()
    if not board:
        raise HTTPException(status_code=403, detail="Not your list")
    
    cards = db.query(Card).filter(Card.list_id == list_id).order_by(Card.position).all()
    
    return {
        "id": lst.id,
        "name": lst.name,
        "board_id": lst.board_id,
        "cards": [
            {
                "id": c.id,
                "title": c.title,
                "description": c.description,
                "priority": c.priority,
            }
            for c in cards
        ]
    }
