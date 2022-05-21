import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {utcNow} from '../../shared/utils'
import {User} from '../../users/model'
import {BookSession} from '../model'

export const updateBookSessionSchema = z.object({
  page: z.number(),
})

export type UpdateBookSessionData = z.infer<typeof updateBookSessionSchema>

export const updateBookSession = (
  id: string,
  data: UpdateBookSessionData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const now = utcNow()
    const query = db('bookSessions')
      .update({...data, updatedAt: now})
      .where('id', id)
      .returning('*')
      .transacting(trx)
    const [bookSession] = (await query) as BookSession[]
    return bookSession
  })
}
