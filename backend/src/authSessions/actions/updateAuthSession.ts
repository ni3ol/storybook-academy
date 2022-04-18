import {z} from 'zod'
import {EntityType} from '../..'
import {persistFacts} from '../../factStore'
import {createUpdateAction} from '../../shared/actionUtils'
import {AuthSession, authSessionSchema} from '../model'

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
    const {
      entities: [authSession],
    } = await persistFacts<AuthSession>(
      [{entityType: EntityType.AuthSession, entityId: id, data}],
      {trx, asOf},
    )

    return authSession
  },
)
