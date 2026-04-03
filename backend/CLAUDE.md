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

✅ 7. Swagger (OpenAPI) Documentation — REQUIRED for ALL Controllers
Claude MUST generate Swagger decorators for:
✅ Controller class
✅ Each endpoint
✅ All input DTOs
✅ All response types
✅ Error responses
✅ Authentication requirements
✅ Required imports:

```ts
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBody,
} from "@nestjs/swagger";
```

✅ 7.1 Required Patterns for Controllers
✅ Controller header:

```ts
@ApiTags('habits')
@ApiBearerAuth()
@Controller('habits')
export class HabitsController { ... }
```

✅ 7.2 Endpoint Swagger Examples
✅ GET (list habits)

```ts
@ApiOperation({ summary: 'Get list of habits for authenticated user' })
@ApiOkResponse({ description: 'List returned', type: HabitDto, isArray: true })
@ApiUnauthorizedResponse({ description: 'Invalid or missing token' })
```

✅ POST (create habit)

```ts
@ApiOperation({ summary: 'Create a new habit' })
@ApiBody({ type: CreateHabitDto })
@ApiCreatedResponse({ description: 'Habit created', type: HabitDto })
@ApiBadRequestResponse({ description: 'Invalid data' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
```

✅ PATCH (update habit)

```ts
@ApiOperation({ summary: 'Update habit fields' })
@ApiBody({ type: UpdateHabitDto })
@ApiOkResponse({ description: 'Habit updated', type: HabitDto })
@ApiNotFoundResponse({ description: 'Habit not found' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
```

✅ DELETE (delete habit)

```ts
@ApiOperation({ summary: 'Delete a habit' })
@ApiOkResponse({ description: 'Habit deleted' })
@ApiNotFoundResponse({ description: 'Habit not found' })
```

✅ Check-in today

```ts
@ApiOperation({ summary: 'Check-in habit for today' })
@ApiCreatedResponse({ description: 'Check-in added', type: CheckInTodayResponseDto })
@ApiForbiddenResponse({ description: 'Habit is paused or archived' })
```

✅ 7.3 DTOs MUST include @ApiProperty()
Claude MUST add Swagger decorators inside DTOs.
Example:

```ts
export class CreateHabitDto {
  @ApiProperty({ example: "Drink Water" })
  name: string;

  @ApiProperty({ example: "8 glasses/day", required: false })
  description?: string;

  @ApiProperty({ example: "2026-04-03" })
  startDate: string;
}
```

✅ 7.4 Response DTOs MUST be fully typed

- HabitDto
- CheckInDto
- MilestoneNotificationDto
- StreakResponseDto

All MUST include @ApiProperty() for every field.

---

# ✅ 8. Code Standards

- Use dependency injection
- Use strongly-typed Prisma queries
- Validate all incoming data
- Never write business logic in controllers
- Use async/await everywhere
- Use NestJS decorators (`@Injectable`, `@Controller`, etc.)

---

# ✅ 9. Forbidden Actions

❌ Do not modify Prisma schema unless asked  
❌ Do not write SQL manually  
❌ Do not bypass NestJS DI  
❌ Do not handle SSO in backend  
❌ Do not modify WebSocket message formats

# ✅ 10. Expected Outputs from Claude

When generating backend code, Claude must:

✅ Write full, working TS modules  
✅ Not leave TODOs  
✅ Ensure everything compiles  
✅ Use correct imports & paths  
✅ Follow folder structure strictly  
✅ Follow business rules

---

Please respect these guidelines when generating or modifying backend code.
