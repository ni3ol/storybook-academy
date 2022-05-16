import {makeRequest} from '../../shared/utils'
import {classSchema, Class} from '../model'

export type ClassFilters = {
  id?: string
  schoolId?: string
}

export const getClasses = async ({
  authToken,
  filters,
}: {
  authToken: string
  filters?: ClassFilters
}) => {
  const {data}: {data: any} = await makeRequest({
    authToken,
    method: 'get',
    path: '/classes',
    queryParams: filters,
  })
  const classes: Class[] = data.entities.map((dto: any) =>
    classSchema.parse(dto),
  )
  return classes
}
