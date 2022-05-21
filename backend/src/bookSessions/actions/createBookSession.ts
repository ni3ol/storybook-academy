import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {getUuid, utcNow} from '../../shared/utils'
import {User} from '../../users/model'
import {BookSession, bookSessionSchema} from '../model'

export const createBookSessionSchema = z.object({
  child1Id: z.string().uuid(),
  child2Id: z.string().uuid(),
  bookId: z.string().uuid().optional().nullable(),
  page: z.number(),
})

export type CreateBookSessionData = z.infer<typeof createBookSessionSchema>

export const createBookSession = async (
  data: CreateBookSessionData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  const asOf = utcNow()

  const parsedData = createBookSessionSchema.parse(data)
  const id = getUuid()
  const bookSession: BookSession = {
    ...parsedData,
    id,
    createdAt: asOf,
    updatedAt: asOf,
  }

  await useOrCreateTransaction(params?.trx, async (trx) => {
    await db('bookSessions').insert(bookSession).returning('*').transacting(trx)
  })

  const parsedClass = bookSessionSchema.parse(bookSession)
  return parsedClass
}
