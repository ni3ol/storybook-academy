import {z} from 'zod'
import {entitySchema} from '../shared/utils'

export const chatRoomSchema = entitySchema
  .extend({
    participant1Id: z.string().uuid(),
    participant2Id: z.string().uuid(),
  })
  .strict()

export type ChatRoom = z.infer<typeof chatRoomSchema>
