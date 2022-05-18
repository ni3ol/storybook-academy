/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {z} from 'zod'
import {serializeBook} from '../../books/actions/serializeBook'
import {Endpoint} from '../../http/endpoint'
import {assignBookToClass} from '../actions/assignBookToClass'

export const assignBookToClassEndpoint: Endpoint<any, any, any> = {
  method: 'post',
  path: '/classes/:classId/assignBook',
  requireAuth: true,
  validation: {
    params: z.object({classId: z.string().uuid()}),
    body: z.object({bookId: z.string().uuid()}),
  },
  handler: async ({params, body, user: authedUser}) => {
    const book = await assignBookToClass(
      {bookId: body.bookId, classId: params.classId},
      {as: {user: authedUser}},
    )
    const serializedEntity = await serializeBook(book, {
      as: {user: authedUser},
    })
    return serializedEntity
  },
}
