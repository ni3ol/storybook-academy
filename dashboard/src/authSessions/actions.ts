import {z} from 'zod'
import {makeRequest} from '../shared/utils'
import {authSessionSchema} from './model'

type Filters = {
  token?: string
}

export const getAuthSessions = async ({
  authToken,
  filters,
}: {
  authToken: string
  filters?: Filters
}) => {
  const {data}: {data: any} = await makeRequest({
    authToken,
    method: 'get',
    path: '/authSessions',
    queryParams: filters,
  })
  const authSessions = data.entities.map((dto: any) =>
    authSessionSchema
      .extend({
        createdAt: z.string().transform((d) => new Date(d)),
      })
      .parse(dto),
  )
  return authSessions
}
