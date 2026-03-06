# Flume Deployment Guide - Free Tier 2026

## Architecture Overview

| Component | Service | Free Limits |
|-----------|---------|-------------|
| Database | Supabase | 500MB, 2 concurrent |
| Backend | Render | 750 hrs/month, spins down |
| Frontend | Vercel | Unlimited bandwidth |
| Media | Cloudinary | 25GB/year |
| DNS | Cloudflare | Free |

---

## Step 1: Database (Supabase)

1. Create account at supabase.com
2. New Project → Note credentials
3. Get connection string:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
   ```

---

## Step 2: Backend (Render)

1. Push code to GitHub
2. Connect GitHub to Render
3. Settings:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables:
   ```
   DATABASE_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres
   SECRET_KEY=your-random-secret-key
   BACKEND_CORS_ORIGINS=https://your-app.vercel.app
   ```
5. **Keep-alive**: Add cron job to ping every 55 min

---

## Step 3: Frontend (Vercel)

1. Import GitHub repo
2. Settings:
   - Framework: Next.js
   - Build Command: `npm run build`
   - Install: `npm install --legacy-peer-deps`
3. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://flume-api.onrender.com
   ```

---

## Step 4: Update Flume Code

### backend/app/core/config.py
```python
import os

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./flume.db")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-change-in-prod")
    BACKEND_CORS_ORIGINS: str = os.getenv("BACKEND_CORS_ORIGINS", "*")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

settings = Settings()
```

### requirements.txt updates
```
psycopg2-binary>=2.9.0
alembic>=1.13.0
```

---

## URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend | https://flume.vercel.app |
| Backend API | https://flume-api.onrender.com |
| API Docs | https://flume-api.onrender.com/docs |
| Supabase | https://supabase.com/dashboard |

---

## Keep-Alive Script (Render)

Create `keep_alive.py`:
```python
from flask import Flask
import requests
import os

app = Flask(__name__)

@app.route('/')
def ping():
    return 'OK'

@app.route('/wake')
def wake():
    # Your backend URL
    url = os.getenv("TARGET_URL")
    try:
        requests.get(url, timeout=5)
    except:
        pass
    return 'Woken'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

Add to Render as separate background service.

---

## Cloudinary Setup (Media)

1. Create Cloudinary account
2. Get API credentials
3. Add to backend:
```python
import cloudinary

cloudinary.config(
    cloud_name="your_cloud_name",
    api_key="your_api_key",
    api_secret="your_api_secret"
)
```

---

## Production Checklist

- [ ] Supabase project created
- [ ] Database migrated (alembic upgrade)
- [ ] Render backend deployed
- [ ] Vercel frontend deployed
- [ ] Environment variables set
- [ ] Custom domain (optional)
- [ ] SSL enabled (automatic on Vercel/Render)
