# CLAUDE.md — Frontend (Next.js) AI Guidelines

This document defines EXACTLY how you should generate and modify code in this Next.js workspace.

---

# ✅ 1. Frontend Purpose

The frontend provides:

- NextAuth SSO authentication
- UI for habit creation & editing
- Daily check-ins
- Streak visualization
- Real-time milestone notifications via WebSocket
- Responsive, modern UI

---

# ✅ 2. Framework & Architecture

### ✅ MUST use:

- Next.js App Router (`app/`)
- NextAuth.js
- React Server Components for data pages
- **Shared types (`@habit/shared`)**
- Tailwind/ShadCN for UI
- Fetch or Axios for REST API calls
- Socket.IO client for RT events

### ❌ MUST NOT use:

- Pages Router (`pages/`)
- Custom auth logic
- Redux / heavy state libs unless requested
- Random UI libraries

---

# ✅ 3. Folder Structure Rules

    frontend/
        app/
        page.tsx                    → login screen
        habits/page.tsx             → habit list
        habits/create/page.tsx      → creation form
        habits/[id]/page.tsx        → details view
        components/
        hooks/
        lib/
        types/ (import from shared)
        interfaces/ (import from shared)

Never modify structure without user instruction.

---

# ✅ 4. Authentication Rules

- Use NextAuth with JWT sessions
- Session is available in:
  - Client components via `useSession()`
  - Server components via `getServerSession()`
- Include token in all API calls:

```ts
headers: {
  Authorization: `Bearer ${session.user.jwt}`;
}
```

# ✅ 5. Use Socket.IO with JWT handshake:

```ts
io(WS_URL, {
  auth: { token: session.user.jwt },
});
```

Client MUST send:

```ts
{ "type": "subscribe" }
```

Client MUST handle:

```ts
{ "type": "milestone" }
```

# ✅ 6. UI/UX Standards

UI MUST include:

- Loading state
- Empty state
- Error state
- Hover/focus styling
- Responsive layout
- Form validation

UI MUST NOT include:

- Dark mode
- Unstyled components
- Random design systems

# ✅ 7. Code Quality Rules

- Use functional React components
- Use TypeScript strictly
- Use shared types always
- Avoid duplication
- Keep components small & focused

# ✅ 8. Forbidden Actions

❌ Do not create backend logic here
❌ Do not modify NextAuth architecture
❌ Do not store sensitive data in the client
❌ Do not include Prisma or Node-specific code

Follow these rules precisely when writing frontend code.
