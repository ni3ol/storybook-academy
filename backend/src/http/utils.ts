import {ZodSchema} from 'zod'
import {db} from '../db/db'
import {CountActionHandler, GetActionHandler} from '../shared/actionUtils'
import {Serializer} from '../shared/serializer'
import {Endpoint} from './endpoint'

export const createListEndpoint = <E, QP>({
  path,
  requireAuth,
  queryParamsSchema,
  getEntities,
  getEntitiesCount,
  serializer,
}: {
  path: string
  requireAuth: boolean
  queryParamsSchema: ZodSchema<QP>
  getEntities: GetActionHandler<E, QP>
  getEntitiesCount: CountActionHandler<QP>
  serializer: Serializer<E>
}) => {
  const endpoint: Endpoint<any, any, any> = {
    method: 'get',
    path,
    requireAuth,
    validation: {
      queryParams: queryParamsSchema,
    },
    handler: ({queryParams, user}) => {
      return db.transaction(async (trx) => {
        const params = {filters: queryParams, trx, as: {user}}
        const entities = await getEntities(params)
        const serializedEntities = entities.map((entity) =>
          serializer(entity, {as: {user}}),
        )
        const count = await getEntitiesCount(params)
        return {entities: serializedEntities, count}
      })
    },
  }

  return endpoint
}
