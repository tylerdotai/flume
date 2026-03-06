# Flume - Project Structure

```
flume/
├── frontend/                 # Next.js frontend
│   ├── app/                # App router (Next.js 14)
│   │   ├── board/         # Board pages
│   │   ├── api/           # API routes
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Landing page
│   ├── components/        # React components
│   │   ├── ui/            # Reusable UI (buttons, cards)
│   │   ├── board/         # Board-specific components
│   │   └── auth/          # Auth components
│   ├── lib/               # Utilities
│   │   ├── api.ts         # API client
│   │   └── utils.ts        # Helper functions
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   └── tests/             # Frontend tests
│
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/          # API routes
│   │   │   ├── v1/        # API v1 endpoints
│   │   │   │   ├── auth.py
│   │   │   │   ├── boards.py
│   │   │   │   ├── lists.py
│   │   │   │   └── cards.py
│   │   │   └── deps.py    # Dependencies
│   │   ├── core/          # Core config
│   │   │   ├── config.py  # Settings
│   │   │   └── security.py
│   │   ├── db/            # Database
│   │   │   ├── base.py    # SQLAlchemy base
│   │   │   ├── session.py # DB session
│   │   │   └── models.py  # DB models
│   │   ├── schemas/       # Pydantic schemas
│   │   │   ├── auth.py
│   │   │   ├── board.py
│   │   │   └── card.py
│   │   ├── services/      # Business logic
│   │   └── main.py        # FastAPI app
│   ├── tests/             # Backend tests
│   │   ├── api/           # API tests
│   │   └── conftest.py    # Test fixtures
│   ├── alembic/           # DB migrations
│   ├── .env               # Environment (not in git)
│   ├── requirements.txt
│   └── uvicorn_config.py
│
├── docker/                # Docker configs
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
├── .github/
│   └── workflows/
│       ├── test.yml       # CI pipeline
│       └── deploy.yml     # Deploy pipeline
│
├── .gitignore
├── README.md
├── LICENSE
└── Makefile              # Handy commands
```

## Development Commands

```bash
# Install
make install

# Run dev servers
make dev

# Run tests
make test

# Run with coverage
make coverage

# Lint
make lint

# Format
make format
```
