import {makeRequest} from '../../shared/utils'
import {userSchema} from '../model'

export const createUser = async ({
  data,
  authToken,
}: {
  data: any
  authToken: string
}) => {
  const response = await makeRequest({
    authToken,
    method: 'post',
    path: '/users',
    data,
  })

  const user = userSchema.parse(response.data)

  return user
}
