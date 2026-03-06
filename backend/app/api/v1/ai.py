"""AI Assistant API for Flume - Allows Hoss to manage boards and tasks."""
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.db import User, Board, BoardList, Card, Comment
from app.db.session import get_db

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


# ============= ENDPOINTS =============

@router.get("/boards")
def list_boards(db: Session = Depends(get_db)):
    """List all boards."""
    boards = db.query(Board).all()
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
def get_board(board_id: int, db: Session = Depends(get_db)):
    """Get board details with lists and cards."""
    board = db.query(Board).filter(Board.id == board_id).first()
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


@router.post("/cards")
def create_card_ai(card_data: CardCreateAI, db: Session = Depends(get_db)):
    """Create a card with full task report."""
    # Build description
    description = card_data.task_report.description if card_data.task_report else ""
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
def update_card_ai(card_id: int, card_data: CardUpdateAI, db: Session = Depends(get_db)):
    """Update a card."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
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
def delete_card_ai(card_id: int, db: Session = Depends(get_db)):
    """Delete a card."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    db.delete(card)
    db.commit()
    
    return {"status": "deleted", "id": card_id}


@router.post("/cards/{card_id}/complete")
def complete_card(card_id: int, db: Session = Depends(get_db)):
    """Mark a card as complete (adds [DONE] to title)."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
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
def get_list(list_id: int, db: Session = Depends(get_db)):
    """Get a list with its cards."""
    lst = db.query(BoardList).filter(BoardList.id == list_id).first()
    if not lst:
        raise HTTPException(status_code=404, detail="List not found")
    
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
