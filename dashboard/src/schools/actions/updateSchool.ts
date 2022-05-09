import {makeRequest} from '../../shared/utils'
import {schoolSchema} from '../model'

export const updateSchool = async ({
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
    path: `/schools/${id}`,
    data,
  })

  const school = schoolSchema.parse(response.data)

  return school
}
