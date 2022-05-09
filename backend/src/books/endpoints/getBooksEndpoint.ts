/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Endpoint} from '../../http/endpoint'
import {bookFiltersSchema, getBooks} from '../actions/getBooks'
import {serializeBook} from '../actions/serializeBook'

export const getBooksEndpoint: Endpoint<any, any, any> = {
  method: 'get',
  path: '/books',
  requireAuth: true,
  validation: {
    queryParams: bookFiltersSchema,
  },
  handler: async ({queryParams, user: authedUser}) => {
    const books = await getBooks({filters: queryParams, as: {user: authedUser}})
    const serializedBooks = books.map((book) =>
      serializeBook(book, {as: {user: authedUser}}),
    )
    return {entities: serializedBooks}
  },
}
