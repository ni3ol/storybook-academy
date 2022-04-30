import {createCreateEndpoint} from '../../http/utils'
import {createUser, createUserInputSchema} from '../actions/createUser'
import {serializeUser} from '../actions/serializeUser'

export const createUserEndpoint = createCreateEndpoint({
  path: '/users',
  requireAuth: true,
  bodyParamsSchema: createUserInputSchema,
  createEntity: createUser,
  serializer: serializeUser,
})
