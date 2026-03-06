"""Board API routes."""
import asyncio
from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.v1.auth import get_current_user
from app.db import Board, BoardList, Card
from app.db.session import get_db
from app.schemas.board import (
    BoardCreate,
    BoardUpdate,
    BoardResponse,
    ListCreate,
    ListUpdate,
    ListResponse,
    CardCreate,
    CardUpdate,
    CardResponse,
    CommentResponse,
    CommentCreate,
)
from app.core.webhooks import trigger_event
from app.core.socketio import (
    emit_card_created, emit_card_updated, emit_card_deleted,
    emit_list_created, emit_list_updated, emit_list_deleted,
    emit_comment_created,
)
from app.db.models import User

router = APIRouter(prefix="/api/v1", tags=["boards"])


# ============= HELPERS =============


def trigger_webhook(event: str, data: dict):
    """Trigger webhook in background."""
    try:
        asyncio.run(trigger_event(event, data))
    except Exception:
        pass  # Skip on error


def notify_list_created(board_id: int, list_data: dict):
    """Notify list created."""
    try:
        asyncio.run(emit_list_created(board_id, list_data))
    except Exception:
        pass


def notify_list_updated(board_id: int, list_data: dict):
    """Notify list updated."""
    try:
        asyncio.run(emit_list_updated(board_id, list_data))
    except Exception:
        pass


def notify_list_deleted(board_id: int, list_id: int):
    """Notify list deleted."""
    try:
        asyncio.run(emit_list_deleted(board_id, list_id))
    except Exception:
        pass


def notify_card_created(board_id: int, card_data: dict):
    """Notify card created."""
    try:
        asyncio.run(emit_card_created(board_id, card_data))
    except Exception:
        pass


def notify_card_updated(board_id: int, card_data: dict):
    """Notify card updated."""
    try:
        asyncio.run(emit_card_updated(board_id, card_data))
    except Exception:
        pass


def notify_card_deleted(board_id: int, card_id: int):
    """Notify card deleted."""
    try:
        asyncio.run(emit_card_deleted(board_id, card_id))
    except Exception:
        pass


# ============= BOARDS =============


@router.get("/boards", response_model=List[BoardResponse])
def get_boards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all boards for current user."""
    return db.query(Board).filter(Board.owner_id == current_user.id).all()


@router.post("/boards", response_model=BoardResponse, status_code=status.HTTP_201_CREATED)
def create_board(
    board_data: BoardCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new board."""
    board = Board(
        name=board_data.name,
        description=board_data.description,
        color=board_data.color,
        owner_id=current_user.id,
    )
    db.add(board)
    db.commit()
    db.refresh(board)
    
    background_tasks.add_task(trigger_webhook, "board.created", {"id": board.id, "name": board.name})
    
    return board


@router.get("/boards/{board_id}", response_model=BoardResponse)
def get_board(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific board."""
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    if board.owner_id != current_user.id and not board.is_public:
        raise HTTPException(status_code=403, detail="Not authorized")

    return board


@router.patch("/boards/{board_id}", response_model=BoardResponse)
def update_board(
    board_id: int,
    board_data: BoardUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a board."""
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if board_data.name is not None:
        board.name = board_data.name
    if board_data.description is not None:
        board.description = board_data.description
    if board_data.color is not None:
        board.color = board_data.color
    if board_data.is_public is not None:
        board.is_public = board_data.is_public

    db.commit()
    db.refresh(board)

    return board


@router.delete("/boards/{board_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_board(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a board."""
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(board)
    db.commit()

    return None


# ============= LISTS =============


@router.get("/boards/{board_id}/lists", response_model=List[ListResponse])
def get_lists(
    board_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all lists in a board."""
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return db.query(BoardList).filter(BoardList.board_id == board_id).order_by(BoardList.position).all()


@router.post("/boards/{board_id}/lists", response_model=ListResponse, status_code=status.HTTP_201_CREATED)
def create_list(
    board_id: int,
    list_data: ListCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new list in a board."""
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    max_pos = db.query(BoardList).filter(BoardList.board_id == board_id).count()

    board_list = BoardList(
        name=list_data.name,
        position=list_data.position or max_pos,
        board_id=board_id,
    )
    db.add(board_list)
    db.commit()
    db.refresh(board_list)

    background_tasks.add_task(notify_list_created, board_id, {"id": board_list.id, "name": board_list.name})

    return board_list


@router.patch("/lists/{list_id}", response_model=ListResponse)
def update_list(
    list_id: int,
    list_data: ListUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a list."""
    board_list = db.query(BoardList).filter(BoardList.id == list_id).first()
    if not board_list:
        raise HTTPException(status_code=404, detail="List not found")

    board = db.query(Board).filter(Board.id == board_list.board_id).first()
    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if list_data.name is not None:
        board_list.name = list_data.name
    if list_data.position is not None:
        board_list.position = list_data.position

    db.commit()
    db.refresh(board_list)

    background_tasks.add_task(notify_list_updated, board_list.board_id, {"id": board_list.id, "name": board_list.name})

    return board_list


@router.delete("/lists/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_list(
    list_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a list."""
    board_list = db.query(BoardList).filter(BoardList.id == list_id).first()
    if not board_list:
        raise HTTPException(status_code=404, detail="List not found")

    board = db.query(Board).filter(Board.id == board_list.board_id).first()
    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    board_id = board_list.board_id
    db.delete(board_list)
    db.commit()

    background_tasks.add_task(notify_list_deleted, board_id, list_id)

    return None


# ============= CARDS =============


@router.get("/lists/{list_id}/cards", response_model=List[CardResponse])
def get_cards(
    list_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all cards in a list."""
    board_list = db.query(BoardList).filter(BoardList.id == list_id).first()
    if not board_list:
        raise HTTPException(status_code=404, detail="List not found")

    board = db.query(Board).filter(Board.id == board_list.board_id).first()
    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return db.query(Card).filter(Card.list_id == list_id).order_by(Card.position).all()


@router.post("/lists/{list_id}/cards", response_model=CardResponse, status_code=status.HTTP_201_CREATED)
def create_card(
    list_id: int,
    card_data: CardCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new card in a list."""
    board_list = db.query(BoardList).filter(BoardList.id == list_id).first()
    if not board_list:
        raise HTTPException(status_code=404, detail="List not found")

    board = db.query(Board).filter(Board.id == board_list.board_id).first()
    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    max_pos = db.query(Card).filter(Card.list_id == list_id).count()

    card = Card(
        title=card_data.title,
        description=card_data.description,
        position=card_data.position or max_pos,
        labels=card_data.labels,
        list_id=list_id,
        assignee_id=card_data.assignee_id,
        priority=card_data.priority or "medium",
    )
    db.add(card)
    db.commit()
    db.refresh(card)

    background_tasks.add_task(notify_card_created, board_list.board_id, {
        "id": card.id,
        "title": card.title,
        "list_id": list_id,
    })

    return card


@router.patch("/cards/{card_id}", response_model=CardResponse)
def update_card(
    card_id: int,
    card_data: CardUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update a card."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    board_list = db.query(BoardList).filter(BoardList.id == card.list_id).first()
    board = db.query(Board).filter(Board.id == board_list.board_id).first()
    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if card_data.title is not None:
        card.title = card_data.title
    if card_data.description is not None:
        card.description = card_data.description
    if card_data.position is not None:
        card.position = card_data.position
    if card_data.list_id is not None:
        card.list_id = card_data.list_id
    if card_data.labels is not None:
        card.labels = card_data.labels
    if card_data.assignee_id is not None:
        card.assignee_id = card_data.assignee_id
    if card_data.due_date is not None:
        card.due_date = card_data.due_date
    if card_data.priority is not None:
        card.priority = card_data.priority

    db.commit()
    db.refresh(card)

    background_tasks.add_task(notify_card_updated, board_list.board_id, {
        "id": card.id,
        "title": card.title,
    })

    return card


@router.delete("/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(
    card_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a card."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    board_list = db.query(BoardList).filter(BoardList.id == card.list_id).first()
    board = db.query(Board).filter(Board.id == board_list.board_id).first()
    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    board_id = board_list.board_id
    db.delete(card)
    db.commit()

    background_tasks.add_task(notify_card_deleted, board_id, card_id)

    return None


# ============= COMMENTS =============


@router.get("/cards/{card_id}/comments", response_model=List[CommentResponse])
def get_comments(
    card_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all comments for a card."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    board_list = db.query(BoardList).filter(BoardList.id == card.list_id).first()
    board = db.query(Board).filter(Board.id == board_list.board_id).first()
    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return card.comments


@router.post("/cards/{card_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    card_id: int,
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Add a comment to a card."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")

    board_list = db.query(BoardList).filter(BoardList.id == card.list_id).first()
    board = db.query(Board).filter(Board.id == board_list.board_id).first()
    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    from app.db.models import Comment
    comment = Comment(
        content=comment_data.content,
        card_id=card_id,
        user_id=current_user.id,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    # Emit socket event
    try:
        asyncio.run(emit_comment_created(board.id, {
            "id": comment.id,
            "content": comment.content,
            "card_id": card_id,
            "user_id": current_user.id,
        }))
    except Exception:
        pass

    return comment
