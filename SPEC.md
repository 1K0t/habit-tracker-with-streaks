# **TECHNICAL SPECIFICATION DOCUMENT**

## _Habit Tracker with Streaks — Full‑Stack Application_

**Version:** 1.0  
**Date:** April 2026  
**Author:** Serhii Savchuk  
**Intended for:** Claude Code and human developers

---

# 1. **Project Overview**

The Habit Tracker with Streaks is a multi‑user full‑stack application that allows users to:

- Track daily habits
- Record daily check‑ins
- View current and best streaks
- Receive milestone notifications in real time (WebSocket)
- Authenticate using Google or GitHub via SSO
- Maintain fully private user data

The application is designed as a modern cloud‑ready system, but MVP must run locally.

---

# 2. **Architecture Overview**

## 2.1 System Components

    ┌────────────────────────────────────────────┐
    │                Frontend (Next.js)          │
    │  - Next.js (App Router)                     │
    │  - NextAuth.js (Google + GitHub SSO)        │
    │  - Client UI (React + Tailwind or ShadCN)   │
    │  - API calls to Backend                     │
    │  - WebSocket client                         │
    └────────────────────────────────────────────┘
                     │  REST + JWT
                     ▼
    ┌────────────────────────────────────────────┐
    │                Backend (NestJS)            │
    │  - Fastify HTTP API                         │
    │  - NestJS Modules                           │
    │     • Users                                 │
    │     • Habits                                │
    │     • Check-ins                             │
    │     • Milestones                            │
    │     • WebSocket Gateway                     │
    │  - JWT token verification                    │
    └────────────────────────────────────────────┘
                     │  Prisma ORM
                     ▼
    ┌────────────────────────────────────────────┐
    │              PostgreSQL Database           │
    │  - Users (NextAuth)                         │
    │  - Accounts (NextAuth)                      │
    │  - Sessions (optional)                      │
    │  - Habits                                   │
    │  - CheckIns                                 │
    │  - MilestoneLog                             │
    └────────────────────────────────────────────┘

---

# 3. **Technology Stack**

## 3.1 Frontend

- **Next.js 15+**
- **React**
- **TypeScript**
- **NextAuth.js**
- **TailwindCSS or ShadCN/UI**
- **Axios or Fetch API**
- **Socket.IO client**

## 3.2 Backend

- **NestJS**
- **Fastify adapter**
- **Socket.IO Gateway**
- **Prisma ORM**
- **JWT authentication (NextAuth‑generated tokens)**

## 3.3 Database

- **PostgreSQL**
- Migrations managed by Prisma

---

# 4. **Authentication Flow**

## 4.1 Auth Implementation

✅ Authentication is handled entirely by **NextAuth.js** in the frontend.  
✅ Google & GitHub OAuth providers are configured in Next.js.  
✅ NextAuth uses **PrismaAdapter** to persist user accounts.

## 4.2 Session Strategy

Use **JWT sessions** (NextAuth option: `session.strategy = 'jwt'`).

## 4.3 Token Flow

### Login:

1.  User authenticates via Google/GitHub in Next.js
2.  NextAuth creates or loads Prisma user
3.  NextAuth issues JWT session token
4.  Token is available via:
    - `getServerSession`
    - Client session
    - API middleware

### API calls to backend:

Frontend includes token in headers:

    Authorization: Bearer <jwt>

### WebSocket handshake:

    ws://localhost:4000/notifications?token=<jwt>

## 4.4 Backend Authorization

NestJS verifies:

- signature
- expiration
- `sub` = userId

Attaches `req.userId`.

---

# 5. **Data Model (Prisma)**

## 5.1 Schema Overview

```prisma
model User {
  id        String   @id @default(cuid())
  name      String?
  email     String?  @unique
  image     String?
  accounts  Account[]
  habits    Habit[]
}

model Account {
  id                String @id @default(cuid())
  userId            String
  provider          String
  providerAccountId String

  user User @relation(fields: [userId], references: [id])

  @@unique([provider, providerAccountId])
}

model Habit {
  id          String   @id @default(cuid())
  userId      String
  name        String
  description String?
  startDate   DateTime
  status      HabitStatus
  checkIns    CheckIn[]
  milestones  MilestoneLog[]

  user User @relation(fields: [userId], references: [id])
}

model CheckIn {
  id        String   @id @default(cuid())
  habitId   String
  date      DateTime

  habit Habit @relation(fields: [habitId], references: [id])

  @@unique([habitId, date])
}

model MilestoneLog {
  id        String   @id @default(cuid())
  habitId   String
  milestone Int
  createdAt DateTime @default(now())

  habit Habit @relation(fields: [habitId], references: [id])

  @@unique([habitId, milestone])
}

enum HabitStatus {
  ACTIVE
  PAUSED
  ARCHIVED
}
```

---

# 6. **Backend API Specification (REST)**

Base URL (local):

    http://localhost:4000/api

All endpoints require a valid JWT.

---

## 6.1 **/habits**

### POST `/habits`

Create habit.

Request:

```json
{
  "name": "Drink water",
  "description": "8 glasses",
  "startDate": "2026-04-02"
}
```

### GET `/habits`

Query params:

- `search`
- `status`
- `completedToday`

### PATCH `/habits/:id`

### DELETE `/habits/:id`

---

## 6.2 **Check-ins**

### POST `/habits/:id/checkins/today`

### DELETE `/habits/:id/checkins/today`

---

## 6.3 **Streak calculations**

Included inside the GET `/habits` and GET `/habits/:id` (precomputed server-side):

- `currentStreak`
- `bestStreak`
- `totalCheckIns`

---

# 7. **WebSocket Specification**

## Endpoint:

    ws://localhost:4000/notifications?token=<jwt>

## 7.1 Client → Server

Message types:

```json
{ "type": "subscribe" }
```

```json
{ "type": "ack", "milestoneId": "xyz" }
```

## 7.2 Server → Client (milestone notification)

```json
{
  "type": "milestone",
  "habitId": "abc123",
  "milestone": 7,
  "timestamp": "2026-04-02T10:00:00Z"
}
```

Milestones:

- 3 days
- 7 days
- 30 days

---

# 8. **Business Logic**

## 8.1 Habit Rules

- Only ACTIVE habits can receive check-ins
- PAUSED & ARCHIVED cannot
- ARCHIVED = read-only
- Deleting removes check-ins **or** requires archive first (developer documents)

## 8.2 Check-in Rules

- One per habit per date
- Only for today
- No backfilling
- No future dates

## 8.3 Streak Rules

- Based on **calendar days**
- Gap breaks streak
- Paused does **not** preserve streak
- Best streak is historical max

---

# 9. **Frontend UI Specification**

## Screens:

- Login screen
- Habit list
- Habit create/edit
- Habit detail
- Calendar view (month)
- Notification panel

## UX Requirements:

- Modern styling
- Responsive
- Hover & focus states
- Empty states
- Loading states
- Client-side validation
- Light theme only

---

# 10. **Testing Requirements**

## Required Automated Tests

### Authentication

- Mocked SSO login success
- JWT validation in NestJS

### Habits

- Create habit
- Edit habit
- Delete/Archive logic

### Check-ins

- Create today check-in
- Prevent duplicate check-in

### Authorization

- User cannot access another user’s data

### WebSocket

- Milestone notifications for 3/7/30 days
- Ensure not repeated across reconnects
- Client → server message changes server behavior

---

# 11. **Environment Variables**

## NextAuth (frontend)

    NEXTAUTH_SECRET=
    NEXTAUTH_URL=
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    GITHUB_CLIENT_ID=
    GITHUB_CLIENT_SECRET=
    DATABASE_URL=postgresql://...
    BACKEND_API_URL=http://localhost:4000/api
    WS_URL=ws://localhost:4000/notifications

## Backend

    DATABASE_URL=postgresql://...
    JWT_PUBLIC_KEY=...
    PORT=4000

---

# 12. **Local Development Setup**

## Frontend

    cd frontend
    npm install
    npm run dev

## Backend

    cd backend
    npm install
    npx prisma migrate dev
    npm run start:dev

## Database

- PostgreSQL 14+
- Local install or Docker container

---

# 13. **Acceptance Criteria**

✅ User can sign in with Google & GitHub  
✅ Local user record created automatically  
✅ User can create/edit/delete habits  
✅ User can add & undo today’s check-in  
✅ Streaks calculated correctly  
✅ Search & filters working  
✅ Data fully isolated per user  
✅ Real-time milestone notifications  
✅ No duplicate milestone notifications  
✅ WebSocket supports client → server messages  
✅ App runs locally using README instructions  
✅ Tests pass

---

✅ **“14. Monorepo Architecture (Yarn + Workspaces)”**  
(or “Monorepo Setup” if you want to insert earlier)

Below is the exact **ready‑to‑paste specification block** you can drop directly into your TECHNICAL SPECIFICATION DOCUMENT.

---

# ✅ **14. Monorepo Architecture (Yarn Workspaces)**

The project will be structured as a **Yarn Workspaces monorepo**, containing:

- `frontend` — Next.js application (NextAuth, UI, client)
- `backend` — NestJS API + WebSocket gateway
- `shared` — shared TypeScript libraries (types, DTOs, schema definitions)
- `infrastructure` — optional (Docker, database scripts, etc.)

### ✅ Monorepo Goals

- Centralized dependency management
- Shared code between frontend & backend (types, interfaces, utilities)
- Consistent tooling (ESLint, Prettier, TS configs)
- Easy for Claude Code to navigate and modify
- Clear separation of domains (frontend/backend independent but coordinated)

---

# ✅ **14.1 Monorepo Folder Structure**

    habit-tracker-with-streaks/
      package.json
      yarn.lock
      tsconfig.json
      README.md

      frontend/       # Next.js + NextAuth
        package.json
        app/
        components/
        lib/
        types/

      backend/        # NestJS + Fastify + Prisma
        package.json
        src/
        prisma/

      shared/         # Shared TS modules
        package.json
        types/
          api/
          domain/
        utils/

      infrastructure/ # optional: docker-compose, init scripts
        docker-compose.yml
        migrations.sql

---

# ✅ **14.2 Root package.json (Yarn Workspaces)**

The root `package.json` must declare workspaces:

```json
{
  "name": "habit-tracker-monorepo",
  "private": true,
  "workspaces": ["frontend", "backend", "shared"]
}
```

---

# ✅ **14.3 Shared Package**

The `shared` workspace is used by both frontend & backend.

Common examples stored here:

✅ Shared API types  
✅ Habit/CheckIn interfaces  
✅ DTOs  
✅ Date utilities  
✅ Enum definitions  
✅ Error code enums

`shared/package.json`:

```json
{
  "name": "@habit/shared",
  "version": "1.0.0",
  "main": "index.ts",
  "types": "index.ts"
}
```

Frontend/backend import:

```ts
import { Habit, CheckIn } from "@habit/shared/types";
```

---

# ✅ **14.4 Tooling Integration**

### Root-level tools:

- **ESLint config**
- **Prettier config**
- **TypeScript base config**
- **Husky + lint-staged** (optionally)
- **TurboRepo** (optional upgrade later)

Root `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./shared" },
    { "path": "./backend" },
    { "path": "./frontend" }
  ]
}
```

---

# ✅ **14.5 Development Workflow in Monorepo**

### Install dependencies for whole repo:

    yarn install

### Run frontend:

    yarn workspace frontend dev

### Run backend:

    yarn workspace backend start:dev

### Run Prisma migration:

    yarn workspace backend prisma migrate dev

### Run tests:

    yarn workspaces run test

---

# ✅ **14.6 Environment Management**

Every package has its own `.env`:

    frontend/.env.local
    backend/.env

A root `.env` is **not recommended** to avoid leaking secrets.

---

# ✅ **14.7 Benefits of Monorepo for This Project**

### ✅ Shared Types = no mismatches

The frontend & backend always use the same API types.

### ✅ Better consistency

Same lint rules, same formatting, same TS configuration.

### ✅ Easy scaling

Add new services (e.g., cron worker, analytics) into same monorepo.

### ✅ Claude Code works more efficiently

It can reference all folders and automatically generate coordinated changes.

---

# ✅ **14.8 Optional Enhancements (Future)**

If you want an enterprise-grade monorepo:

- Add **Turborepo** for task pipelines
- Add **Docker Compose** for full local dev
- Add **scripts/** package for CLI tools
- Add **e2e tests** at root

---
