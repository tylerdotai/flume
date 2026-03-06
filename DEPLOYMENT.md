# Flume Deployment Guide

## Current Production Architecture

| Component | Service | URL |
|-----------|---------|-----|
| Frontend | Cloudflare Tunnel (Titan) | https://flume.sh |
| Backend | Render | https://flume-api.onrender.com |
| Database | PostgreSQL (Render) | Render-managed |

---

## Quick Start (Production)

### Frontend (Cloudflare + Self-Hosted)

1. Clone repository to your server (Titan)
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Create `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://flume-api.onrender.com
   ```
4. Run in dev mode:
   ```bash
   PORT=3002 npm run dev
   ```
5. Set up Cloudflare tunnel:
   ```bash
   # Install cloudflared
   curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared
   chmod +x /usr/local/bin/cloudflared
   
   # Login and create tunnel
   cloudflared tunnel login
   cloudflared tunnel create flume
   
   # Run tunnel
   cloudflared tunnel run --url http://localhost:3002 flume
   ```
6. In Cloudflare DNS: Add CNAME flume.sh → flume.pages.dev

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
