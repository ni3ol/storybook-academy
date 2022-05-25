import {makeRequest, Pagination} from '../../shared/utils'
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
  pagination,
}: {
  authToken: string
  filters?: UserFilters
  pagination?: Pagination
}) => {
  const {data}: {data: any} = await makeRequest({
    authToken,
    method: 'get',
    path: '/users',
    queryParams: {...filters, ...pagination},
  })
  const users: User[] = data.entities.map((dto: any) => userSchema.parse(dto))
  const {count} = data
  return {entities: users, count}
}
