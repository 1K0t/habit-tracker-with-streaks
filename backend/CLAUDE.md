# CLAUDE.md — Backend (NestJS) AI Guidelines

This document defines exactly how NestJS backend code MUST be written.

---

# ✅ 1. Backend Purpose

The backend provides:

- REST API for habits, check-ins, streaks
- JWT authorization (from NextAuth)
- WebSocket milestone notifications (Socket.IO)
- Database persistence (PostgreSQL + Prisma)
- Authorization enforcement
- Business logic rules

---

# ✅ 2. Architecture & Structure

    src/
        auth/
        users/
        habits/
        checkins/
        milestones/
        websocket/

### ✅ Each module MUST include:

- `.module.ts`
- `.controller.ts`
- `.service.ts`

### ✅ Services contain all business logic

### ✅ Controllers contain routing only

### ✅ Common DTOs imported from `@habit/shared`

### ✅ Local DTOs stored in match module or common

---

# ✅ 3. Authentication Rules

- Backend DOES NOT implement OAuth
- Only validates JWT produced by NextAuth

Token is received:

    Authorization: Bearer

Backend must:

1. Verify token
2. Extract `sub` as `userId`
3. Attach userId to request context
4. Block all unauthorized operations

---

# ✅ 4. Database Rules

Use Prisma with PostgreSQL.

You MUST NOT:

- Change table names
- Modify relations
- Remove constraints
- Invent new fields

You MUST:

- Use the schema from the Technical Specification
- Use PrismaClient from DI container
- Handle all DB errors cleanly

---

# ✅ 5. WebSocket Rules

Use NestJS WebSocket Gateway + Socket.IO adapter.

Gateway must:

- Authenticate handshake using JWT
- Store client by userId
- Emit milestone events only once per milestone
- Never resend after reconnection
- Accept client → server messages:
  - `subscribe`
  - `ack`

---

# ✅ 6. Business Logic Rules

**Check-ins:**

- One per habit per day
- Only for today
- Cannot check in future
- Cannot check in paused/archived habits

**Streaks:**

- Only continuous calendar days
- Missing a day breaks streak
- Best streak must be stored historically

---

# ✅ 7. Code Standards

- Use dependency injection
- Use strongly-typed Prisma queries
- Validate all incoming data
- Never write business logic in controllers
- Use async/await everywhere
- Use NestJS decorators (`@Injectable`, `@Controller`, etc.)

---

# ✅ 8. Forbidden Actions

❌ Do not modify Prisma schema unless asked  
❌ Do not write SQL manually  
❌ Do not bypass NestJS DI  
❌ Do not handle SSO in backend  
❌ Do not modify WebSocket message formats

---

# ✅ 9. Expected Outputs from Claude

When generating backend code, Claude must:

✅ Write full, working TS modules  
✅ Not leave TODOs  
✅ Ensure everything compiles  
✅ Use correct imports & paths  
✅ Follow folder structure strictly  
✅ Follow business rules

---

Please respect these guidelines when generating or modifying backend code.
