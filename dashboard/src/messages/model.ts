import {z} from 'zod'
import {entitySchema} from '../shared/entity'

export const messageSchema = entitySchema.extend({
  roomId: z.string(),
  body: z.string(),
  senderId: z.string().uuid(),
})

export type Message = z.infer<typeof messageSchema>
