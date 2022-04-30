import {ZodSchema} from 'zod'
import {db} from '../db/db'
import {
  ActionParams,
  CountActionHandler,
  CreateAction,
  GetAction,
} from '../shared/actionUtils'
import {Serializer} from '../shared/serializer'
import {Endpoint} from './endpoint'

export const createCreateEndpoint = <E, QB>({
  path,
  requireAuth,
  bodyParamsSchema,
  createEntity,
  serializer,
}: {
  path: string
  requireAuth?: boolean
  bodyParamsSchema: ZodSchema<QB>
  createEntity: CreateAction<E, QB>
  serializer: Serializer<E>
}) => {
  const endpoint: Endpoint<QB, any, any> = {
    method: 'post',
    path,
    requireAuth,
    validation: {
      body: bodyParamsSchema,
    },
    handler: ({body, user}) => {
      return db.transaction(async (trx) => {
        const entity = await createEntity(body as QB, {trx, as: {user}})
        const serializedEntity = await serializer(entity, {as: {user}})
        return serializedEntity
      })
    },
  }

  return endpoint
}

export const createSingularEndpoint = <E, PS>({
  path,
  requireAuth,
  paramsSchema,
  getEntity,
  serializer,
}: {
  path: string
  requireAuth: boolean
  paramsSchema: ZodSchema<PS>
  getEntity: ({params}: {params: PS}, actionParams: ActionParams) => Promise<E>
  serializer: Serializer<E>
}) => {
  const endpoint: Endpoint<any, PS, any> = {
    method: 'get',
    path,
    requireAuth,
    validation: {
      params: paramsSchema,
    },
    handler: ({params, user}) => {
      return db.transaction(async (trx) => {
        const actionParams = {trx, as: {user}}
        const entity = await getEntity({params} as {params: PS}, actionParams)
        const serializedEntity = await serializer(entity, {as: {user}})
        return serializedEntity
      })
    },
  }

  return endpoint
}

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
  getEntities: GetAction<E, QP>
  getEntitiesCount: CountActionHandler<QP>
  serializer: Serializer<E>
}) => {
  const endpoint: Endpoint<any, any, QP> = {
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
        const serializedEntities = await Promise.all(
          entities.map(async (entity) => serializer(entity, {as: {user}})),
        )
        const count = await getEntitiesCount(params)
        return {entities: serializedEntities, count}
      })
    },
  }

  return endpoint
}
