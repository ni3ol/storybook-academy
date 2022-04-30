import {z} from 'zod'

export const authSessionSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  userId: z.string(),
  token: z.string(),
})

export type AuthSession = z.infer<typeof authSessionSchema>
