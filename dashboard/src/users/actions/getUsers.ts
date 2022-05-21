import {makeRequest} from '../../shared/utils'
import {User, UserRole, userSchema} from '../model'

export type UserFilters = {
  id?: string
  notId?: string
  search?: string
  schoolId?: string
  role?: UserRole
  roles?: UserRole[]
  classId?: string
}

export const getUsers = async ({
  authToken,
  filters,
}: {
  authToken: string
  filters?: UserFilters
}) => {
  const {data}: {data: any} = await makeRequest({
    authToken,
    method: 'get',
    path: '/users',
    queryParams: filters,
  })
  const users: User[] = data.entities.map((dto: any) => userSchema.parse(dto))
  return users
}
