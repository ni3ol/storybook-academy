import {z} from 'zod'
import {makeRequest} from '../../shared/utils'
import {User, userSchema} from '../model'

type Filters = {
  id?: string
  search?: string
}

export const getUsers = async ({
  authToken,
  filters,
}: {
  authToken: string
  filters?: Filters
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
