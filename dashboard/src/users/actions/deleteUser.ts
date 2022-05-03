import {makeRequest} from '../../shared/utils'

export const deleteUser = async ({
  id,
  authToken,
}: {
  id: string
  authToken: string
}) => {
  await makeRequest({
    authToken,
    method: 'delete',
    path: `/users/${id}`,
  })
}
