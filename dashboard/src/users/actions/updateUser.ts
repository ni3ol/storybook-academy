import {makeRequest} from '../../shared/utils'
import {userSchema} from '../model'

export const updateUser = async ({
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
    path: `/users/${id}`,
    data,
  })

  const user = userSchema.parse(response.data)

  return user
}
