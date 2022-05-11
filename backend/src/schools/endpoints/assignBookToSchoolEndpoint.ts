/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {z} from 'zod'
import {serializeBook} from '../../books/actions/serializeBook'
import {Endpoint} from '../../http/endpoint'
import {assignBookToSchool} from '../actions/assignBookToSchool'

export const assignBookToSchoolEndpoint: Endpoint<any, any, any> = {
  method: 'post',
  path: '/schools/:schoolId/assignBook',
  requireAuth: true,
  validation: {
    params: z.object({schoolId: z.string().uuid()}),
    body: z.object({bookId: z.string().uuid()}),
  },
  handler: async ({params, body, user: authedUser}) => {
    const book = await assignBookToSchool(
      {bookId: body.bookId, schoolId: params.schoolId},
      {as: {user: authedUser}},
    )
    const serializedEntity = await serializeBook(book, {
      as: {user: authedUser},
    })
    return serializedEntity
  },
}
