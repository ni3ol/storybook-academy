import {makeRequest} from '../../shared/utils'
import {schoolSchema} from '../model'

export const createSchool = async ({
  data,
  authToken,
}: {
  data: {name: string}
  authToken: string
}) => {
  const response = await makeRequest({
    authToken,
    method: 'post',
    path: '/schools',
    data,
  })

  const school = schoolSchema.parse(response.data)

  return school
}
