# Server Actions

Dara uses **next-safe-action** for type-safe, validated server actions. All actions are located in `/src/server/actions`.

---


## Pattern
- **Validation:** All actions use Zod schemas for input validation
- **Type Safety:** next-safe-action provides type-safe client/server contracts
- **Error Handling:** Standardized error responses using `ActionResponse`

## Example
```ts
'use server'
import { actionClient, ActionResponse } from "@/lib/safe-action";
import { z } from 'zod'

const schema = z.object({
  value: z.string()
})

export const someAction = actionClient
  .schema(schema)
  .action(async (input): Promise<ActionResponse> => {
    try {
      return { success: true, data: /* result */ }
    } catch (error) {
      return { success: false, error: error instanceof AppError ? error : appErrors.UNEXPECTED_ERROR }
    }
  })
```

## Creating a New Action
1. Create a file in `/src/server/actions`
2. Define a Zod schema for input
3. Use `actionClient.schema(schema).action(async (input) => { ... })`
4. Return an `ActionResponse`

## Error Handling
- Use custom `AppError` or `appErrors.UNEXPECTED_ERROR`
- Always return `{ success: false, error }` on failure

---

See [API Reference](./api.md) for available actions. 