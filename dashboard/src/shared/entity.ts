import {z} from 'zod'

export const entitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
})
