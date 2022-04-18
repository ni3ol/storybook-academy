import {z} from 'zod'
import {EntityType} from '../..'
import {persistFacts} from '../../factStore'
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
    const {
      entities: [authSession],
    } = await persistFacts<AuthSession>(
      [
        {
          entityType: EntityType.AuthSession,
          entityId: id,
          data: {
            ...data,
            id,
            createdAt: asOf,
            updatedAt: asOf,
            token: data.token || getUuid(),
          },
        },
      ],
      {trx, asOf},
    )

    return authSession
  },
)
