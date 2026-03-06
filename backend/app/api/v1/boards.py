"""Board API routes."""
import asyncio
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
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

# Helper to safely run async tasks from sync context
def safe_async_task(coro):
    """Run async coroutine from sync context without breaking."""
    try:
        asyncio.create_task(coro)
    except RuntimeError:
        pass  # No running event loop - skip


router = APIRouter(prefix="/api/v1", tags=["boards"])


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
    
    # Trigger webhook (async, fire and forget) - wrap in try/except to prevent errors
    try:
        safe_async_task(trigger_event("board.created", {"id": board.id, "name": board.name}))
    except RuntimeError:
        pass  # No running event loop - skip webhook in sync context
    
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

    if board.owner_id != current_user.id and not board.is_public:
        raise HTTPException(status_code=403, detail="Not authorized")

    return db.query(BoardList).filter(BoardList.board_id == board_id).order_by(BoardList.position).all()


@router.post("/boards/{board_id}/lists", response_model=ListResponse, status_code=status.HTTP_201_CREATED)
def create_list(
    board_id: int,
    list_data: ListCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new list in a board."""
    board = db.query(Board).filter(Board.id == board_id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")

    if board.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    # Get max position
    max_pos = db.query(BoardList).filter(BoardList.board_id == board_id).count()

    board_list = BoardList(
        name=list_data.name,
        position=list_data.position or max_pos,
        board_id=board_id,
    )
    db.add(board_list)
    db.commit()
    db.refresh(board_list)
    
    # Emit real-time event
    safe_async_task(emit_list_created(board_id, {
        "id": board_list.id,
        "name": board_list.name,
    }))
    
    return board_list


@router.patch("/lists/{list_id}", response_model=ListResponse)
def update_list(
    list_id: int,
    list_data: ListUpdate,
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
    
    # Emit real-time event
    safe_async_task(emit_list_updated(board_list.board_id, {
        "id": board_list.id,
        "name": board_list.name,
    }))
    
    return board_list


@router.delete("/lists/{list_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_list(
    list_id: int,
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

    db.delete(board_list)
    db.commit()
    
    # Emit real-time event
    safe_async_task(emit_list_deleted(board.id, list_id))
    
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
    if board.owner_id != current_user.id and not board.is_public:
        raise HTTPException(status_code=403, detail="Not authorized")

    return db.query(Card).filter(Card.list_id == list_id).order_by(Card.position).all()


@router.post("/lists/{list_id}/cards", response_model=CardResponse, status_code=status.HTTP_201_CREATED)
def create_card(
    list_id: int,
    card_data: CardCreate,
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

    # Get max position
    max_pos = db.query(Card).filter(Card.list_id == list_id).count()

    card = Card(
        title=card_data.title,
        description=card_data.description,
        position=card_data.position or max_pos,
        list_id=list_id,
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    
    # Emit real-time event
    safe_async_task(emit_card_created(board_list.board_id, {
        "id": card.id,
        "title": card.title,
        "description": card.description,
        "list_id": card.list_id,
    }))
    
    return card


@router.patch("/cards/{card_id}", response_model=CardResponse)
def update_card(
    card_id: int,
    card_data: CardUpdate,
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

    db.commit()
    db.refresh(card)
    
    # Emit real-time event
    safe_async_task(emit_card_updated(board_list.board_id, {
        "id": card.id,
        "title": card.title,
        "description": card.description,
        "list_id": card.list_id,
    }))
    
    return card


@router.delete("/cards/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(
    card_id: int,
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

    db.delete(card)
    db.commit()
    
    # Emit real-time event
    safe_async_task(emit_card_deleted(board_list.board_id, card_id))
    
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
    
    return db.query(Comment).filter(Comment.card_id == card_id).order_by(Comment.created_at).all()


@router.post("/cards/{card_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    card_id: int,
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new comment on a card."""
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    comment = Comment(
        content=comment_data.content,
        card_id=card_id,
        author_id=current_user.id,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a comment."""
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    if comment.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(comment)
    db.commit()
    return None
