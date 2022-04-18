/* eslint-disable @typescript-eslint/no-unsafe-return */
import {z} from 'zod'
import {EntityType} from '../..'
import {queryEntities} from '../../factStore'
import {
  applyFilters,
  createGetAction,
  FilterMapping,
} from '../../shared/actionUtils'
import {AuthSession, authSessionSchema} from '../model'

export const authSessionsFilterSchema = z
  .object({
    id: z.string().uuid(),
    token: z.string(),
  })
  .partial()

export type Filters = z.infer<typeof authSessionsFilterSchema>

const filterMapping: FilterMapping<Filters> = {
  id: (query, filters) => query.where('id', '=', filters.id!),
  token: (query, filters) =>
    query.whereRaw(`data->>? = ?`, ['token', filters.token!]),
}

export const [getAuthSessions, getAuthSessionsAction] = createGetAction(
  {
    outputSchema: authSessionSchema,
    filterSchema: authSessionsFilterSchema,
    authorization: false,
  },
  async ({filters, trx}) => {
    const entities = await queryEntities<AuthSession>({
      entityType: EntityType.AuthSession,
      hook: (query) => applyFilters(query, filterMapping, filters),
      trx,
    })
    return entities
  },
)
