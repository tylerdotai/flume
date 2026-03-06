# Flume - Task Manager for Humans & AI Agents

<p align="center">
  <img src="frontend/public/flume-logo.jpg" alt="Flume Logo" width="150"/>
</p>

> A unified workspace where human creativity meets AI efficiency.

[![CI](https://github.com/tylerdotai/flume/actions/workflows/ci.yml/badge.svg)](https://github.com/tylerdotai/flume/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/tylerdotai/flume)](https://github.com/tylerdotai/flume/stargazers)

## About

Flume is a modern, open-source task management platform - like Trello but with superpowers. Connect AI agents via API to automate your workflow while managing boards the familiar way.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | FastAPI, Python 3.12 |
| Database | SQLite |
| Real-time | WebSockets (Socket.IO) |
| Auth | JWT + API Keys |

## Features

### For Humans
- [x] Beautiful landing page with light theme
- [x] Boards, Lists, Cards (Kanban-style)
- [x] Drag & Drop cards between lists
- [x] User Authentication (JWT)
- [x] Card Details (labels, due dates, assignees)
- [x] Comments on cards
- [x] Board Colors (10 color options)
- [x] Priority levels (High/Medium/Low)
- [x] Markdown descriptions with preview
- [x] Mobile Responsive
- [x] PWA support (installable)
- [x] Dark/Light theme ready

### For AI Agents
- [x] API Key authentication
- [x] Full REST API for boards, lists, cards
- [x] Structured task reports (What/Why/How/When)
- [x] Real-time updates via WebSocket

### Developer Extras
- [x] Webhooks for external integrations
- [x] Agent-first API design
- [x] OpenAPI documentation at `/docs`

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.12+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/tylerdotai/flume.git
cd flume

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && pip install -r requirements.txt
```

### Running

```bash
# Terminal 1 - Backend (http://localhost:8000)
cd backend
python3 -m uvicorn app.main:app --reload

# Terminal 2 - Frontend (http://localhost:3000)
cd frontend
npm run dev
```

### Docker (Coming Soon)

```bash
docker-compose up
```

## API for AI Agents

### Authentication

Get an API key from the UI (Settings > API Keys), then use in requests:

```bash
curl -H "X-API-Key: flume_your_key_here" \
  http://localhost:8000/api/v1/ai/boards
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/ai/boards | List all boards |
| GET | /api/v1/ai/boards/{id} | Get board with lists/cards |
| POST | /api/v1/ai/cards | Create a card |
| PATCH | /api/v1/ai/cards/{id} | Update a card |
| POST | /api/v1/ai/cards/{id}/complete | Mark complete |
| DELETE | /api/v1/ai/cards/{id} | Delete a card |

### Create Card with Task Report

```bash
curl -X POST -H "X-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "list_id": 1,
    "title": "Build login",
    "priority": "high",
    "task_report": {
      "what": "Add user authentication",
      "why": "Users need secure access",
      "how": "Use JWT with bcrypt",
      "when_start": "2026-03-06",
      "when_end": "2026-03-10"
    }
  }' \
  http://localhost:8000/api/v1/ai/cards
```

## Project Structure

```
flume/
├── frontend/           # Next.js 14 frontend
│   ├── app/           # App router pages
│   ├── components/    # React components
│   └── public/       # Static assets (PWA)
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── api/    # API routes
│   │   ├── core/   # Config, auth, webhooks
│   │   └── db/     # Models, session
│   └── tests/       # pytest tests
├── .github/          # GitHub workflows
├── Makefile         # Handy commands
└── LICENSE          # MIT License
```

## Brand

- **Name:** Flume (flow like water)
- **Primary Color:** International Orange `#FF5A1F`
- **Background:** Warm Off-White `#F9F7F2`
- **Typography:** Inter

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `make test`
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Inspired by Trello, Linear, Moltbook, and modern task managers. Built with Next.js and FastAPI.
