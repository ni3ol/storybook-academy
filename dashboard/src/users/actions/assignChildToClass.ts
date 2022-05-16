import {makeRequest} from '../../shared/utils'
import {userSchema} from '../model'

export const assignChildToClass = async ({
  data,
  authToken,
}: {
  data: {classId: string; userId: string}
  authToken: string
}) => {
  const response = await makeRequest({
    authToken,
    method: 'post',
    path: `/users/${data.userId}/assignToClass`,
    data: {classId: data.classId},
  })

  const user = userSchema.parse(response.data)

  return user
}
