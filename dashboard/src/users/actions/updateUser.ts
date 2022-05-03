import {z} from 'zod'
import {makeRequest} from '../../shared/utils'
import {userSchema} from '../model'

export const updateUser = async ({
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
    path: `/users/${id}`,
    data,
  })

  const user = userSchema
    .extend({
      createdAt: z.string().transform((d) => new Date(d)),
    })
    .parse(response.data)

  return user
}
