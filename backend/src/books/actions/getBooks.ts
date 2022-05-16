import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {applyFilters, FilterMapping} from '../../shared/actionUtils'
import {User} from '../../users/model'
import {bookSchema} from '../model'

export const bookFiltersSchema = z
  .object({
    id: z.string().uuid(),
    schoolId: z.string().uuid(),
  })
  .strict()
  .partial()

export type BookFilters = z.infer<typeof bookFiltersSchema>

const filterMapping: FilterMapping<BookFilters> = {
  id: (query, filters) => query.where('id', '=', filters.id!),
  schoolId: (query, filters) =>
    query
      .join('bookAssignments', 'bookAssignments.bookId', 'books.id')
      .where('bookAssignments.schoolId', '=', filters.schoolId!),
}

export const getBooks = async (params?: {
  filters?: BookFilters
  trx?: Knex.Transaction
  as?: {user?: User}
  skipAuth?: boolean
}) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const query = db
      .select('books.*')
      .from('books')
      .orderBy('books.createdAt', 'desc')
      .transacting(trx)
    const filteredQuery = applyFilters(query, filterMapping, params?.filters)
    const rows: any[] = await filteredQuery
    const books = rows.map((row) => bookSchema.parse(row))
    return books
  })
}
