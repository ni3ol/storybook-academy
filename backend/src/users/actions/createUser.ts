import {Knex} from 'knex'
import {z} from 'zod'
import {hashPassword} from '../../auth/utils'
import {db, useOrCreateTransaction} from '../../db/db'
import {AuthorizationError, ConflictError} from '../../errors'
import {getUuid, utcNow} from '../../shared/utils'
import {User, UserRole, userSchema} from '../model'
import {getUsers} from './getUsers'

export const createUserInputSchema = z.object({
  id: userSchema.shape.id.optional(),
  emailAddress: userSchema.shape.emailAddress.optional(),
  username: userSchema.shape.username.optional(),
  firstName: userSchema.shape.firstName,
  lastName: userSchema.shape.lastName,
  password: z.string().optional(),
  role: userSchema.shape.role.optional(),
  schoolId: userSchema.shape.schoolId,
  educatorId: userSchema.shape.educatorId.optional(),
  readingLevel: userSchema.shape.readingLevel.optional(),
})

export type CreateUserInputData = z.infer<typeof createUserInputSchema>

export const createUser = async (
  data: CreateUserInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  const [existingUser] = data.emailAddress
    ? await getUsers({
        filters: {emailAddress: data.emailAddress},
        skipAuth: true,
      })
    : []
  if (existingUser) {
    throw new ConflictError(`User with that email address already exists`)
  }

  const asOf = utcNow()

  if (params?.skipAuth !== true && params?.as?.user?.role !== UserRole.Admin) {
    throw new AuthorizationError()
  }

  const {password, ...other} = createUserInputSchema.parse(data)
  const passwordHash = password ? await hashPassword(password) : undefined
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
