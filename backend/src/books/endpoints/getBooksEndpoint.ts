/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Endpoint} from '../../http/endpoint'
import {getBooks} from '../actions/getBooks'
import {serializeBook} from '../actions/serializeBook'

export const getBooksEndpoint: Endpoint<any, any, any> = {
  method: 'get',
  path: '/books',
  requireAuth: true,
  handler: async ({user: authedUser}) => {
    const books = await getBooks({as: {user: authedUser}})
    const serializedBooks = books.map((book) =>
      serializeBook(book, {as: {user: authedUser}}),
    )
    return {entities: serializedBooks}
  },
}
