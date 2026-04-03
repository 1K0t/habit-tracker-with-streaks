# CLAUDE.md — Root Monorepo Instructions

We're building foolstack app based on [**TECHNICAL SPECIFICATION DOCUMENT**](./SPEC.md). The full specification is located in @SPEC.md. The full [**IMPLEMENTATION PLANE**](IMPLEMENTATION_PLAN.md) is located in @IMPLEMENTATION_PLAN.md. Read that files for general architectural tasks or to doble-check the exact database structure, tech stack or application architecture.

Keep your replies extremly concise and focuse on conveying the key information. No unnecessary fluff, no long code snippets.

This repository is a Yarn Workspaces monorepo containing:

- `frontend` — Next.js + NextAuth client
- `backend` — NestJS + Fastify + Prisma API
- `shared` — shared TypeScript types, DTOs, and utilities

## ✅ Project Goals

This project implements a **Habit Tracker with Streaks**:

- Multi‑user application
- Google/GitHub SSO
- Daily check‑ins for habits
- Automatic streak calculation
- Real‑time milestone notifications via WebSockets (3, 7, 30 days)

## ✅ Working in the Monorepo

### Use Yarn Workspaces

Frontend, backend, shared each define their own `package.json`.  
Root contains the workspace declaration.

Useful commands:

```bash
yarn dev:frontend
yarn dev:backend
yarn build
yarn format
yarn lint
```

You MUST treat that file as the source of truth.

---

# ✅ 2. General Rules for Claude

### ✅ ALWAYS follow:

- This `CLAUDE.md`
- The Technical Specification
- Existing project architecture
- Yarn workspace structure
- TypeScript strict mode
- Clean, readable, consistent code

### ✅ NEVER:

- Introduce breaking changes without user approval
- Change architecture without explicit instruction
- Modify backend auth flow
- Modify NextAuth config
- Modify Prisma schema structure
- Add new dependencies without permission
- Generate placeholder code that doesn’t compile

---

# ✅ 3. Monorepo Structure Rules

The repository layout:

    habit-tracker-with-streaks/
        frontend/ → Next.js app
        backend/ → NestJS API
        shared/ → Types, DTOs, utils
        package.json
        tsconfig.json

### ✅ Claude MUST:

- Keep all shared types in `shared/`
- Keep business logic in backend services
- Keep UI concerns in frontend components
- Use shared types from `@habit/shared`

---

# ✅ 4. Code Generation Standards

### ✅ Naming Conventions

- Files: `camelCase` for utils, `PascalCase` for components/classes
- Types: `PascalCase`
- Enums: `PascalCase`
- Variables: `camelCase`
- Folders: `kebab-case`

### ✅ Formatting

- MUST run Prettier formatting rules
- MUST obey ESLint (Next/Nest presets)

### ✅ TypeScript Rules

- Use `interface` for DTOs and API contracts
- Use `type` only for unions
- Use explicit return types for all functions
- NEVER use `any` without explicit instruction

---

# ✅ 5. Backend (NestJS) Rules

### ✅ File placement:

    src/
        module-name/
            dto/
                index.ts
                example.dto.ts
            interface/
                index.ts
                example.interface.ts
            module.ts
            controller.ts
            service.ts

### ✅ Controllers:

- Only handle routing & request validation
- Use DTOs from `@habit/shared`
- NEVER contain business logic

### ✅ Services:

- Contain all business rules
- Use Prisma for data access
- Enforce user authorization via userId

### ✅ Prisma:

- MUST match schema defined in Technical Spec
- MUST use strict typing
- Do not create new tables unless requested

---

# ✅ 6. Frontend (Next.js) Rules

### ✅ Pages live in:

    app/

### ✅ Components live in:

    components/

### ✅ State:

- Prefer local state
- Use `useState` or simple Zustand stores

### ✅ API Calls

- MUST include JWT in headers
- MUST use shared types
- MUST validate data structures

### ✅ WebSockets

- Connect using JWT auth
- Must send a `subscribe` message
- Must handle milestone events

---

# ✅ 7. Shared Package Rules

### Allowed:

- Pure TypeScript types
- DTOs
- Domain utilities

### Forbidden:

- React
- NestJS
- Prisma
- Node-specific APIs
- Browser APIs

---

# ✅ 8. Commit & PR Behavior (for Claude)

### ✅ When modifying multiple files:

Group changes logically:

- UI changes together
- Backend routes together
- Shared types in a separate block

### ✅ Never:

- Combine unrelated features
- Sneak architectural changes
- Delete important files
- Change configs without explicit user request

---

# ✅ 9. When Creating New Files

You MUST:

- Use correct folder
- Use correct naming
- Include imports from shared
- Ensure TypeScript compiles
- Follow coding conventions

---

# ✅ 10. Forbidden Actions

❌ Changing authentication architecture  
❌ Changing Prisma data model  
❌ Rewriting shared types without instruction  
❌ Adding new libraries without permission  
❌ Generating incomplete code  
❌ Inventing new business cases  
❌ Changing monorepo structure

---

# ✅ 11. Claude Work Style

### ✅ Always:

- Be explicit
- Be concise
- Write production-ready code
- Provide reasoning when needed
- Validate before generating large changes
- Follow strict TypeScript discipline

---

Use this document and follow all rules when assisting with the project.
