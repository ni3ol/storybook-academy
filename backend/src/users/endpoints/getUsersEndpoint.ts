import {createListEndpoint} from '../../http/utils'
import {getUsers, userFiltersSchema} from '../actions/getUsers'
import {serializeUser} from '../actions/serializeUser'

export const getUsersEndpoint = createListEndpoint({
  path: '/users',
  requireAuth: true,
  queryParamsSchema: userFiltersSchema,
  getEntities: getUsers,
  getEntitiesCount: () => Promise.resolve(4),
  serializer: serializeUser,
})
