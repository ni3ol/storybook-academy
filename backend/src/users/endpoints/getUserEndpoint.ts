import {z} from 'zod'
import {Endpoint} from '../../http/endpoint'
import {getUsers} from '../actions/getUsers'
import {serializeUser} from '../actions/serializeUser'

export const getUserEndpoint: Endpoint<any, any, any> = {
  method: 'get',
  path: '/users/:id',
  requireAuth: true,
  validation: {
    params: z.object({id: z.string().uuid()}),
  },
  handler: async ({params, user: authedUser}) => {
    const [user] = await getUsers({filters: params.id, as: {user: authedUser}})
    const serializedUser = await serializeUser(user, {as: {user: authedUser}})
    return serializedUser
  },
}
