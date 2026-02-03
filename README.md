# Startup Investment Platform

A full-stack web application that connects startups with investors. Built with Spring Boot, React, PostgreSQL, and WebSocket for real-time communication.

## Features

### 🎯 Three User Types

#### Admin
- Manage all users (create, edit, delete, suspend)
- Approve/reject startup and investor registrations
- View platform statistics and analytics
- Audit logging for all actions

#### Startup
- Create and manage company profiles
- Post and manage startup ideas/projects
- Receive investment offers from investors
- Browse and connect with investors
- Real-time messaging with interested investors
- Track investment pipeline

#### Investor
- Complete investment profile with preferences
- Browse and filter startup ideas by sector, stage, funding amount
- Save favorite startups
- Send investment offers with terms (amount, equity %)
- Track sent offers and investment portfolio
- Real-time messaging with startups

### 🔐 Security Features
- Google OAuth2 authentication (no passwords)
- JWT token-based authorization
- Role-based access control (RBAC)
- CORS protection
- SQL injection prevention
- WebSocket authentication

### 💬 Real-Time Communication
- WebSocket-based instant messaging between startups and investors
- Message history and conversation management
- Online status indicators
- Notification system

---

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Backend** | Spring Boot | 3.2.0 |
| **Security** | Spring Security + OAuth2 | 6.x |
| **Database** | PostgreSQL | 14+ |
| **ORM** | JPA + Hibernate | 6.x |
| **WebSocket** | Spring WebSocket + STOMP | 6.x |
| **Frontend** | React | 18.x |
| **UI Library** | Material-UI (MUI) | 5.x |
| **HTTP Client** | Axios | Latest |
| **Messaging** | SockJS + STOMP.js | Latest |
| **Build Tools** | Maven (Backend), Vite (Frontend) | Latest |
| **Containerization** | Docker & Docker Compose | Latest |

---

## Quick Start

### Option 1: Docker Compose (Recommended)

**Prerequisites:**
- Docker & Docker Compose installed
- Google OAuth2 credentials (optional for mock mode)

**Steps:**

1. Clone the repository
```bash
git clone <repo-url>
cd invest
```

2. Create environment file
```bash
cp .env.example .env
# Edit .env with your Google OAuth2 credentials (optional)
```

3. Start all services
```bash
docker-compose up -d
```

4. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API Docs: http://localhost:8080/api/health

5. Stop services
```bash
docker-compose down
```

---

### Option 2: Local Development

**Prerequisites:**
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven
- npm

**Steps:**

#### Backend Setup

```bash
cd backend

# Configure environment
export SPRING_PROFILE=dev
export DB_USER=postgres
export DB_PASSWORD=postgres

# Install dependencies
mvn clean install

# Run backend (Flyway migrations run automatically)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

Backend runs on: http://localhost:8080

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit VITE_API_URL=http://localhost:8080

# Run development server
npm run dev
```

Frontend runs on: http://localhost:3000

---

### Option 3: Mock Mode (No Database)

Run the backend in mock mode with in-memory data (perfect for testing without PostgreSQL):

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=mock"
```

**Mock mode includes:**
- 10 sample users (3 admins, 4 startups, 3 investors)
- 5 sample startups with ideas
- 3 sample investment offers
- All features work without a real database

---

## Project Structure

```
invest/
├── backend/                          # Spring Boot backend
│   ├── src/main/java/com/platform/
│   │   ├── auth/                     # OAuth2, JWT, Security
│   │   ├── user/                     # User management
│   │   ├── startup/                  # Startup & ideas
│   │   ├── investor/                 # Investor profiles
│   │   ├── investment/               # Investment offers
│   │   ├── messaging/                # WebSocket chat
│   │   ├── admin/                    # Admin operations
│   │   ├── exception/                # Error handling
│   │   └── util/                     # Utilities
│   ├── src/main/resources/
│   │   ├── application.yml           # Main config
│   │   ├── application-dev.yml       # Dev profile
│   │   ├── application-prod.yml      # Prod profile
│   │   ├── application-mock.yml      # Mock profile
│   │   └── db/migration/             # Flyway SQL migrations
│   └── pom.xml
│
├── frontend/                         # React frontend
│   ├── src/
│   │   ├── components/               # React components
│   │   ├── pages/                    # Page components
│   │   ├── services/                 # API & WebSocket clients
│   │   ├── contexts/                 # Auth context
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── types/                    # TypeScript types
│   │   ├── styles/                   # CSS styles
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml                # Multi-container setup
├── .env.example                      # Environment template
└── README.md                         # This file
```

---

## API Endpoints

### Authentication

```bash
# Google OAuth2 callback
POST /api/auth/google/callback

# Get current user
GET /api/auth/me

# Refresh token
POST /api/auth/refresh

# Logout
POST /api/auth/logout
```

### Users (Protected)

```bash
# Get user profile
GET /api/users/profile

# Update user profile
PUT /api/users/profile

# Upload profile picture
POST /api/users/profile/picture
```

### Admin Endpoints (Admin only)

```bash
# List all users
GET /api/admin/users?page=0&size=10

# Get user details
GET /api/admin/users/{userId}

# Approve pending user
POST /api/admin/users/{userId}/approve

# Suspend user
POST /api/admin/users/{userId}/suspend

# Get platform statistics
GET /api/admin/stats

# Get pending approvals
GET /api/admin/pending-approvals
```

### Startups

```bash
# List all startups (with filtering)
GET /api/startups?page=0&size=10&stage=MVP

# Get startup details
GET /api/startups/{startupId}

# Create startup (Startup users only)
POST /api/startups

# Create idea for startup
POST /api/startups/{startupId}/ideas

# List ideas for startup
GET /api/startups/{startupId}/ideas

# Get investment offers for startup
GET /api/startups/{startupId}/offers
```

### Investors

```bash
# List all investors
GET /api/investors?page=0&size=10

# Get investor details
GET /api/investors/{investorId}

# Get investor portfolio
GET /api/investors/{investorId}/portfolio
```

### Investment Offers

```bash
# Create investment offer
POST /api/offers

# Get offer details
GET /api/offers/{offerId}

# Accept offer
POST /api/offers/{offerId}/accept

# Reject offer
POST /api/offers/{offerId}/reject

# Get received offers
GET /api/offers/received

# Get sent offers
GET /api/offers/sent
```

### Messaging (WebSocket)

```
# Connect to WebSocket
WS /ws

# Send message
SEND /app/chat.send

# Subscribe to messages
SUBSCRIBE /topic/messages/{conversationId}

# Get conversation history
GET /api/conversations/{conversationId}/messages?page=0&size=50
```

---

## Database Schema

### Core Tables

- **users** - All user accounts (single table, role-based)
- **user_profiles** - Extended profile data by role
- **startups** - Startup company information
- **ideas** - Startup ideas/projects seeking funding
- **investors** - Investor profiles and preferences
- **investment_offers** - Investment proposals from investors
- **conversations** - Chat room metadata
- **messages** - Chat messages with timestamps
- **audit_logs** - Action logging for compliance
- **user_favorites** - Saved/favorited startups by investors

---

## Configuration

### Environment Variables

```bash
# Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=startup_platform

# Google OAuth2
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOO
