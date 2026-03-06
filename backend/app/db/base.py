"""SQLAlchemy base."""
from app.db.session import Base

# Import all models so they get registered with Base
from app.db.models import User, Board, BoardList, Card, Comment, Webhook
