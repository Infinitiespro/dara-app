# Architecture

Dara is a modern, full-stack web app built with Next.js (App Router), React, TypeScript, and Prisma. It uses a modular, scalable architecture for maintainability and performance.

---


## High-Level Diagram
```
[ User ]
   |
   v
[ Next.js (App Router) ]
   |
   v
[ React Components (RSC/Client) ]
   |
   v
[ Server Actions / API Routes ]
   |
   v
[ Prisma ORM ]
   |
   v
[ PostgreSQL DB ]
```

## Main Layers
- **Frontend (Next.js, React, Tailwind, Shadcn UI)**
  - App Router structure (`/src/app`)
  - Server and client components
  - Responsive, accessible UI
- **Backend (Server Actions, API Routes)**
  - All server actions in `/src/server/actions`
  - Type-safe, validated with Zod and next-safe-action
  - API routes for chat, wallet, integrations
- **Database (Prisma, PostgreSQL)**
  - Prisma schema in `/prisma/schema.prisma`
  - Models: User, Wallet, Conversation, Message, etc.

## Data & Action Flow
1. **User interacts with UI** (e.g., sends a chat message)
2. **Client component** calls a server action or API route
3. **Server action** validates input, performs logic, updates DB
4. **Prisma** handles DB queries/mutations
5. **Response** is returned to the client and UI updates

---

See [Server Actions](./server-actions.md) and [API Reference](./api.md) for more details. 