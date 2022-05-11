/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {z} from 'zod'
import {Endpoint} from '../../http/endpoint'
import {unassignBookToSchool} from '../actions/unassignBookFromSchool'

export const unassignBookFromSchoolEndpoint: Endpoint<any, any, any> = {
  method: 'post',
  path: '/schools/:schoolId/unassignBook',
  requireAuth: true,
  validation: {
    params: z.object({schoolId: z.string().uuid()}),
    body: z.object({bookId: z.string().uuid()}),
  },
  handler: async ({params, body, user: authedUser}) => {
    await unassignBookToSchool(
      {bookId: body.bookId, schoolId: params.schoolId},
      {as: {user: authedUser}},
    )
    return {}
  },
}
