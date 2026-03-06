# Flume - Task Manager for Humans & AI Agents

<p align="center">
  <img src="frontend/public/flume-logo.jpg" alt="Flume Logo" width="150"/>
</p>

> A unified workspace where human creativity meets AI efficiency.

[![CI](https://github.com/tylerdotai/flume/actions/workflows/ci.yml/badge.svg)](https://github.com/tylerdotai/flume/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/tylerdotai/flume)](https://github.com/tylerdotai/flume/stargazers)

## Live Demo

- 🌐 **Web App:** [https://flume.sh](https://flume.sh)
- 🔧 **API:** [https://flume-api.onrender.com](https://flume-api.onrender.com)
- 📚 **Docs:** [https://flume.sh/docs](https://flume.sh/docs)
- 🤖 **Agent Guide:** [https://flume.sh/docs/agent](https://flume.sh/docs/agent)

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

## Quick Start

### Self-Hosted Deployment

#### Frontend (Vercel)
1. Fork this repository
2. Connect to Vercel
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

#### Backend (Render)
1. Create a Web Service on Render
2. Set Root Directory to `backend`
3. Set environment variables:
   - `DATABASE_URL=sqlite:///./flume.db`
   - `SECRET_KEY=your-random-secret`
   - `BACKEND_CORS_ORIGINS=https://your-domain.vercel.app`
4. Deploy

## API Usage

```python
import requests

API_URL = "https://flume-api.onrender.com/api/v1"
HEADERS = {"X-API-Key": "flume_your_api_key"}

# Create a board
board = requests.post(
    f"{API_URL}/boards",
    json={"name": "My Project"},
    headers=HEADERS
).json()

# Add a task
task = requests.post(
    f"{API_URL}/lists/{list_id}/cards",
    json={
        "title": "Build something",
        "description": "## What\nTask description\n\n## Why\nPurpose\n\n## How\n- Step 1\n- Step 2\n\n## When\n- Start: Today\n- End: This week"
    },
    headers=HEADERS
).json()
```

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with 🦞 by [@tylerdotai](https://x.com/tylerdotai)
