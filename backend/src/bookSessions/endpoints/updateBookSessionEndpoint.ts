/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {z} from 'zod'
import {Endpoint} from '../../http/endpoint'
import {
  updateBookSession,
  updateBookSessionSchema,
} from '../actions/updateBookSession'

export const updateBookSessionEndpoint: Endpoint<any, any, any> = {
  method: 'patch',
  path: '/bookSessions/:id',
  requireAuth: true,
  validation: {
    body: updateBookSessionSchema,
    params: z.object({id: z.string().uuid()}),
  },
  handler: async ({body, user: authedUser, params}) => {
    const bookSession = await updateBookSession(params.id, body, {
      as: {user: authedUser},
    })
    return bookSession
  },
}
