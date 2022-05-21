import {makeRequest} from '../../shared/utils'
import {userSchema} from '../model'

export const pairChildren = async ({
  data,
  authToken,
}: {
  data: {child1Id: string; child2Id: string}
  authToken: string
}) => {
  const response = await makeRequest({
    authToken,
    method: 'post',
    path: `/users/pairChildren`,
    data: {child1Id: data.child1Id, child2Id: data.child2Id},
  })

  const user = userSchema.parse(response.data)

  return user
}
