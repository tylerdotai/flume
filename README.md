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
| Frontend | Next.js 15, React 19, Tailwind CSS |
| Backend | FastAPI, Python 3.12 |
| Database | PostgreSQL (Render) |
| Real-time | WebSockets (Socket.IO) |
| Auth | JWT + API Keys |
| Deployment | Cloudflare Tunnel |

## Features

### For Humans
- [x] Beautiful landing page with light theme
- [x] Boards, Lists, Cards (Kanban-style)
- [x] Drag & Drop cards between lists
- [x] User Authentication (JWT)
- [x] Email verification
- [x] Password reset
- [x] Card Details (labels, due dates, assignees)
- [x] Comments on cards
- [x] Board Colors (10 color options)
- [x] Priority levels (High/Medium/Low)
- [x] Markdown descriptions with preview
- [x] Mobile Responsive
- [x] PWA support (installable)

### For AI Agents
- [x] API Key authentication
- [x] Full REST API for boards, lists, cards
- [x] Structured task reports (What/Why/How/When)
- [x] Real-time updates via WebSocket

### Developer Extras
- [x] Webhooks for external integrations

## Deployment

### Production URLs

| Service | URL |
|---------|-----|
| Frontend | https://flume.sh |
| Backend API | https://flume-api.onrender.com |

### Self-Hosted Deployment

#### Option 1: Cloudflare Tunnel (Recommended)

**Frontend runs on your own server (Titan):**

1. Clone the repository
2. Install dependencies: `cd frontend && npm install`
3. Set environment:
   ```
   NEXT_PUBLIC_API_URL=https://flume-api.onrender.com
   ```
4. Run: `PORT=3002 npm run dev`
5. Set up Cloudflare tunnel to expose to internet

#### Option 2: Vercel + Render

**Frontend on Vercel, Backend on Render:**

1. Fork this repository
2. Connect frontend to Vercel
3. Connect backend to Render
4. Set environment variables:
   - Frontend: `NEXT_PUBLIC_API_URL=https://your-backend.render.com`
   - Backend: `DATABASE_URL`, `SECRET_KEY`, etc.

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

Built with by [@tylerdotai](https://x.com/tylerdotai)
