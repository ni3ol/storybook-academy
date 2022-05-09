import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {applyFilters, FilterMapping} from '../../shared/actionUtils'
import {User, userSchema} from '../model'

export const userFiltersSchema = z
  .object({
    id: z.string().uuid(),
    emailAddress: z.string(),
    username: z.string(),
    schoolId: z.string().uuid(),
  })
  .strict()
  .partial()

export type UserFilters = z.infer<typeof userFiltersSchema>

const filterMapping: FilterMapping<UserFilters> = {
  id: (query, filters) => query.where('id', '=', filters.id!),
  emailAddress: (query, filters) =>
    query.where('emailAddress', '=', filters.emailAddress!),
  username: (query, filters) => query.where('username', '=', filters.username!),
  schoolId: (query, filters) => query.where('schoolId', '=', filters.schoolId!),
}

export const getUsers = async (params?: {
  filters?: UserFilters
  trx?: Knex.Transaction
  as?: {user?: User}
  skipAuth?: boolean
}) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const query = db
      .select('*')
      .from('users')
      .orderBy('createdAt', 'desc')
      .transacting(trx)
    const filteredQuery = applyFilters(query, filterMapping, params?.filters)
    const rows: any[] = await filteredQuery
    const users = rows.map((row) => userSchema.parse(row))
    return users
  })
}
