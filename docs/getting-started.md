# Getting Started

Welcome to Dara! Follow these steps to set up and run the app locally.

---

## Prerequisites
- **Node.js** v18+
- **pnpm** (recommended)
- **PostgreSQL** (or your configured database)

## 1. Clone the Repository
```sh
git clone https://github.com/your-org/dara-app.git
cd dara-app
```

## 2. Install Dependencies
```sh
pnpm install
```

## 3. Configure Environment Variables
- Copy `.env.example` to `.env` and fill in the required values:
```sh
cp .env.example .env
```
- Set up your database URL, Privy keys, and other secrets as needed.

## 4. Set Up the Database
```sh
pnpm prisma migrate deploy
pnpm prisma generate
```

## 5. Run the App
```sh
pnpm dev
```
- Visit [http://localhost:3000](http://localhost:3000)

## 6. Usage
- Sign in with Privy (email or wallet)
- Start chatting, view your portfolio, and explore integrations

---

For troubleshooting, see the [FAQ](./faq.md) or [Contributing](./contributing.md) for support. 