import {Endpoint} from '../../http/endpoint'
import {
  authSessionsFilterSchema,
  getAuthSessions,
} from '../actions/getAuthSessions'
import {serializeAuthSession} from '../actions/serializeAuthSession'

export const getAuthSessionsEndpoint: Endpoint<any, any, any> = {
  method: 'get',
  path: '/authSesssions',
  requireAuth: false,
  validation: {
    queryParams: authSessionsFilterSchema,
  },
  handler: async ({queryParams, user: authedUser}) => {
    const authSessions = await getAuthSessions({
      filters: queryParams,
      as: {user: authedUser},
    })
    const serializedAuthSessions = await Promise.all(
      authSessions.map((authSession) =>
        serializeAuthSession(authSession, {as: {user: authedUser}}),
      ),
    )
    return {entities: serializedAuthSessions}
  },
}
