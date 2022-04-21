/* eslint-disable @typescript-eslint/no-unsafe-return */
import {z} from 'zod'
import {db} from '../../db/db'
import {
  applyFilters,
  createGetAction,
  FilterMapping,
} from '../../shared/actionUtils'
import {authSessionSchema} from '../model'

export const authSessionsFilterSchema = z
  .object({
    id: z.string().uuid(),
    token: z.string(),
  })
  .strict()
  .partial()

export type Filters = z.infer<typeof authSessionsFilterSchema>

const filterMapping: FilterMapping<Filters> = {
  id: (query, filters) => query.where('id', '=', filters.id!),
  token: (query, filters) => query.where(`token`, '=', filters.token!),
}

export const [getAuthSessions, getAuthSessionsAction] = createGetAction(
  {
    outputSchema: authSessionSchema,
    filterSchema: authSessionsFilterSchema,
    authorization: false,
  },
  async ({filters, trx}) => {
    const query = db.select('*').from('authSessions').transacting(trx)
    const filteredQuery = applyFilters(query, filterMapping, filters)
    const entities: Record<string, any>[] = await filteredQuery
    return entities
  },
)
