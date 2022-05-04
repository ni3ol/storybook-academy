import {z} from 'zod'
import {makeRequest} from '../../shared/utils'
import {Book, bookSchema} from '../model'

type Filters = {
  id?: string
  search?: string
}

export const getBooks = async ({
  authToken,
  filters,
}: {
  authToken: string
  filters?: Filters
}) => {
  console.log('he')
  const {data}: {data: any} = await makeRequest({
    authToken,
    method: 'get',
    path: '/books',
    queryParams: filters,
  })
  console.log(data)
  const books: Book[] = data.entities.map((dto: any) =>
    bookSchema
      .extend({
        createdAt: z.string().transform((d) => new Date(d)),
      })
      .parse(dto),
  )
  console.log(books)
  return books
}
