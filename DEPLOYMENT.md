# Flume Deployment Guide

## Current Production Architecture

| Component | Service | URL |
|-----------|---------|-----|
| Frontend | Vercel | https://flume.sh |
| Backend | Render | https://flume-api.onrender.com |
| Database | PostgreSQL (Render) | Render-managed |

---

## Quick Start (Vercel)

### Frontend (Vercel)

1. Fork this repository to your GitHub
2. Connect to Vercel
3. Deploy!

### Backend (Render)

1. Connect backend/ to GitHub
2. Create Web Service on Render
3. Environment Variables:
   ```
   DATABASE_URL=postgresql://user:pass@host/db
   SECRET_KEY=your-random-secret
   BACKEND_CORS_ORIGINS=https://flume.sh
   BASE_URL=https://flume.sh
   RESEND_API_KEY=re_xxx
   SMTP_FROM=Flume <noreply@yourdomain.com>
   ```
4. Deploy

---

## Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend  
cd frontend
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in frontend/.env.local
