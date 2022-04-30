import {z} from 'zod'
import {db} from '../../db/db'
import {createUpdateAction} from '../../shared/actionUtils'
import {UserRole, userSchema} from '../model'

export const updateUserInputSchema = z.object({
  emailAddress: userSchema.shape.emailAddress.optional(),
  firstName: userSchema.shape.firstName.optional(),
  lastName: userSchema.shape.lastName.optional(),
  role: userSchema.shape.role.optional(),
})

export type UpdateUserInputData = z.infer<typeof updateUserInputSchema>

export const [updateUser] = createUpdateAction(
  {
    inputSchema: updateUserInputSchema,
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
