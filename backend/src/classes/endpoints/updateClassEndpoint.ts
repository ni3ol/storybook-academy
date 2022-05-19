/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {z} from 'zod'
import {Endpoint} from '../../http/endpoint'
import {serializeClass} from '../actions/serializeClass'
import {updateClass, updateClassInputSchema} from '../actions/updateClass'

export const updateClassEndpoint: Endpoint<any, any, any> = {
  method: 'patch',
  path: '/classes/:id',
  requireAuth: true,
  validation: {
    body: updateClassInputSchema,
    params: z.object({id: z.string().uuid()}),
  },
  handler: async ({body, user: authedUser, params}) => {
    const theClass = await updateClass(params.id, body, {
      as: {user: authedUser},
    })
    const serializedEntity = await serializeClass(theClass, {
      as: {user: authedUser},
    })
    return serializedEntity
  },
}
