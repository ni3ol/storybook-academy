import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {applyFilters, FilterMapping} from '../../shared/actionUtils'
import {User} from '../../users/model'
import {schoolSchema} from '../model'

export const schoolFiltersSchema = z
  .object({
    id: z.string().uuid(),
  })
  .strict()
  .partial()

export type SchoolFilters = z.infer<typeof schoolFiltersSchema>

const filterMapping: FilterMapping<SchoolFilters> = {
  id: (query, filters) => query.where('id', '=', filters.id!),
}

export const getSchools = async (params?: {
  filters?: SchoolFilters
  trx?: Knex.Transaction
  as?: {user?: User}
  skipAuth?: boolean
}) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const query = db
      .select('*')
      .from('schools')
      .orderBy('createdAt', 'desc')
      .transacting(trx)
    const filteredQuery = applyFilters(query, filterMapping, params?.filters)
    const rows: any[] = await filteredQuery
    const schools = rows.map((row) => schoolSchema.parse(row))
    return schools
  })
}
