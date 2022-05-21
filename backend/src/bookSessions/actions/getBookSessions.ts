import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {applyFilters, FilterMapping} from '../../shared/actionUtils'
import {User} from '../../users/model'
import {bookSessionSchema} from '../model'

export const bookSessionFiltersSchema = z
  .object({
    id: z.string().uuid(),
    classId: z.string().uuid(),
    childId: z.string().uuid(),
  })
  .strict()
  .partial()

export type BookSessionFilters = z.infer<typeof bookSessionFiltersSchema>

const filterMapping: FilterMapping<BookSessionFilters> = {
  id: (query, filters) => query.where('id', '=', filters.id!),
  classId: (query, filters) => query.where('classId', '=', filters.classId!),
  childId: (query, filters) =>
    query
      .where('child1id', '=', filters.childId!)
      .orWhere('child2Id', filters.childId!),
}

export const getBookSessions = async (params?: {
  filters?: BookSessionFilters
  trx?: Knex.Transaction
  as?: {user?: User}
  skipAuth?: boolean
}) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const query = db
      .select('*')
      .from('bookSessions')
      .orderBy('createdAt', 'desc')
      .transacting(trx)
    const filteredQuery = applyFilters(query, filterMapping, params?.filters)
    const rows: any[] = await filteredQuery
    const bookSessions = rows.map((row) => bookSessionSchema.parse(row))
    return bookSessions
  })
}
