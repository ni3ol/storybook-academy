import {makeRequest} from '../../shared/utils'
import {School, schoolSchema} from '../model'

type Filters = {
  id?: string
}

export const getSchools = async ({
  authToken,
  filters,
}: {
  authToken: string
  filters?: Filters
}) => {
  const {data}: {data: any} = await makeRequest({
    authToken,
    method: 'get',
    path: '/schools',
    queryParams: filters,
  })
  const schools: School[] = data.entities.map((dto: any) =>
    schoolSchema.parse(dto),
  )
  return schools
}
