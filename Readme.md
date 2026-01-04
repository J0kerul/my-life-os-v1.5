# MyLifeOS v1.5

Personal Life Operating System - Full-Stack Web Application for comprehensive life management.

## 🎯 Features

- **Task & Project Management** - Multi-domain task tracking with priorities
- **Daily Routines & Habits** - Habit tracking with streaks
- **Schedule & Calendar** - Weekly timeline and event management
- **Finance Manager** - Budget tracking and expense overview
- **Workout Planner** - Fitness tracking and workout logging
- **Media Library** - Books, movies, shows, and podcasts tracking

## 🏗️ Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand (State Management)
- React Query (Server State)

**Backend:**
- Go 1.21+
- Fiber (Web Framework)
- GORM (ORM)
- PostgreSQL 16
- JWT Authentication

**Infrastructure:**
- Docker & Docker Compose
- Railway (Deployment)

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
git clone 
cd my-life-os
```

2. **Start all services**
```bash
docker-compose up -d
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Database: localhost:5432

### First Time Setup

1. Open http://localhost:3000
2. Complete the setup wizard
3. Create your account
4. Start using MyLifeOS!

## 📋 Development

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Stop Services
```bash
docker-compose down
```

### Reset Database
```bash
docker-compose down -v
docker-compose up -d
```

## 📁 Project Structure

```
my-life-os/
├── my-life-os-frontend/     # Next.js Frontend
│   ├── app/                 # Pages & Layouts
│   ├── components/          # React Components
│   ├── lib/                 # Utilities
│   └── types/               # TypeScript Types
│
├── my-life-os-backend/      # Go Backend
│   ├── cmd/server/          # Entry point
│   ├── internal/
│   │   ├── domain/          # Business Logic
│   │   ├── repository/      # Data Layer
│   │   ├── service/         # Service Layer
│   │   └── handler/         # HTTP Layer
│   └── go.mod
│
└── docker-compose.yml       # Development setup
```

## 🔐 Environment Variables

Development variables are in `.env.dev` (committed for easy setup).

For production, create `.env.prod` with your own secrets.

## 📝 API Documentation

API runs on http://localhost:8080/api

**Endpoints:**
- `GET /api/status` - Check if setup is needed
- `POST /api/setup` - Initial account creation
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

More endpoints will be added as features are implemented.

## 🎨 Design System

**Colors:**
- Background: `#050505` (Ultra Dark)
- Foreground: `#e8e8e8` (Light Text)
- Primary: `#6366f1` (Indigo)
- Card: `#121418`

**Theme:** Deep Space Dark Mode with Glassmorphism effects

## 🛣️ Roadmap

- [x] Project Setup
- [x] Authentication System
- [ ] Task Management (Sprint 2)
- [ ] Daily Routines (Sprint 3)
- [ ] Projects Module
- [ ] Finance Module
- [ ] Calendar Module
- [ ] Media Library
- [ ] Workout System

## 📄 License

Personal Project - Not for commercial use