# Habit Tracker — Frontend

Next.js application providing the UI and authentication layer for the Habit Tracker.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **NextAuth.js** (Google + GitHub SSO, JWT sessions)
- **Axios** (REST API calls)
- **Socket.IO Client** (real-time milestone notifications)
- **Zustand** (lightweight state management)
- **TypeScript** (strict mode)

## Architecture

```mermaid
graph TD
    subgraph Pages["App Router (app/)"]
        Login["/ — Login"]
        List["/habits — Habit List"]
        Create["/habits/create — Create Habit"]
        Detail["/habits/[id] — Habit Detail"]
    end

    subgraph Components
        HabitCard
        HabitForm
        CalendarView
        NotificationToaster
        Filters
    end

    subgraph Services["lib/"]
        APIClient["api.ts — Axios + JWT"]
        WSClient["ws.ts — Socket.IO Client"]
        AuthLib["auth.ts — NextAuth helpers"]
    end

    Pages --> Components
    Components --> APIClient -->|REST + JWT| Backend["Backend API :3001"]
    Components --> WSClient -->|WebSocket + JWT| Backend
    Pages --> AuthLib -->|NextAuth| OAuth["Google / GitHub"]
```

## Environment Variables

Create `frontend/.env.local`:

```env
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GITHUB_CLIENT_ID=<your-github-client-id>
GITHUB_CLIENT_SECRET=<your-github-client-secret>
DATABASE_URL=postgresql://user:password@localhost:5432/habittracker
BACKEND_API_URL=http://localhost:3001/api
WS_URL=ws://localhost:3001/notifications
```

## Development

```bash
# From monorepo root
yarn dev:frontend

# Or directly
cd frontend
yarn dev
```

Runs on [http://localhost:3000](http://localhost:3000).

## Scripts

| Command       | Description              |
| ------------- | ------------------------ |
| `yarn dev`    | Start dev server (:3000) |
| `yarn build`  | Production build         |
| `yarn start`  | Start production server  |
| `yarn lint`   | Run ESLint               |
| `yarn format` | Run Prettier             |
| `yarn test`   | Run tests                |
