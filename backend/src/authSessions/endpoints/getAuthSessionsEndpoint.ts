import {createListEndpoint} from '../../http/utils'
import {
  authSessionsFilterSchema,
  getAuthSessions,
} from '../actions/getAuthSessions'
import {serializeAuthSession} from '../actions/serializeAuthSession'

export const getAuthSessionsEndpoint = createListEndpoint({
  path: '/authSessions',
  requireAuth: false,
  getEntities: getAuthSessions,
  getEntitiesCount: () => Promise.resolve(4),
  queryParamsSchema: authSessionsFilterSchema,
  serializer: serializeAuthSession,
})
