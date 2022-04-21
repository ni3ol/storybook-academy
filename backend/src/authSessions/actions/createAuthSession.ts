import {z} from 'zod'
import {db} from '../../db/db'
import {createCreateAction} from '../../shared/actionUtils'
import {getUuid} from '../../shared/utils'
import {AuthSession, authSessionSchema} from '../model'

export const createAuthSessionDataSchema = z.object({
  id: authSessionSchema.shape.id.optional(),
  userId: authSessionSchema.shape.userId,
  token: authSessionSchema.shape.token.optional(),
})

export type CreateAuthSessionData = z.infer<typeof createAuthSessionDataSchema>

export const [createAuthSession, createAuthSessionAction] = createCreateAction(
  {
    inputSchema: createAuthSessionDataSchema,
    outputSchema: authSessionSchema,
    authorization: ({as}) => {
      return !!as?.user
    },
  },
  async (data, {trx, asOf}) => {
    const id = data.id || getUuid()
    const token = data.token || getUuid()
    const authSession: AuthSession = {
      ...data,
      id,
      createdAt: asOf,
      updatedAt: asOf,
      token,
    }
    await db('authSessions').insert(authSession).returning('*').transacting(trx)

    return authSession
  },
)
