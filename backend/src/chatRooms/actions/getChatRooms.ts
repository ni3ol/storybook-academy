import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {applyFilters, FilterMapping} from '../../shared/actionUtils'
import {User} from '../../users/model'
import {chatRoomSchema} from '../model'

export const chatRoomFiltersSchema = z
  .object({
    id: z.string().optional(),
  })
  .strict()
  .partial()

export type ChatRoomFilters = z.infer<typeof chatRoomFiltersSchema>

const filterMapping: FilterMapping<ChatRoomFilters> = {
  id: (query, filters) => query.where('id', '=', filters.id!),
}

export const getChatRooms = async (params?: {
  filters?: ChatRoomFilters
  trx?: Knex.Transaction
  as?: {user?: User}
  skipAuth?: boolean
}) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const query = db
      .select('*')
      .from('chatRooms')
      .orderBy('createdAt', 'asc')
      .transacting(trx)
    const filteredQuery = applyFilters(query, filterMapping, params?.filters)
    const rows: any[] = await filteredQuery
    const chatRooms = rows.map((row) => chatRoomSchema.parse(row))
    return chatRooms
  })
}
