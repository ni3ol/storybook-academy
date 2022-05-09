import {makeRequest} from '../../shared/utils'
import {bookSchema} from '../model'

export const updateBook = async ({
  id,
  data,
  authToken,
}: {
  id: string
  data: any
  authToken: string
}) => {
  const response = await makeRequest({
    authToken,
    method: 'patch',
    path: `/books/${id}`,
    data,
  })

  const book = bookSchema.parse(response.data)

  return book
}
