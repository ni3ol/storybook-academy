import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {utcNow} from '../../shared/utils'
import {User} from '../../users/model'
import {Book, bookSchema} from '../model'

export const updateBookInputSchema = z.object({
  createdByUserId: bookSchema.shape.createdByUserId.optional(),
  title: bookSchema.shape.title.optional(),
  level: bookSchema.shape.level.optional(),
})

export type UpdateBookInputData = z.infer<typeof updateBookInputSchema>

export const updateBook = (
  id: string,
  data: UpdateBookInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}},
) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const now = utcNow()
    const query = db('books')
      .update({...data, updatedAt: now})
      .where('id', '=', id)
      .returning('*')
      .transacting(trx)
    const [book] = (await query) as Book[]
    return book
  })
}
