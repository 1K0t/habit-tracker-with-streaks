# ✅ **1. BACKEND IMPLEMENTATION PLAN (NestJS + Fastify + Prisma + JWT validation)**

This section defines **every NestJS module**, their responsibilities, entities, and key methods.

---

# 1.1 Backend Folder Structure

    backend/
      src/
        app.module.ts
        main.ts

        common/
          index.ts
          guards/
            index.ts
            jwt-auth.guard.ts
          decorators/
            index.ts
            user.decorator.ts
          middleware/
            index.ts
            jwt.middleware.ts
          utils/
            index.ts
            date.utils.ts
            streak.utils.ts

        auth/
          dto/
            index.js
            example.dto.ts
          interfaces/
            index.js
            example.interface.ts
          types/
            index.js
            example.type.ts
          auth.module.ts
          jwt.strategy.ts
          jwt.service.ts

        users/
          dto/
            index.js
            example.dto.ts
          interfaces/
            index.js
            example.interface.ts
          types/
            index.js
            example.type.ts
          users.module.ts
          users.service.ts
          users.controller.ts

        habits/
          dto/
            index.js
            example.dto.ts
          interfaces/
            index.js
            example.interface.ts
          types/
            index.js
            example.type.ts
          habits.module.ts
          habits.service.ts
          habits.controller.ts

        checkins/
          dto/
            index.js
            example.dto.ts
          interfaces/
            index.js
            example.interface.ts
          types/
            index.js
            example.type.ts
          checkins.module.ts
          checkins.service.ts
          checkins.controller.ts

        milestones/
          dto/
            index.js
            example.dto.ts
          interfaces/
            index.js
            example.interface.ts
          types/
            index.js
            example.type.ts
          milestones.module.ts
          milestones.service.ts

        websocket/
          dto/
            index.js
            example.dto.ts
          interfaces/
            index.js
            example.interface.ts
          types/
            index.js
            example.type.ts
          ws.module.ts
          ws.gateway.ts
          ws.adapter.ts

      prisma/
        schema.prisma
        migrations/

      package.json
      tsconfig.json

---

# ✅ **1.2 Backend Modules Breakdown**

## ✅ **Module 1: AuthModule**

Handles **JWT validation only**.

### Responsibilities:

- Validate tokens from NextAuth.js
- Extract `userId`
- Provide `JwtAuthGuard`

### Key files:

#### **jwt.strategy.ts**

- Validates signature
- Extracts payload
- Returns `{ userId }`

#### **jwt-auth.guard.ts**

- Attaches `req.userId` for controllers

---

## ✅ **Module 2: UsersModule**

### Responsibilities:

- Read-only user fetching
- Internal helper methods

### Methods:

```ts
findById(userId: string)
```

Used by other modules.

---

## ✅ **Module 3: HabitsModule**

### Responsibilities:

- CRUD for habits
- Enforce authorization
- Status changes (Active/Paused/Archived)
- Return streaks and stats

### Methods:

```ts
createHabit(userId, dto);
getHabits(userId, filters);
getHabitById(userId, id);
updateHabit(userId, id, dto);
deleteHabit(userId, id);
changeStatus(userId, id, status);
calculateStreaks(habitId);
```

---

## ✅ **Module 4: CheckInsModule**

### Responsibilities:

- Add/remove today check‑in
- Enforce habit status rules
- Unique constraint per day
- Trigger streak milestone evaluation

### Methods:

```ts
createTodayCheckIn(userId, habitId);
removeTodayCheckIn(userId, habitId);
getCheckInsForHabit(habitId);
```

---

## ✅ **Module 5: MilestonesModule**

### Responsibilities:

- Determine 3/7/30‑day streak milestone
- Store milestone logs
- Prevent duplicates

### Methods:

```ts
checkMilestones(habitId, currentStreak);
logMilestone(habitId, milestone);
alreadySent(habitId, milestone);
```

---

## ✅ **Module 6: WebSocketModule**

### Responsibilities:

- Real-time notifications
- Authenticate WS handshake with JWT
- Emit milestone notifications

### Events:

#### Client → Server

```json
{ "type": "subscribe" }
```

```json
{ "type": "ack", "milestoneId": "uuid" }
```

#### Server → Client

```json
{
  "type": "milestone",
  "habitId": "abc",
  "milestone": 7
}
```

---

# ✅ **2. FRONTEND IMPLEMENTATION PLAN (Next.js + NextAuth + React)**

---

# 2.1 Frontend Folder Structure (App Router)

    frontend/
      app/
        layout.tsx
        page.tsx (login)
        habits/
          page.tsx
          create/
            page.tsx
          [id]/
            page.tsx
        api/
          auth/[...nextauth]/route.ts

      components/
        index.ts
        HabitList/
          index.ts
          HabitList.tsx
          HabitList.types.ts
        HabitCard/
          index.ts
          HabitCard.tsx
          HabitCard.type.ts
        HabitForm/
          index.ts
          HabitForm.tsx
          HabitForm.type.ts
        HabitDetails/
          index.ts
          HabitDetails.tsx
          HabitDetails.type.ts
        CalendarView/
          index.ts
          CalendarView.tsx
          CalendarView.type.ts
        NotificationToaster/
          index.ts
          NotificationToaster.tsx
          NotificationToaster.type.ts
        Filters/
          index.ts
          Filters.tsx
          Filters.type.ts
        SearchInput/
          index.ts
          SearchInput.tsx
          SearchInput.type.ts

      hooks/
        index.ts
        useWebsocket.ts
        useHabits.ts

      lib/
        index.ts
        api.ts (axios client)
        auth.ts
        ws.ts

      types/
        index.ts
        api.ts
        habit.ts
        checkin.ts

      styles/
        globals.css

---

# ✅ **2.2 Component Tree**

    <AppLayout>
      <Navbar>

      /page (login)
        <SignInButtons />

      /habits
        <SearchInput />
        <Filters />
        <HabitList>
          <HabitCard />

      /habits/create
        <HabitForm />

      /habits/[id]
        <HabitDetails>
          <CalendarView />
          <TodayCheckInButton />
          <StreakInfo />

      <NotificationToaster />
    </AppLayout>

---

# ✅ **3. API Types (Shared Frontend Types)**

These go into: `frontend/types/api.ts`

```ts
export interface Habit {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  status: "ACTIVE" | "PAUSED" | "ARCHIVED";
  currentStreak: number;
  bestStreak: number;
  totalCheckIns: number;
}

export interface CheckIn {
  id: string;
  habitId: string;
  date: string;
}

export interface MilestoneNotification {
  type: "milestone";
  habitId: string;
  milestone: number;
  timestamp: string;
}
```

---

# ✅ **4. Prisma Schema Migration Strategy**

### Step 1 — Create base schema

- User, Account, Habit, CheckIn, MilestoneLog
- Enums (HabitStatus)

### Step 2 — Constraints

- `@@unique([habitId, date])`
- `@@unique([habitId, milestone])`
- `@@unique([provider, providerAccountId])`

### Step 3 — Seed (optional)

- Example habits for test accounts

---

# ✅ **5. API Endpoints (with request/response)**

## POST `/habits`

```json
{
  "name": "Meditation",
  "description": "10 minutes",
  "startDate": "2026-04-02"
}
```

Response:

```json
{
  "id": "1",
  "name": "Meditation",
  "status": "ACTIVE"
}
```

---

## POST `/habits/:id/checkins/today`

Response:

```json
{
  "success": true,
  "currentStreak": 3,
  "milestoneTriggered": 3
}
```

---

# ✅ **6. WebSocket Integration (Frontend Example)**

`useWebsocket.ts`:

```ts
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function useWebsocket(onMessage) {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    const socket = io(process.env.NEXT_PUBLIC_WS_URL, {
      auth: { token: session.user.jwt },
    });

    socket.on("message", onMessage);
    socket.emit("subscribe");

    return () => socket.disconnect();
  }, [session]);
}
```

---

# ✅ **7. Unit Tests (Backend)**

### Required test suites:

✅ Auth token validation  
✅ Creating a habit  
✅ Creating today's check-in  
✅ Prevent duplicate check-in  
✅ User cannot access another’s habits  
✅ WebSocket:

- milestone sent on correct streak
- milestone not re-sent
- client → server `subscribe` acknowledged

---

# ✅ **8. Local Development Workflow**

### Start frontend

    cd frontend
    npm install
    npm run dev

### Start backend

    cd backend
    npm install
    npx prisma migrate dev
    npm run start:dev

---

# ✅ **COMPLETE & READY FOR CLAUDE CODE**

This full implementation plan provides everything Claude Code needs:

✅ Folder structures (backend + frontend)  
✅ Modules for NestJS  
✅ Component tree for React  
✅ API types  
✅ WebSocket protocol  
✅ Prisma schema strategy  
✅ Tests to write  
✅ Business logic flow  
✅ Endpoint specifications

---

If you want, I can generate next:

✅ **Complete NestJS boilerplate code**  
✅ **Complete Next.js frontend scaffold**  
✅ **Prisma schema + migrations**  
✅ **WebSocket gateway boilerplate**  
✅ **Full API route implementation**

Just tell me **“Generate backend code”**, **“Generate frontend code”**, or **“Generate Prisma schema”**.
