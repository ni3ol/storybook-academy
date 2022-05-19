import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {applyFilters, FilterMapping} from '../../shared/actionUtils'
import {User} from '../../users/model'
import {classSchema} from '../model'

export const classFiltersSchema = z
  .object({
    id: z.string().uuid(),
    schoolId: z.string().uuid(),
  })
  .strict()
  .partial()

export type ClassFilters = z.infer<typeof classFiltersSchema>

const filterMapping: FilterMapping<ClassFilters> = {
  id: (query, filters) => query.where('id', '=', filters.id!),
  schoolId: (query, filters) => query.where('schoolId', '=', filters.schoolId!),
}

export const getClasses = async (params?: {
  filters?: ClassFilters
  trx?: Knex.Transaction
  as?: {user?: User}
  skipAuth?: boolean
}) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const query = db
      .select('*')
      .from('classes')
      .orderBy('createdAt', 'desc')
      .transacting(trx)
    const filteredQuery = applyFilters(query, filterMapping, params?.filters)
    const rows: any[] = await filteredQuery
    const classes = rows.map((row) => classSchema.parse(row))
    return classes
  })
}
