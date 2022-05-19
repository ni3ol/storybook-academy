import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {AuthorizationError} from '../../errors'
import {getUuid, utcNow} from '../../shared/utils'
import {User} from '../../users/model'
import {Message, messageSchema} from '../model'

export const createMessageInputSchema = z.object({
  roomId: z.string(),
  body: z.string(),
  senderId: z.string().uuid(),
})

export type CreateMessageInputData = z.infer<typeof createMessageInputSchema>

export const createMessage = async (
  data: CreateMessageInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  const asOf = utcNow()

  const parsedData = createMessageInputSchema.parse(data)
  const id = getUuid()
  const message: Message = {
    ...parsedData,
    id,
    createdAt: asOf,
    updatedAt: asOf,
  }

  await useOrCreateTransaction(params?.trx, async (trx) => {
    await db('messages').insert(message).returning('*').transacting(trx)
  })

  const parsedMessage = messageSchema.parse(message)
  return parsedMessage
}
