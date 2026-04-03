# Habit Tracker — Backend

NestJS API providing REST endpoints, JWT authorization, and real-time WebSocket notifications for the Habit Tracker.

## Tech Stack

- **NestJS** with **Fastify** adapter
- **Prisma ORM** + **PostgreSQL**
- **Socket.IO** (WebSocket gateway)
- **JWT** verification (tokens issued by NextAuth)
- **TypeScript** (strict mode)

## Architecture

```mermaid
graph TD
    Client["Frontend :3000"] -->|REST + JWT| Controller

    subgraph NestJS["NestJS Application"]
        Controller["Controllers"] --> Guard["JWT Auth Guard"]
        Guard --> Service["Services"]

        subgraph Modules
            Auth["AuthModule — JWT validation"]
            Users["UsersModule — User lookup"]
            Habits["HabitsModule — CRUD + streaks"]
            CheckIns["CheckInsModule — Daily check-ins"]
            Milestones["MilestonesModule — 3/7/30 day tracking"]
        end

        Service --> Modules
        WSGateway["WebSocket Gateway"] --> Guard
        WSGateway -->|milestone events| Milestones
    end

    Service --> Prisma["Prisma ORM"]
    Prisma --> DB[(PostgreSQL)]
    Client <-->|WebSocket + JWT| WSGateway
```

## API Endpoints

Base URL: `http://localhost:3001/api`

All endpoints require `Authorization: Bearer <jwt>`.

| Method   | Endpoint                     | Description                |
| -------- | ---------------------------- | -------------------------- |
| `POST`   | `/habits`                    | Create habit               |
| `GET`    | `/habits`                    | List habits (with filters) |
| `GET`    | `/habits/:id`                | Get habit detail + streaks |
| `PATCH`  | `/habits/:id`                | Update habit               |
| `DELETE` | `/habits/:id`                | Delete habit               |
| `POST`   | `/habits/:id/checkins/today` | Check in today             |
| `DELETE` | `/habits/:id/checkins/today` | Undo today's check-in      |

## WebSocket

Endpoint: `ws://localhost:3001/notifications?token=<jwt>`

| Direction        | Message                                                     |
| ---------------- | ----------------------------------------------------------- |
| Client -> Server | `{ "type": "subscribe" }`                                   |
| Client -> Server | `{ "type": "ack", "milestoneId": "xyz" }`                   |
| Server -> Client | `{ "type": "milestone", "habitId": "abc", "milestone": 7 }` |

## Environment Variables

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/habittracker
JWT_PUBLIC_KEY=<nextauth-jwt-public-key>
PORT=3001
```

## Development

```bash
# From monorepo root
yarn dev:backend

# Or directly
cd backend
yarn start:dev
```

Runs on [http://localhost:3001](http://localhost:3001).

## Prisma Commands

```bash
yarn prisma:generate   # Generate Prisma client
yarn prisma:migrate    # Run migrations
yarn prisma:studio     # Open Prisma Studio GUI
```

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `yarn start:dev`  | Start dev server (watch) |
| `yarn build`      | Build for production     |
| `yarn start:prod` | Start production server  |
| `yarn lint`       | Run ESLint               |
| `yarn test`       | Run tests                |
