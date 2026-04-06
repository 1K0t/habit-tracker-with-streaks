# Habit Tracker with Streaks

A multi-user full-stack application for tracking daily habits, recording check-ins, and maintaining streaks with real-time milestone notifications.

## Features

- Google & GitHub SSO authentication
- Create, edit, and manage daily habits
- Daily check-ins with streak tracking (current & best)
- Real-time milestone notifications via WebSocket (3, 7, 30 days)
- Search and filter habits
- Fully private per-user data

## Tech Stack

| Layer    | Technology                                                 |
| -------- | ---------------------------------------------------------- |
| Frontend | Next.js 16, React 19, TypeScript, NextAuth.js, TailwindCSS |
| Backend  | NestJS, Fastify, Socket.IO, Prisma ORM                     |
| Database | PostgreSQL                                                 |
| Shared   | TypeScript types, DTOs, utilities                          |

## Architecture

```mermaid
graph TD
    subgraph Frontend["Frontend (Next.js)"]
        UI[React UI + TailwindCSS]
        Auth[NextAuth.js - Google/GitHub SSO]
        WSClient[Socket.IO Client]
    end

    subgraph Backend["Backend (NestJS + Fastify)"]
        API[REST API]
        JWTGuard[JWT Auth Guard]
        Modules[Habits / CheckIns / Milestones]
        WSGateway[WebSocket Gateway]
    end

    subgraph DB["PostgreSQL"]
        Prisma[Prisma ORM]
        Tables[(Users, Habits, CheckIns, MilestoneLog)]
    end

    UI -->|REST + JWT| API
    Auth -->|Issues JWT| UI
    API --> JWTGuard --> Modules
    Modules --> Prisma --> Tables
    WSClient <-->|WebSocket + JWT| WSGateway
    WSGateway --> Modules
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant NextAuth as NextAuth.js (Frontend)
    participant OAuth as Google / GitHub
    participant DB as PostgreSQL
    participant API as NestJS Backend

    User->>NextAuth: Click Sign In
    NextAuth->>OAuth: Redirect to OAuth provider
    OAuth-->>NextAuth: Auth code / token
    NextAuth-->>User: JWT session token (contains email + name)

    User->>API: API request (Authorization: Bearer JWT)
    API->>API: Verify JWT signature & expiration
    API->>DB: Upsert user by email (auto-create on first request)
    API-->>User: Response (user-scoped data)

    User->>API: WebSocket connect (?token=JWT)
    API->>API: Verify JWT on handshake
    API-->>User: Real-time milestone notifications
```

## Monorepo Structure

```
habit-tracker-with-streaks/
  package.json          # Yarn Workspaces root
  tsconfig.json         # TypeScript project references
  frontend/             # Next.js + NextAuth
    app/
    components/
    lib/
  backend/              # NestJS + Fastify + Prisma
    src/
    prisma/
  shared/               # Shared TS types, DTOs, utils
    types/
    utils/
```

## Prerequisites

- **Node.js** 18+
- **Yarn** 1.x (Classic)
- **PostgreSQL** 14+

## Environment Variables

### Frontend (`frontend/.env.local`)

```env
# NextAuth — encrypts the NextAuth session cookie
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=http://localhost:3000

# OAuth providers
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>

# JWT — signs the custom JWT forwarded to the backend (MUST match backend JWT_SECRET)
JWT_SECRET=<shared-jwt-secret>
JWT_EXPIRES_IN=1d

# Backend API (server-side only)
BACKEND_API_URL=http://localhost:4000/api

# Backend API (client-side, NEXT_PUBLIC_ prefix required)
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# WebSocket (client-side, NEXT_PUBLIC_ prefix required)
NEXT_PUBLIC_WS_URL=ws://localhost:4000/notifications
```

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/habittracker

# JWT — verifies tokens issued by the frontend (MUST match frontend JWT_SECRET)
JWT_SECRET=<shared-jwt-secret>

PORT=4000
```

> **Important:** `JWT_SECRET` must be the same value in both `frontend/.env.local` and `backend/.env`.
> The frontend signs a JWT with this secret after OAuth login; the backend verifies it on every request.
> `NEXTAUTH_SECRET` is separate — it is only used internally by NextAuth to encrypt its own session cookie.

## Local Development Setup

### 1. Install dependencies

```bash
yarn install
```

### 2. Set up PostgreSQL

Create a database:

```bash
createdb habittracker
```

Or using Docker:

```bash
docker run --name habittracker-db -e POSTGRES_DB=habittracker -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:14
```

### 3. Configure environment variables

Copy and fill in the `.env` files as described above:

```bash
cp frontend/.env.local.example frontend/.env.local
cp backend/.env.example backend/.env
```

### 4. Run database migrations

```bash
yarn dev:backend prisma migrate dev
```

### 5. Start the application

In separate terminals:

```bash
# Terminal 1 — Backend (http://localhost:4000)
yarn dev:backend

# Terminal 2 — Frontend (http://localhost:3000)
yarn dev:frontend
```

## Available Scripts

| Command             | Description                 |
| ------------------- | --------------------------- |
| `yarn dev:frontend` | Start Next.js dev server    |
| `yarn dev:backend`  | Start NestJS dev server     |
| `yarn build`        | Build all workspaces        |
| `yarn lint`         | Lint all workspaces         |
| `yarn format`       | Format all workspaces       |
| `yarn test`         | Run tests in all workspaces |
