import {z} from 'zod'
import {db} from '../../db/db'
import {createUpdateAction} from '../../shared/actionUtils'
import {UserRole, userSchema} from '../model'

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
    const query = db('users')
      .update({...data, updatedAt: asOf})
      .where('id', '=', id)
      .returning('*')
      .transacting(trx)
    const [user] = (await query) as Record<string, any>[]
    return user
  },
)
