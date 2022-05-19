import {z} from 'zod'
import {entitySchema} from '../shared/utils'

export const messageSchema = entitySchema
  .extend({
    roomId: z.string(),
    body: z.string(),
    senderId: z.string().uuid(),
  })
  .strict()

export type Message = z.infer<typeof messageSchema>
