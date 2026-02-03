# Quick Start Guide

## 🚀 Start in 2 Minutes with Docker

### Prerequisites
- Docker & Docker Compose installed
- No database setup needed!

### Steps

1. **Navigate to project directory**
```bash
cd C:\workspaces\invest
```

2. **Create environment file (optional)**
```bash
copy .env.example .env
# Edit .env with your Google OAuth2 credentials if desired
# (Optional - app works fine without it for testing)
```

3. **Start all services**
```bash
docker-compose up -d
```

4. **Wait for services to start** (30-60 seconds)
```bash
docker-compose logs -f
```

5. **Access the application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api/health
- **WebSocket**: ws://localhost:8080/ws

6. **Stop services**
```bash
docker-compose down
```

---

## 📝 Environment Setup (First Time Only)

### Create `.env` file from example
```bash
cp .env.example .env
```

### Required Environment Variables (for OAuth2)
```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
```

### Optional - Get Google OAuth2 Credentials
1. Visit https://console.cloud.google.com
2. Create new project
3. Enable Google+ API
4. Create OAuth2 credentials (Web Application type)
5. Add authorized redirect URI: `http://localhost:8080/login/oauth2/code/google`
6. Copy Client ID & Secret to `.env`

If you skip this, the app will still run but OAuth2 login won't work (you can use mock data).

---

## 🐳 Docker Commands

```bash
# Start all services in background
docker-compose up -d

# View logs
docker-compose logs -f backend

# View specific service logs
docker-compose logs -f frontend
docker-compose logs -f postgres

# Stop all services
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v

# Rebuild images
docker-compose build

# View running services
docker-compose ps
```

---

## 💻 Local Development (Without Docker)

### Backend
```bash
cd backend
export SPRING_PROFILE=dev
mvn clean install
mvn spring-boot:run
# Backend runs on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### Database
PostgreSQL must be running:
```bash
# Using Docker (recommended)
docker run --name invest-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Or use your existing PostgreSQL installation
```

---

## 🧪 Mock Mode (No Database Needed!)

Run backend without PostgreSQL:
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=mock"
```

Mock mode includes:
- 10 sample users (3 admins, 4 startups, 3 investors)
- 5 sample startups with ideas
- Investment offers and messaging
- All features work perfectly!

---

## ✅ Verify Everything Works

### Check Backend Health
```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{
  "status": "UP",
  "timestamp": 1234567890000,
  "version": "1.0.0"
}
```

### Check Frontend
Open browser: http://localhost:3000

You should see login page with "Sign in with Google" button.

---

## 📚 Next Steps

1. **Read Full Documentation**: See `README.md`
2. **API Documentation**: See API Endpoints section in README
3. **Database Schema**: See Database Schema section
4. **Contributing**: Follow guidelines in README

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5432
lsof -ti:5432 | xargs kill -9
```

### PostgreSQL Connection Failed
```bash
# Start PostgreSQL container
docker run --name invest-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Clear Everything & Start Fresh
```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild images
docker-compose build

# Start fresh
docker-compose up -d
```

---

## 📖 Documentation

- **Full Setup**: README.md
- **API Endpoints**: README.md → API Endpoints section
- **Database Schema**: README.md → Database Schema section
- **Configuration**: README.md → Configuration section

---

**Happy coding! 🚀**
