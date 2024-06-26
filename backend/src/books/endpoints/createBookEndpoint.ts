/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Endpoint} from '../../http/endpoint'
import {createBook, createBookInputSchema} from '../actions/createBook'
import {serializeBook} from '../actions/serializeBook'

export const createBookEndpoint: Endpoint<any, any, any> = {
  method: 'post',
  path: '/books',
  requireAuth: true,
  validation: {
    body: createBookInputSchema.omit({createdByUserId: true}),
  },
  handler: async ({body, user: authedUser}) => {
    const book = await createBook(
      {...body, createdByUserId: authedUser!.id},
      {as: {user: authedUser}},
    )
    const serializedEntity = await serializeBook(book, {as: {user: authedUser}})
    return serializedEntity
  },
}
