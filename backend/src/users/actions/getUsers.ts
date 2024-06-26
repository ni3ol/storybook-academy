import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {
  applyFilters,
  applyPagination,
  FilterMapping,
  Pagination,
} from '../../shared/actionUtils'
import {User, UserRole, userSchema} from '../model'

export const userFiltersSchema = z
  .object({
    id: z.string().uuid(),
    notId: z.string().uuid(),
    emailAddress: z.string(),
    username: z.string(),
    schoolId: z.string().uuid(),
    search: z.string().optional(),
    role: z.string().optional(),
    roles: z.array(z.nativeEnum(UserRole)).optional(),
    educatorId: z.string().optional(),
    classId: z.string().optional(),
  })
  .strict()
  .partial()

export type UserFilters = z.infer<typeof userFiltersSchema>

const filterMapping: FilterMapping<UserFilters> = {
  id: (query, filters) => query.where('id', '=', filters.id!),
  notId: (query, filters) => query.whereNot('id', filters.notId!),
  emailAddress: (query, filters) =>
    query.where('emailAddress', '=', filters.emailAddress!),
  username: (query, filters) => query.where('username', '=', filters.username!),
  schoolId: (query, filters) => query.where('schoolId', '=', filters.schoolId!),
  role: (query, filters) => query.where('role', '=', filters.role!),
  roles: (query, filters) => query.whereIn('role', filters.roles!),
  educatorId: (query, filters) =>
    query.where('educatorId', '=', filters.educatorId!),
  classId: (query, filters) => query.where('classId', '=', filters.classId!),
  // problem when putting a camelcased column name in LOWER() -> complains that firstName !== firstname
  search: (query, filters) =>
    query
      .whereRaw(
        `LOWER(users."firstName") like '%${filters.search!.toLowerCase()}%'`,
      )
      .orWhereRaw(
        `LOWER(users."lastName") like '%${filters.search!.toLowerCase()}%'`,
      ),
}

export const getUsers = async (params?: {
  filters?: UserFilters
  pagination?: Pagination
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
    const paginatedQuery = applyPagination(filteredQuery, params?.pagination)
    const rows: any[] = await paginatedQuery
    const users = rows.map((row) => userSchema.parse(row))
    return users
  })
}

export const countUsers = async (params?: {
  filters?: UserFilters
  trx?: Knex.Transaction
  as?: {user?: User}
  skipAuth?: boolean
}) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const query = db.count('*').from('users').transacting(trx)
    const filteredQuery = applyFilters(query, filterMapping, params?.filters)
    const rows: any[] = await filteredQuery
    const {count} = rows[0]
    return count
  })
}
