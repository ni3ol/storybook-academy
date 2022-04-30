import {z} from 'zod'
import {hashPassword} from '../../auth/utils'
import {db} from '../../db/db'
import {createCreateAction} from '../../shared/actionUtils'
import {getUuid} from '../../shared/utils'
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

export const [createUser, createUserAction] = createCreateAction(
  {
    inputSchema: createUserInputSchema,
    outputSchema: userSchema,
    authorization: ({as}) => {
      return as?.user?.role === UserRole.Admin
    },
  },
  async ({password, ...data}, {trx, asOf}) => {
    const passwordHash = await hashPassword(password)
    const id = data.id || getUuid()
    const user: User = {
      ...data,
      id,
      createdAt: asOf,
      updatedAt: asOf,
      passwordHash,
      role: data.role || UserRole.User,
    }
    await db('users').insert(user).returning('*').transacting(trx)
    return user
  },
)
