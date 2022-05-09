import {Endpoint} from '../../http/endpoint'
import {getUsers, userFiltersSchema} from '../actions/getUsers'
import {serializeUser} from '../actions/serializeUser'

export const getUsersEndpoint: Endpoint<any, any, any> = {
  method: 'get',
  path: '/users',
  requireAuth: true,
  validation: {
    queryParams: userFiltersSchema,
  },
  handler: async ({queryParams, user: authedUser}) => {
    const users = await getUsers({filters: queryParams, as: {user: authedUser}})
    const serializedUsers = await Promise.all(
      users.map((user) => serializeUser(user, {as: {user: authedUser}})),
    )
    return {entities: serializedUsers}
  },
}
