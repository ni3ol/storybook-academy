import {z} from 'zod'
import {dateSchema, entitySchema} from '../shared/entity'

export const chatRoomSchema = entitySchema
  .extend({
    participant1Id: z.string().uuid(),
    participant2Id: z.string().uuid().optional().nullable(),
    isAdmin: z.boolean().optional(),
    updatedAt: dateSchema,
  })
  .strict()

export type ChatRoom = z.infer<typeof chatRoomSchema>
