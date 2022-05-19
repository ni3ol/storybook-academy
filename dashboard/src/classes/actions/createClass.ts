import {makeRequest} from '../../shared/utils'
import {classSchema} from '../model'

export const createClass = async ({
  data,
  authToken,
}: {
  data: {name: string; educatorId: string; schoolId: string}
  authToken: string
}) => {
  const response = await makeRequest({
    authToken,
    method: 'post',
    path: '/classes',
    data,
  })

  const theClass = classSchema.parse(response.data)

  return theClass
}
