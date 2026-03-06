# Flume - Your Command Center

<p align="center">
  <img src="frontend/public/flume-logo.jpg" alt="Flume Logo" width="200"/>
</p>

> Your personal command center. Build, organize, ship.

[![CI](https://github.com/tylerdotai/flume/actions/workflows/ci.yml/badge.svg)](https://github.com/tylerdotai/flume/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/tylerdotai/flume)](https://github.com/tylerdotai/flume/stargazers)

## About

Flume is a modern, open-source task management platform built for builders. It features boards, lists, and cards - similar to Trello - but with a beautiful Ember-themed UI and self-hosted option.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, Tailwind CSS |
| Backend | FastAPI, Python |
| Database | SQLite |
| Real-time | WebSockets |
| Auth | JWT |

## Features

- [x] Beautiful landing page
- [x] Boards, Lists, Cards
- [x] Drag & Drop
- [x] User Authentication (JWT)
- [x] Card Details (labels, due dates)
- [x] Assignees
- [x] Comments
- [x] Board Colors
- [x] Dark Mode
- [x] Mobile Responsive
- [x] Real-time Updates
- [x] Webhooks

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.12+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/tylerdotai/flume.git
cd flume

# Install dependencies
make install
```

### Development

```bash
# Run both frontend and backend
make dev

# Or run separately:
# Terminal 1 - Backend (http://localhost:8000)
cd backend && uvicorn app.main:app --reload

# Terminal 2 - Frontend (http://localhost:3000)
cd frontend && npm run dev
```

### Testing

```bash
# Run all tests
make test

# Run with coverage
make coverage
```

## Project Structure

```
flume/
├── frontend/           # Next.js frontend
│   ├── app/          # App router pages
│   ├── components/   # React components
│   └── tests/        # Frontend tests
├── backend/          # FastAPI backend
│   ├── app/         # API code
│   └── tests/       # Backend tests
├── .github/         # GitHub workflows
├── Makefile         # Handy commands
└── LICENSE          # MIT License
```

## Brand

- **Name:** Flume
- **Colors:** 
  - Ember: `#FF6B35`
  - Black: `#0D0D0D`
  - Cream: `#F5F5F5`
- **Logo:** Abstract wave

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Inspired by Trello, Linear, and other modern task managers
- Built with Next.js and FastAPI
