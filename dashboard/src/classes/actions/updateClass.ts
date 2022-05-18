import {makeRequest} from '../../shared/utils'
import {classSchema} from '../model'

export const updateClass = async ({
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
    path: `/classes/${id}`,
    data,
  })

  const theClass = classSchema.parse(response.data)

  return theClass
}
