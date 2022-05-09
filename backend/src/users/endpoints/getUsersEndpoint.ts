import {Endpoint, NewEndpoint} from '../../http/endpoint'
import {getUsers, userFiltersSchema} from '../actions/getUsers'
import {serializeUser} from '../actions/serializeUser'

export const getUsersEndpoint: NewEndpoint = {
  method: 'get',
  path: '/users',
  requireAuth: true,
  validation: {
    body: userFiltersSchema,
  },
  handler: async ({body, user: authedUser}) => {
    const users = await getUsers({filters: queryParams, as: {user: authedUser}})
    const serializedUsers = await Promise.all(
      users.map((user) => serializeUser(user, {as: {user: authedUser}})),
    )
    return {entities: serializedUsers}
  },
}
