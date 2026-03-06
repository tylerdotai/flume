from contextlib import asynccontextmanager
import os

# Sentry error tracking (optional)
try:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    SENTRY_DSN = os.getenv("SENTRY_DSN")
    if SENTRY_DSN:
        sentry_sdk.init(
            dsn=SENTRY_DSN,
            integrations=[FastApiIntegration()],
            traces_sample_rate=0.1,
        )
except ImportError:
    sentry_sdk = None

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
from socketio.asgi import ASGIApp

from app.api.v1 import api_router
from app.core.config import settings
from app.core.socketio import sio
from app.db.base import Base
from app.db.session import engine

# Create database tables
Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan."""
    # Startup
    yield
    # Shutdown


app = FastAPI(
    title="Flume API",
    description="Your command center API",
    version="0.1.0",
    lifespan=lifespan,
)

# Add rate limiter
app.state.limiter = limiter
app.add_exception_handler(Exception, lambda r, e: None)  # Basic error handler

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router)

# Socket.IO
socketio_app = ASGIApp(sio, socketio_path="/socket.io")
app.mount("/socket.io", socketio_app)


@app.get("/")
def root():
    return {"message": "Flume API", "status": "running"}


@app.get("/api/health")
def health():
    return {"status": "healthy"}
