/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {z} from 'zod'
import {Endpoint} from '../../http/endpoint'
import {serializeBook} from '../actions/serializeBook'
import {updateBook, updateBookInputSchema} from '../actions/updateBook'

export const updateBookEndpoint: Endpoint<any, any, any> = {
  method: 'patch',
  path: '/books/:id',
  requireAuth: true,
  validation: {
    body: updateBookInputSchema,
    params: z.object({id: z.string().uuid()}),
  },
  handler: async ({body, user: authedUser, params}) => {
    const book = await updateBook(params.id, body, {
      as: {user: authedUser},
    })
    const serializedEntity = await serializeBook(book, {as: {user: authedUser}})
    return serializedEntity
  },
}
