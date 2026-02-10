# Docker Compose Migration Guide

Complete guide to migrate from separate Docker containers to Docker Compose while preserving PostgreSQL data.

## 📋 Phase 1: Gather Current Configuration

### Step 1: List Running Containers

Run in your WSL terminal:

```bash
docker ps -a --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}"
```

Expected output:
```
NAMES               IMAGE                    PORTS                            STATUS
invest-frontend     invest-frontend:latest   0.0.0.0:3000->3000/tcp          Up
invest-backend      invest-backend:latest    0.0.0.0:8080->8080/tcp          Up
invest-postgres     postgres:15-alpine       0.0.0.0:5432->5432/tcp          Up
```

### Step 2: Get PostgreSQL Credentials

```bash
docker inspect invest-postgres | grep -E "POSTGRES_USER|POSTGRES_PASSWORD|POSTGRES_DB"
```

**Save these values:**
- `DB_USER = ___________`
- `DB_PASSWORD = ___________`
- `DB_NAME = ___________`

### Step 3: Check Current Ports

```bash
docker ps --format "{{.Names}}\t{{.Ports}}"
```

Note any custom port mappings.

## 💾 Phase 2: Backup PostgreSQL Data

### Critical: Create Backup BEFORE Stopping Containers

```bash
# Create backup directory
mkdir -p /c/workspaces/invest/backups

# Backup the entire database
docker exec invest-postgres pg_dump -U <DB_USER> <DB_NAME> > /c/workspaces/invest/backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

**Example:**
```bash
docker exec invest-postgres pg_dump -U postgres startup_platform > /c/workspaces/invest/backups/backup.sql
```

Verify backup:
```bash
ls -lh /c/workspaces/invest/backups/
du -h /c/workspaces/invest/backups/backup.sql
```

## ⚙️ Phase 3: Configure Environment

### Step 1: Create or Update .env File

Navigate to project root and create `.env`:

```bash
cd /c/workspaces/invest
```

Create file: `/c/workspaces/invest/.env`

```
# Database Configuration (REPLACE WITH YOUR ACTUAL VALUES)
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=startup_platform

# Port Configuration
POSTGRES_PORT=5432
BACKEND_PORT=8080
FRONTEND_PORT=3000

# Google OAuth2 (Optional - only if needed)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# JWT Configuration
JWT_SECRET=your-secret-key-must-be-at-least-32-characters-long-minimum
JWT_EXPIRY_MINUTES=15
JWT_REFRESH_EXPIRY_DAYS=7

# Spring Profile (dev, prod, mock)
SPRING_PROFILE=dev

# Frontend API URLs
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws
```

### Step 2: Verify .env File

```bash
cat /c/workspaces/invest/.env
```

Ensure all values are correct, especially:
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## 🚀 Phase 4: Stop Old Containers

### IMPORTANT: Verify Backup First!

```bash
# Check backup exists
ls -lh /c/workspaces/invest/backups/backup.sql
```

### Stop Containers (Data is safe!)

```bash
# Stop but don't remove containers yet
docker stop invest-frontend invest-backend invest-postgres

# Verify they're stopped
docker ps -a | grep invest
```

## 🐳 Phase 5: Start with Docker Compose

### Step 1: Build Images

```bash
cd /c/workspaces/invest

# Build backend image
docker-compose build backend

# Build frontend image
docker-compose build frontend

# Or build both
docker-compose build
```

### Step 2: Start Services

```bash
# Start all services in background
docker-compose up -d

# Check status immediately
docker-compose ps
```

Expected output:
```
NAME                 COMMAND                  SERVICE       STATUS
invest-postgres      "docker-entrypoint.s…"   postgres      Up (health: starting)
invest-backend       "java -jar /app/app.…"   backend       Up (health: starting)
invest-frontend      "nginx -g daemon off…"   frontend      Up
```

### Step 3: Wait for Services to Be Healthy

PostgreSQL takes ~30 seconds to start and become healthy:

```bash
# Watch status
docker-compose ps postgres

# Keep checking until you see "Up (healthy)"
# This may take 30-60 seconds

# View logs while waiting
docker-compose logs postgres
```

## 📊 Phase 6: Restore PostgreSQL Data

### Step 1: Verify PostgreSQL is Healthy

```bash
docker-compose ps postgres
```

Should show: `Up (healthy)`

### Step 2: Restore Backup

```bash
# Restore the SQL backup
docker exec -i invest-postgres psql -U <DB_USER> -d <DB_NAME> < /c/workspaces/invest/backups/backup.sql
```

**Example:**
```bash
docker exec -i invest-postgres psql -U postgres -d startup_platform < /c/workspaces/invest/backups/backup.sql
```

### Step 3: Verify Data Was Restored

```bash
# List tables
docker exec invest-postgres psql -U postgres -d startup_platform -c "\dt"

# Count users (or other data)
docker exec invest-postgres psql -U postgres -d startup_platform -c "SELECT COUNT(*) as total_users FROM users;"
```

You should see your existing tables and data!

## ✅ Phase 7: Verify All Services

### Test Backend Health

```bash
curl http://localhost:8080/api/health
```

Expected response:
```json
{
  "status": "UP",
  "timestamp": 1707468000000,
  "version": "1.0.0"
}
```

### Test Frontend

Open browser: **http://localhost:3000**

Should load the login page without errors.

### Check Database Connection

```bash
docker exec invest-postgres psql -U postgres -d startup_platform -c "SELECT * FROM users LIMIT 1;"
```

Should show your existing users.

### Review Logs

```bash
# View all logs
docker-compose logs

# View specific service
docker-compose logs backend
docker-compose logs postgres
docker-compose logs frontend
```

## 🔄 Service Management

### Common Commands

```bash
# Start services
docker-compose up -d

# Stop services (data preserved)
docker-compose down

# View status
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

## 🔧 Troubleshooting

### Issue: "Backend cannot connect to database"

```bash
# Check PostgreSQL is healthy
docker-compose ps postgres
# Should show "Up (healthy)"

# If not healthy, check logs
docker-compose logs postgres

# Wait longer (may still initializing)
sleep 30
docker-compose ps postgres
```

### Issue: "Frontend cannot reach backend API"

```bash
# Test backend is accessible
curl http://localhost:8080/api/health

# If fails, check backend logs
docker-compose logs backend

# Restart all services
docker-compose down
docker-compose up -d
sleep 30
curl http://localhost:8080/api/health
```

### Issue: "Data was not restored"

```bash
# Verify backup file
ls -lh /c/workspaces/invest/backups/backup.sql

# Restore again
docker exec -i invest-postgres psql -U postgres < /c/workspaces/invest/backups/backup.sql

# Verify data
docker exec invest-postgres psql -U postgres -d startup_platform -c "SELECT COUNT(*) FROM users;"
```

### Issue: "Port already in use"

```bash
# Edit .env and change port:
# BACKEND_PORT=8081
# FRONTEND_PORT=3001
# POSTGRES_PORT=5433

# Then restart
docker-compose down
docker-compose up -d
```

### Issue: "Containers keep restarting"

```bash
# View logs without background mode to see errors
docker-compose up

# Common issues:
# 1. Database not ready
# 2. Wrong credentials in .env
# 3. Port conflicts

# Ctrl+C to stop, then fix .env and retry
```

## 📝 Complete Docker Compose Reference

```bash
# Build services
docker-compose build                      # Build all
docker-compose build backend              # Build specific

# Start/Stop
docker-compose up                         # Start in foreground
docker-compose up -d                      # Start in background
docker-compose down                       # Stop services
docker-compose down -v                    # Stop and remove volumes (DATA LOSS!)
docker-compose restart                    # Restart all services

# Status
docker-compose ps                         # Show status
docker-compose images                     # Show built images

# Logs
docker-compose logs                       # View all logs
docker-compose logs -f                    # Follow logs
docker-compose logs -f backend            # Follow specific service
docker-compose logs --tail 50             # Show last 50 lines

# Execute
docker-compose exec postgres psql -U
