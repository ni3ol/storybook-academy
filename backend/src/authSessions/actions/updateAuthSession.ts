import {z} from 'zod'
import {db} from '../../db/db'
import {createUpdateAction} from '../../shared/actionUtils'
import {authSessionSchema} from '../model'

export const updateAuthSessionDataSchema = z.object({
  token: authSessionSchema.shape.token.optional(),
})

export type UpdateAuthSessionData = z.infer<typeof updateAuthSessionDataSchema>

export const [updateAuthSession, updateAuthSessionAction] = createUpdateAction(
  {
    authorization: ({as}) => {
      return !!as?.user
    },
    inputSchema: updateAuthSessionDataSchema,
    outputSchema: authSessionSchema,
  },
  async (id, data, {trx, asOf}) => {
    const query = db('authSessions')
      .update({...data, updatedAt: asOf})
      .where('id', '=', id)
      .returning('*')
      .transacting(trx)
    const [authSession] = (await query) as Record<string, any>[]
    return authSession
  },
)
