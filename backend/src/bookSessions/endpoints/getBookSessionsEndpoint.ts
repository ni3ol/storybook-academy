/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Endpoint} from '../../http/endpoint'
import {
  bookSessionFiltersSchema,
  getBookSessions,
} from '../actions/getBookSessions'

export const getBookSessionsEndpoint: Endpoint<any, any, any> = {
  method: 'get',
  path: '/bookSessions',
  requireAuth: true,
  validation: {
    queryParams: bookSessionFiltersSchema,
  },
  handler: async ({queryParams, user: authedUser}) => {
    const bookSessions = await getBookSessions({
      filters: queryParams,
      as: {user: authedUser},
    })
    return {entities: bookSessions}
  },
}
