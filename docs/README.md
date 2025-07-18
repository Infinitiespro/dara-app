# Dara App Documentation

Welcome to the **Dara** documentation! Dara is an AI-powered copilot for Solana, providing intelligent chat, portfolio management, and seamless integrations with the Solana ecosystem.

---

## Overview
- **Dara** is a Next.js 15 (App Router) application with a modern, responsive UI built using TypeScript, React, Shadcn UI, Radix UI, and Tailwind CSS.
- It leverages AI for chat, insights, and automation, and integrates with Solana wallets and DeFi protocols.
- The app is optimized for performance, accessibility, and developer experience.

## Features
- **AI Chat Copilot**: Natural language chat for Solana questions, actions, and insights
- **Wallet Portfolio**: View balances, tokens, and analytics for connected wallets
- **Quick Actions**: Swap tokens, search tokens, and more
- **Integrations**: Connect with Solana DeFi, NFT, and analytics tools
- **Professional UI/UX**: Responsive, accessible, and visually appealing
- **Authentication**: Secure login via Privy
- **Server Actions**: Type-safe, validated actions using next-safe-action and Zod

## Tech Stack
- **Next.js 15 (App Router, Turbopack)**
- **TypeScript**
- **React (Server & Client Components)**
- **Tailwind CSS**
- **Shadcn UI & Radix UI**
- **Prisma ORM**
- **PostgreSQL**
- **Privy (Auth)**
- **Sonner (Toasts)**
- **nuqs (Query State)**

## Directory Structure
```
/ (root)
  /src
    /app           # Next.js app directory (pages, routes)
    /components    # Reusable UI and logic components
    /server        # Server actions, db, and API logic
    /lib           # Utilities, helpers, and config
    /types         # TypeScript types and interfaces
  /public          # Static assets (images, icons, etc.)
  /prisma          # Prisma schema and migrations
  /docs            # Documentation (this directory)
```

## Documentation Index
- [Getting Started](./getting-started.md)
- [Architecture](./architecture.md)
- [Server Actions](./server-actions.md)
- [API Reference](./api.md)
- [UI Components](./ui-components.md)
- [Integrations](./integrations.md)
- [FAQ](./faq.md)
- [Contributing](./contributing.md)

---

For the latest updates, visit [docs.dara.sh](https://docs.dara.sh) or follow [@ask_Dara on X](https://x.com/ask_Dara). 