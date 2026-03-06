"""Pydantic schemas for boards."""
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List


# ============= BOARD =============

class BoardBase(BaseModel):
    name: str
    description: Optional[str] = None
    color: str = "#FF6B35"


class BoardCreate(BoardBase):
    pass


class BoardUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None


class BoardResponse(BoardBase):
    id: int
    owner_id: int
    is_public: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= LIST =============

class ListBase(BaseModel):
    name: str
    position: int = 0


class ListCreate(ListBase):
    board_id: int


class ListUpdate(BaseModel):
    name: Optional[str] = None
    position: Optional[int] = None


class ListResponse(ListBase):
    id: int
    board_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= CARD =============

class CardBase(BaseModel):
    title: str
    description: Optional[str] = None
    position: int = 0
    labels: Optional[str] = None  # JSON string
    assignee_id: Optional[int] = None


class CardCreate(CardBase):
    list_id: int


class CardUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    position: Optional[int] = None
    list_id: Optional[int] = None
    labels: Optional[str] = None
    assignee_id: Optional[int] = None
    due_date: Optional[datetime] = None


class CardResponse(CardBase):
    id: int
    list_id: int
    due_date: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============= COMMENT =============

class CommentBase(BaseModel):
    content: str


class CommentCreate(CommentBase):
    card_id: int


class CommentResponse(CommentBase):
    id: int
    card_id: int
    author_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
