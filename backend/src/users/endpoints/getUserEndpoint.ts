import {z} from 'zod'
import {createSingularEndpoint} from '../../http/utils'
import {getUsers} from '../actions/getUsers'
import {serializeUser} from '../actions/serializeUser'

export const getUserEndpoint = createSingularEndpoint({
  path: '/users/:id',
  requireAuth: true,
  paramsSchema: z.object({id: z.string().uuid()}),
  getEntity: async ({params}) => {
    const [user] = await getUsers({filters: {id: params.id}})
    return user
  },
  serializer: serializeUser,
})
