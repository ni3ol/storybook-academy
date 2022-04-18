/* eslint-disable @typescript-eslint/no-unsafe-return */
import {z} from 'zod'
import {EntityType} from '../..'
import {queryEntities} from '../../factStore'
import {
  applyFilters,
  createGetAction,
  FilterMapping,
} from '../../shared/actionUtils'
import {User, userSchema} from '../model'

export const userFiltersSchema = z
  .object({
    id: z.string().uuid(),
    emailAddress: z.string(),
  })
  .strict()
  .partial()

export type UserFilters = z.infer<typeof userFiltersSchema>

const filterMapping: FilterMapping<UserFilters> = {
  id: (query, filters) => query.where('id', '=', filters.id!),
  emailAddress: (query, filters) =>
    query.whereRaw(`data->>? = ?`, ['emailAddress', filters.emailAddress!]),
}

export const [getUsers, getUsersAction] = createGetAction(
  {
    filterSchema: userFiltersSchema,
    outputSchema: userSchema,
    authorization: ({as}) => {
      return !!as?.user
    },
  },
  async ({trx, filters}) => {
    const entities = await queryEntities<User>({
      entityType: EntityType.User,
      hook: (query) => {
        return applyFilters(query, filterMapping, filters)
      },
      trx,
    })

    return entities
  },
)
