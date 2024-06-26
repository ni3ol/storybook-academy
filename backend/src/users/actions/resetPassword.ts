import {Knex} from 'knex'
import {z} from 'zod'
import {hashPassword} from '../../auth/utils'
import {InvalidRequestError} from '../../errors'
import {getUsers} from './getUsers'
import {updateUser} from './updateUser'

const resetPasswordSchema = z.object({
  userId: z.string(),
  newPassword: z.string(),
})

type Data = z.infer<typeof resetPasswordSchema>

export const resetPassword = async ({
  data,
  trx,
}: {
  data: Data
  trx?: Knex.Transaction
}) => {
  const [user] = await getUsers({filters: {id: data.userId}, trx})
  if (!user) {
    throw new InvalidRequestError('User not found')
  }

  const newPasswordHash = await hashPassword(data.newPassword)

  const updatedUser = await updateUser(
    data.userId,
    {
      passwordHash: newPasswordHash,
    },
    {trx},
  )

  return updatedUser
}
