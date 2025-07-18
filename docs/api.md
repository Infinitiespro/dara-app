# API Reference

Dara exposes both REST API endpoints and server actions for client-server communication.

---


## Main Endpoints

### Chat
- `POST /api/chat` — Send a chat message
- `GET /api/chat/[id]` — Get chat conversation by ID

### Wallet
- `GET /api/wallet/[address]/portfolio` — Get wallet portfolio data

### Actions
- `GET /api/actions` — List available quick actions
- `POST /api/actions` — Execute a quick action

## Example: Send Chat Message
```http
POST /api/chat
Content-Type: application/json
{
  "message": "What is the price of SOL?",
  "wallet": "..."
}
```

## Authentication
- Most endpoints require authentication via Privy (cookie/session)
- Some endpoints are public for demo/testing

## Server Actions
- All server actions are in `/src/server/actions`
- Use via client hooks or direct import

---

See [Server Actions](./server-actions.md) for more details. 