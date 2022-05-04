/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {z} from 'zod'
import {Endpoint} from '../../http/endpoint'
import {deleteBook} from '../actions/deleteBook'

export const deleteBookEndpoint: Endpoint<any, any, any> = {
  method: 'delete',
  path: '/books/:id',
  requireAuth: true,
  validation: {
    params: z.object({id: z.string().uuid()}),
  },
  handler: async ({params, user: authedUser}) => {
    await deleteBook(params.id, {as: {user: authedUser}})
    return {}
  },
}
