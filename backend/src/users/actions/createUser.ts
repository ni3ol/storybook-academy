import {z} from 'zod'
import {EntityType} from '../..'
import {hashPassword} from '../../auth/utils'
import {persistFacts} from '../../factStore'
import {createCreateAction} from '../../shared/actionUtils'
import {getUuid} from '../../shared/utils'
import {User, UserRole, userSchema} from '../model'

export const createUserDataSchema = z.object({
  id: userSchema.shape.id.optional(),
  emailAddress: userSchema.shape.emailAddress,
  firstName: userSchema.shape.firstName,
  lastName: userSchema.shape.lastName,
  password: z.string(),
  role: userSchema.shape.role.optional(),
})

export type CreateUserData = z.infer<typeof createUserDataSchema>

export const [createUser, createUserAction] = createCreateAction(
  {
    inputSchema: createUserDataSchema,
    outputSchema: userSchema,
    authorization: ({as}) => {
      return as?.user?.role === UserRole.Admin
    },
  },
  async ({password, ...data}, {trx, asOf}) => {
    const passwordHash = await hashPassword(password)
    const id = data.id || getUuid()
    const {
      entities: [user],
    } = await persistFacts<User>(
      [
        {
          entityType: EntityType.User,
          entityId: id,
          data: {
            ...data,
            id,
            createdAt: asOf,
            updatedAt: asOf,
            passwordHash,
            role: data.role || UserRole.User,
          },
        },
      ],
      {trx, asOf},
    )
    return user
  },
)
