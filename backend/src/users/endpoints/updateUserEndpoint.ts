/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {z} from 'zod'
import {Endpoint} from '../../http/endpoint'
import {serializeUser} from '../actions/serializeUser'
import {updateUser, updateUserInputSchema} from '../actions/updateUser'

export const updateUserEndpoint: Endpoint<any, any, any> = {
  method: 'patch',
  path: '/users/:id',
  requireAuth: true,
  validation: {
    body: updateUserInputSchema,
    params: z.object({id: z.string().uuid()}),
  },
  handler: async ({body, user: authedUser, params}) => {
    const user = await updateUser(params.id, body, {
      as: {user: authedUser},
    })
    const serializedEntity = await serializeUser(user, {as: {user: authedUser}})
    return serializedEntity
  },
}
