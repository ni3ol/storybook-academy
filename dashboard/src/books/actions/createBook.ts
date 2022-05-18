import {makeRequest} from '../../shared/utils'
import {bookSchema} from '../model'

export const createBook = async ({
  data,
  authToken,
}: {
  data: {title: string}
  authToken: string
}) => {
  const response = await makeRequest({
    authToken,
    method: 'post',
    path: '/books',
    data,
  })

  const book = bookSchema.parse(response.data)

  return book
}
