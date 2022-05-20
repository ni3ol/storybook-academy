import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {applyFilters, FilterMapping} from '../../shared/actionUtils'
import {User} from '../../users/model'
import {passwordResetRequestSchema} from '../model'

export const passwordResetRequestFilters = z
  .object({
    id: z.string().uuid(),
    token: z.string(),
    usable: z.boolean(),
  })
  .strict()
  .partial()

export type PasswordResetRequestFilters = z.infer<
  typeof passwordResetRequestFilters
>

const filterMapping: FilterMapping<PasswordResetRequestFilters> = {
  id: (query, filters) => query.where('id', '=', filters.id!),
  token: (query, filters) => query.where('token', '=', filters.token!),
  usable: (query) =>
    query.whereNull('usedOn').andWhere('expiresOn', '>', new Date()),
}

export const getPasswordResetRequests = async (params?: {
  filters?: PasswordResetRequestFilters
  trx?: Knex.Transaction
  as?: {user?: User}
  skipAuth?: boolean
}) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const query = db
      .select('*')
      .from('passwordResetRequests')
      .orderBy('createdAt', 'desc')
      .transacting(trx)
    const filteredQuery = applyFilters(query, filterMapping, params?.filters)
    const rows: any[] = await filteredQuery
    const passwordResetRequests = rows.map((row) =>
      passwordResetRequestSchema.parse(row),
    )
    return passwordResetRequests
  })
}
