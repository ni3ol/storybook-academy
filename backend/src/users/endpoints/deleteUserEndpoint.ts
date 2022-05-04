/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {z} from 'zod'
import {Endpoint} from '../../http/endpoint'
import {deleteUser} from '../actions/deleteUser'

export const deleteUserEndpoint: Endpoint<any, any, any> = {
  method: 'delete',
  path: '/users/:id',
  requireAuth: true,
  validation: {
    params: z.object({id: z.string().uuid()}),
  },
  handler: async ({params, user: authedUser}) => {
    await deleteUser(params.id, {as: {user: authedUser}})
    return {}
  },
}
