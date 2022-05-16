/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {z} from 'zod'
import {Endpoint} from '../../http/endpoint'
import {serializeUser} from '../actions/serializeUser'
import {assignChildToClass} from '../actions/assignChildToClass'

export const assignChildToClassEndpoint: Endpoint<any, any, any> = {
  method: 'post',
  path: '/users/:id/assignToClass',
  requireAuth: true,
  validation: {
    body: z.object({classId: z.string().uuid()}),
    params: z.object({id: z.string().uuid()}),
  },
  handler: async ({body, user: authedUser, params}) => {
    const user = await assignChildToClass(
      {classId: body.classId, userId: params.id},
      {
        as: {user: authedUser},
      },
    )
    const serializedEntity = await serializeUser(user, {as: {user: authedUser}})
    return serializedEntity
  },
}
