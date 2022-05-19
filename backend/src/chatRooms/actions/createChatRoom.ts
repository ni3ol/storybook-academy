import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {getUuid, utcNow} from '../../shared/utils'
import {User} from '../../users/model'
import {ChatRoom, chatRoomSchema} from '../model'

export const createChatRoomInputSchema = z.object({
  participant1Id: z.string().uuid(),
  participant2Id: z.string().uuid(),
})

export type CreateChatRoomInputData = z.infer<typeof createChatRoomInputSchema>

export const createChatRoom = async (
  data: CreateChatRoomInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  const asOf = utcNow()

  const parsedData = createChatRoomInputSchema.parse(data)
  const id = getUuid()
  const room: ChatRoom = {
    ...parsedData,
    id,
    createdAt: asOf,
    updatedAt: asOf,
  }

  await useOrCreateTransaction(params?.trx, async (trx) => {
    await db('chatRooms').insert(room).returning('*').transacting(trx)
  })

  const parsedRoom = chatRoomSchema.parse(room)
  return parsedRoom
}
