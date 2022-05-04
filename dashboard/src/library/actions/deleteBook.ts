import {makeRequest} from '../../shared/utils'

export const deleteBook = async ({
  id,
  authToken,
}: {
  id: string
  authToken: string
}) => {
  await makeRequest({
    authToken,
    method: 'delete',
    path: `/books/${id}`,
  })
}
