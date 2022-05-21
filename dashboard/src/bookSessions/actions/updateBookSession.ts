import {makeRequest} from '../../shared/utils'
import {bookSessionSchema} from '../model'

export const updateBookSession = async ({
  id,
  data,
  authToken,
}: {
  id: string
  data: {page?: number}
  authToken: string
}) => {
  const response = await makeRequest({
    authToken,
    method: 'patch',
    path: `/bookSessions/${id}`,
    data,
  })

  const bookSession = bookSessionSchema.parse(response.data)

  return bookSession
}
