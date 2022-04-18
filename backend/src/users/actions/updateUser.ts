import {z} from 'zod'
import {EntityType} from '../..'
import {persistFacts} from '../../factStore'
import {createUpdateAction} from '../../shared/actionUtils'
import {User, UserRole, userSchema} from '../model'

export const updateUserDataSchema = z.object({
  emailAddress: userSchema.shape.emailAddress.optional(),
  firstName: userSchema.shape.firstName.optional(),
  lastName: userSchema.shape.lastName.optional(),
  role: userSchema.shape.role.optional(),
})

export type UpdateUserData = z.infer<typeof updateUserDataSchema>

export const [updateUser, updateUserAction] = createUpdateAction(
  {
    inputSchema: updateUserDataSchema,
    outputSchema: userSchema,
    authorization: ({as}) => {
      return as?.user?.role === UserRole.Admin
    },
  },
  async (id, data, {trx, asOf}) => {
    const {
      entities: [user],
    } = await persistFacts<User>(
      [{entityType: EntityType.User, entityId: id, data}],
      {trx, asOf},
    )
    return user
  },
)
