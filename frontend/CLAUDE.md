# CLAUDE.md — Frontend (Next.js) AI Guidelines

This document defines EXACTLY how you should generate and modify code in this Next.js workspace.

---

# 1. Frontend Purpose

The frontend provides:

- NextAuth SSO authentication
- UI for habit creation & editing
- Daily check-ins
- Streak visualization
- Real-time milestone notifications via WebSocket
- Responsive, modern UI

---

# 2. Tech Stack & Versions

- **Next.js 16** — App Router only, Turbopack enabled
- **React 19** — supports `use()` hook, Server Components
- **TypeScript 6** — strict mode enabled
- **Tailwind CSS v4** — uses `@import "tailwindcss"` (NOT `@tailwind` directives), PostCSS plugin is `@tailwindcss/postcss`
- **ShadCN UI** — default style, slate base color, RSC-compatible
- **NextAuth v4** — JWT session strategy, Google + GitHub OAuth
- **Axios** — client-side HTTP (mutations only)
- **Socket.IO Client v4** — real-time milestone notifications
- **Zustand** — lightweight state management (use only if needed)

---

# 3. Path Aliases

```
@/*            → frontend project root (e.g., @/lib/api, @/components/Navbar)
@habit/shared  → ../shared/index.ts (monorepo shared types, DTOs, utils)
```

Always use `@/` for internal imports. Always use `@habit/shared` for shared types.

---

# 4. Folder Structure

```
frontend/
  app/
    page.tsx                       → login screen
    layout.tsx                     → root layout with Providers
    globals.css                    → global styles (@import "tailwindcss")
    habits/page.tsx                → habit list (server component)
    habits/create/page.tsx         → creation form
    habits/[id]/page.tsx           → details view
    api/auth/[...nextauth]/route.ts → NextAuth API handler
  components/
    ui/                            → ShadCN components (auto-generated)
    Providers.tsx                  → SessionProvider wrapper
    ComponentName/ComponentName.tsx → folder-per-component pattern
  hooks/
    useHabits.ts                   → habits data hook (takes server-fetched data)
    useWebsocket.ts                → WebSocket connection + milestone events
  lib/
    api.ts                         → client-side axios instance (mutations only)
    api.server.ts                  → server-side fetch (initial data loading)
    auth.ts                        → NextAuth config (DO NOT MODIFY)
    ws.ts                          → Socket.IO client factory
    utils.ts                       → Tailwind cn() utility
  types/
    next-auth.d.ts                 → extends Session/JWT with jwt field
```

Never modify structure without user instruction.

---

# 5. Environment Variables

### Server-only (never exposed to browser):

```
NEXTAUTH_SECRET, NEXTAUTH_URL
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
JWT_SECRET, JWT_EXPIRES_IN
BACKEND_API_URL                   → used by lib/api.server.ts
DATABASE_URL
```

### Client-accessible (NEXT_PUBLIC_ prefix required):

```
NEXT_PUBLIC_WS_URL                → WebSocket endpoint for Socket.IO
```

MUST use `NEXT_PUBLIC_` prefix for any variable accessed in client components or `"use client"` files. Server-only vars work in server components, API routes, and `lib/api.server.ts`.

---

# 6. Server vs Client Components

### Server components (default — no directive needed):

- Page components (`app/**/page.tsx`)
- Layout components (`app/**/layout.tsx`)
- Data fetching happens here

### Client components (add `"use client"` at top):

- Components using hooks (`useState`, `useEffect`, `useSession`, `useRouter`)
- Components with event handlers (onClick, onSubmit)
- Components using browser APIs

### App Router special files:

- `loading.tsx` — Suspense fallback (shown during server fetch)
- `error.tsx` — error boundary (`"use client"` required)
- `layout.tsx` — shared layout wrapper
- `not-found.tsx` — 404 page

---

# 7. Authentication Rules

- Use NextAuth with JWT sessions
- Session is available in:
  - Client components via `useSession()` from `next-auth/react`
  - Server components via `getServerSession(authOptions)` from `next-auth`
- Include token in all API calls:

```ts
headers: {
  Authorization: `Bearer ${session.user.jwt}`;
}
```

- Session type is augmented in `types/next-auth.d.ts` — `session.user.jwt` contains the signed JWT

---

# 8. WebSocket Rules

Use Socket.IO with JWT handshake:

```ts
io(WS_URL, {
  auth: { token: session.user.jwt },
});
```

Client MUST emit event `"subscribe"` on connect.
Client MUST listen for event `"milestone"` (receives `MilestoneNotification` from `@habit/shared`).
Client MAY emit `"ack"` with `{ milestoneId }` to acknowledge.

---

# 9. Data Fetching Rules

### Prefer server-side fetch:

- Use **React Server Components** for initial data loading whenever possible
- Fetch data in page/layout server components using `lib/api.server.ts` + `getServerSession()`
- Pass fetched data to client components as props — no loading spinners for initial render
- Use `router.refresh()` to re-trigger server-side fetch when data needs updating

### Use client-side fetch (`lib/api.ts`) ONLY for:

- Mutations (create, update, delete)
- User-triggered actions (check-ins, status changes)
- Cases where server-side fetch is not possible (e.g., WebSocket events)

### MUST NOT:

- Use `useEffect` for initial data fetching
- Duplicate fetch logic between server and client
- Use `getSession()` (client) in server components — use `getServerSession(authOptions)` instead

---

# 10. ShadCN UI Rules

- Config: `components.json` (style: default, base color: slate, RSC: true)
- Install components: `npx shadcn@latest add <component-name>`
- Components are placed in `components/ui/` (auto-generated, do not manually create)
- Use `cn()` from `@/lib/utils` for conditional class merging
- ShadCN components are server-component compatible by default

---

# 11. Component Conventions

- Use **folder-per-component** pattern: `components/Navbar/Navbar.tsx`
- ShadCN primitives go in `components/ui/` (flat, auto-managed)
- Keep components small and focused — one responsibility
- Use functional React components only
- Use shared types from `@habit/shared` always

---

# 12. UI/UX Standards

UI MUST include:

- Loading state (prefer `loading.tsx` Suspense for page-level)
- Empty state
- Error state (prefer `error.tsx` boundary for page-level)
- Hover/focus styling
- Responsive layout
- Form validation

UI MUST NOT include:

- Dark mode
- Unstyled components
- Random design systems

---

# 13. Code Quality Rules

- Use functional React components
- Use TypeScript strictly — no `any` without explicit instruction
- Use shared types from `@habit/shared` always
- Avoid duplication
- Keep components small & focused
- Use explicit return types for all functions

---

# 14. Forbidden Actions

- Do not create backend logic here
- Do not modify NextAuth architecture or `lib/auth.ts`
- Do not store sensitive data in the client
- Do not include Prisma or Node-specific code
- Do not use `@tailwind` directives (Tailwind v4 uses `@import "tailwindcss"`)
- Do not manually create files in `components/ui/` — use ShadCN CLI

Follow these rules precisely when writing frontend code.
