import {z} from 'zod'
import {makeRequest} from '../../shared/utils'
import {bookSchema} from '../model'

export const createBook = async ({
  data,
  authToken,
}: {
  data: any
  authToken: string
}) => {
  const response = await makeRequest({
    authToken,
    method: 'post',
    path: '/books',
    data,
  })

  const book = bookSchema
    .extend({
      createdAt: z.string().transform((d) => new Date(d)),
    })
    .parse(response.data)

  return book
}
