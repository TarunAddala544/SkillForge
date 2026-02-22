# SkillForge

> A production-oriented full-stack learning analytics platform for tracking structured goals, activity logs, and weekly performance insights.

---

## 🚀 Overview

SkillForge implements clean architecture, JWT authentication with refresh token rotation, and an event-driven background processing system to generate optimized analytics.

---

## 🏗 Architecture

### Backend (Node.js + Express + TypeScript)

**Layered Architecture:** Routes → Controllers → Services → Prisma

- UUID primary keys
- DB-backed refresh tokens
- Centralized error handling (`AppError`)
- Zod request validation
- Rate limiting
- Composite DB indexes
- Hybrid analytics read strategy

### Event-Driven System

- Redis queue for activity events
- Background worker processes summary updates
- `WeeklySummary` materialized table
- **Hybrid read strategy:**
  - Materialized summary for full week range
  - Live aggregation for custom ranges

### Authentication

- JWT access tokens (15 min expiry)
- Refresh token rotation (7 days)
- HTTP-only refresh cookies
- DB-backed refresh invalidation
- Protected routes middleware

---

## 📊 Features

- Goal creation & tracking
- Activity logging
- Weekly analytics dashboard
- Date-range filtering
- Category breakdown visualization
- Redis-based background processing

---

## ⚡ Performance Optimization

- Materialized weekly summary table
- Composite unique index on summary
- `Promise.all` parallel DB queries
- ~80% faster dashboard reads compared to live aggregation

---

## 🛠 Tech Stack

| Layer    | Technologies                                      |
|----------|---------------------------------------------------|
| Frontend | Next.js (App Router), TypeScript, Axios, TailwindCSS, Recharts |
| Backend  | Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Redis |

---

## 📂 Project Structure

```
SkillForge/
├── backend/
│   ├── modules/        # Feature modules (auth, goals, activity, dashboard)
│   ├── middleware/     # Auth, error handling, rate limiting
│   ├── utils/          # Shared utilities
│   └── workers/        # Redis background workers
│
└── frontend/
    ├── app/            # Next.js App Router pages
    ├── components/     # Reusable UI components
    ├── services/       # API service layer
    └── context/        # React context providers
```

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js
- PostgreSQL
- Redis

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/skillforge"
JWT_SECRET="your_jwt_secret"
REFRESH_TOKEN_SECRET="your_refresh_secret"
REDIS_URL="redis://localhost:6379"
```

---

## 📌 Key Engineering Decisions

| Decision | Rationale |
|---|---|
| Refresh token rotation | Enhanced security — invalidates old tokens on each use |
| Event-driven summary generation | Avoids synchronous aggregation bottlenecks |
| Hybrid read model | Balances accuracy (live) with performance (materialized) |
| Layered architecture | Clear separation of concerns, easier to test and maintain |
| Zod validation | Defensive validation at the request boundary |
| Centralized error handling | Consistent API error responses via `AppError` |

---

## 🎯 Future Improvements

- [ ] WebSocket real-time dashboard updates
- [ ] Role-based access control (RBAC)
- [ ] Deployment (Vercel + Render)
- [ ] Automated testing suite
