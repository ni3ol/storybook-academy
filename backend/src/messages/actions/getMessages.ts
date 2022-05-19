import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {applyFilters, FilterMapping} from '../../shared/actionUtils'
import {User} from '../../users/model'
import {messageSchema} from '../model'

export const messageFiltersSchema = z
  .object({
    roomId: z.string(),
  })
  .strict()
  .partial()

export type MessageFilters = z.infer<typeof messageFiltersSchema>

const filterMapping: FilterMapping<MessageFilters> = {
  roomId: (query, filters) => query.where('roomId', '=', filters.roomId!),
}

export const getMessages = async (params?: {
  filters?: MessageFilters
  trx?: Knex.Transaction
  as?: {user?: User}
  skipAuth?: boolean
}) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const query = db
      .select('*')
      .from('messages')
      .orderBy('createdAt', 'asc')
      .transacting(trx)
    const filteredQuery = applyFilters(query, filterMapping, params?.filters)
    const rows: any[] = await filteredQuery
    const messages = rows.map((row) => messageSchema.parse(row))
    return messages
  })
}
