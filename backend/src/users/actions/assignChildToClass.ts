import {Knex} from 'knex'
import {z} from 'zod'
import {useOrCreateTransaction} from '../../db/db'
import {AuthorizationError} from '../../errors'
import {User, UserRole} from '../model'
import {updateUser} from './updateUser'

export const assignChildToClassInputSchema = z.object({
  userId: z.string().uuid(),
  classId: z.string().uuid(),
})

export type AssignChildToClassInputData = z.infer<
  typeof assignChildToClassInputSchema
>

export const assignChildToClass = async (
  data: AssignChildToClassInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  if (params?.skipAuth !== true && params?.as?.user?.role !== UserRole.Admin) {
    throw new AuthorizationError()
  }

  const parsedData = assignChildToClassInputSchema.parse(data)

  const updatedUser = await useOrCreateTransaction(params?.trx, async (trx) => {
    return updateUser(
      parsedData.userId,
      {classId: parsedData.classId},
      {skipAuth: true, trx},
    )
  })

  return updatedUser
}
