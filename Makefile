# Makefile for Flume

.PHONY: install dev test coverage lint format clean docker-build docker-run

# Install dependencies
install:
	cd backend && pip install -r requirements.txt
	cd frontend && npm install

# Run development servers
dev:
	cd backend && uvicorn app.main:app --reload --port 8000 &
	cd frontend && npm run dev

# Run tests
test:
	cd backend && python -m pytest -v

# Run with coverage
coverage:
	cd backend && python -m pytest --cov=app --cov-report=html --cov-report=term

# Lint
lint:
	cd backend && ruff check app/
	cd frontend && npx eslint .

# Format code
format:
	cd backend && ruff format app/
	cd frontend && npx prettier --write .

# Clean
clean:
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	cd frontend && rm -rf .next

# Docker
docker-build:
	docker-compose build

docker-run:
	docker-compose up -d

# Production
prod:
	cd backend && gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
