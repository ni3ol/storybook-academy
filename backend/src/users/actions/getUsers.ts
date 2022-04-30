import {z} from 'zod'
import {db} from '../../db/db'
import {
  applyFilters,
  createGetAction,
  FilterMapping,
} from '../../shared/actionUtils'
import {userSchema} from '../model'

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
    query.where('emailAddress', '=', filters.emailAddress!),
}

export const [getUsers] = createGetAction(
  {
    filterSchema: userFiltersSchema,
    outputSchema: userSchema,
    authorization: ({as}) => {
      return !!as?.user
    },
  },
  async ({trx, filters}) => {
    const query = db.select('*').from('users').transacting(trx)
    const filteredQuery = applyFilters(query, filterMapping, filters)
    const rows: any[] = await filteredQuery
    const users = rows.map((row) => userSchema.parse(row))
    return users
  },
)
