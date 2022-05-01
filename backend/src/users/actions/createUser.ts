import {Knex} from 'knex'
import {z} from 'zod'
import {hashPassword} from '../../auth/utils'
import {db, useOrCreateTransaction} from '../../db/db'
import {AuthorizationError} from '../../errors'
import {getUuid, utcNow} from '../../shared/utils'
import {User, UserRole, userSchema} from '../model'

export const createUserInputSchema = z.object({
  id: userSchema.shape.id.optional(),
  emailAddress: userSchema.shape.emailAddress,
  firstName: userSchema.shape.firstName,
  lastName: userSchema.shape.lastName,
  password: z.string(),
  role: userSchema.shape.role.optional(),
})

export type CreateUserInputData = z.infer<typeof createUserInputSchema>

export const createUser = async (
  data: CreateUserInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  const asOf = utcNow()

  if (params?.skipAuth !== true && params?.as?.user?.role !== UserRole.Admin) {
    throw new AuthorizationError()
  }

  const {password, ...other} = createUserInputSchema.parse(data)
  const passwordHash = await hashPassword(password)
  const id = other.id || getUuid()
  const user: User = {
    ...other,
    id,
    createdAt: asOf,
    updatedAt: asOf,
    passwordHash,
    role: data.role || UserRole.User,
  }

  await useOrCreateTransaction(params?.trx, async (trx) => {
    await db('users').insert(user).returning('*').transacting(trx)
  })

  const parsedUser = userSchema.parse(user)
  return parsedUser
}
