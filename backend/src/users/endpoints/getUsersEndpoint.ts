import {Endpoint, paginationSchema} from '../../http/endpoint'
import {countUsers, getUsers, userFiltersSchema} from '../actions/getUsers'
import {serializeUser} from '../actions/serializeUser'

export const getUsersEndpoint: Endpoint<any, any, any> = {
  method: 'get',
  path: '/users',
  requireAuth: true,
  validation: {
    queryParams: userFiltersSchema.merge(paginationSchema),
  },
  handler: async ({
    queryParams: {page, pageSize, ...filters},
    user: authedUser,
  }) => {
    const users = await getUsers({
      filters,
      pagination: {page, pageSize},
      as: {user: authedUser},
    })
    const count = await countUsers({
      filters,
      as: {user: authedUser},
    })
    const serializedUsers = await Promise.all(
      users.map((user) => serializeUser(user, {as: {user: authedUser}})),
    )
    return {entities: serializedUsers, count}
  },
}
