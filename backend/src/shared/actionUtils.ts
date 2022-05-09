import {Knex} from 'knex'
import {ZodSchema} from 'zod'
import {useOrCreateTransaction} from '../db/db'
import {AuthorizationError} from '../errors'
import {User} from '../users/model'
import {getUuid, utcNow, WithOptional} from './utils'

export type CreateEntityData<E extends {id?: string}> = Omit<
  WithOptional<E, 'id'>,
  'createdAt' | 'updatedAt'
>

export type UpdateEntityData<E> = Omit<E, 'id' | 'createdAt' | 'updatedAt'>

type As = {
  user?: User
}

export type ActionParams = {
  trx?: Knex.Transaction
  as?: As
  asOf?: Date
  skipAuth?: true
}

type Yo = {
  trx: Knex.Transaction
  asOf: Date
  as?: As
  skipAuth?: true
}

export type ActionDefinition = {
  authorization: any
}

export type CreateAction<E, D> = (data: D, params?: ActionParams) => Promise<E>

export type CreateActionDefinition<E, D = undefined> = ActionDefinition & {
  inputSchema?: ZodSchema<D>
  handler: CreateAction<E, D>
}

export const createCreateAction = <OutputData, InputData>(
  {
    authorization,
    inputSchema,
    outputSchema,
  }: {
    authorization:
      | false
      | ((params: {as?: As; data: InputData}) => boolean | Promise<boolean>)
    inputSchema: ZodSchema<InputData>
    outputSchema: ZodSchema<OutputData>
  },
  f: (data: InputData, params: Yo) => Promise<OutputData>,
) => {
  const action: CreateActionDefinition<OutputData, InputData> = {
    authorization,
    inputSchema,
    handler: async (data, params) => {
      const asOf = params?.asOf || utcNow()

      if (
        params?.skipAuth !== true &&
        authorization !== false &&
        authorization({as: params?.as, data}) !== true
      ) {
        throw new AuthorizationError()
      }

      try {
        return await useOrCreateTransaction(params?.trx, async (trx) => {
          const parsedData = inputSchema.parse(data)
          const rawEntity = (await f(
            {...parsedData, id: getUuid()} as InputData,
            {
              trx,
              as: params?.as,
              asOf,
            },
          )) as any
          const entity = outputSchema.parse(rawEntity)
          return entity
        })
      } catch (error) {
        console.error(`Action failed. Data: ${JSON.stringify(data)}`)
        throw error
      }
    },
  }

  return [action.handler, action] as const
}

export type UpdateAction<E, D> = (
  id: string,
  data: D,
  params?: ActionParams,
) => Promise<E>

export type UpdateActionDefinition<E, D> = ActionDefinition & {
  handler: UpdateAction<E, D>
}

export const createUpdateAction = <E, D>(
  {
    authorization,
    inputSchema,
    outputSchema,
  }: {
    authorization: false | ((params: {as?: As; data: D}) => boolean)
    inputSchema: ZodSchema<D>
    outputSchema: ZodSchema<E>
  },
  f: (id: string, data: D, params: Yo) => Promise<E>,
) => {
  const action: UpdateActionDefinition<E, D> = {
    authorization,
    handler: async (id, data, params) => {
      const asOf = params?.asOf || utcNow()

      if (
        params?.skipAuth !== true &&
        authorization !== false &&
        authorization({as: params?.as, data}) !== true
      ) {
        throw new AuthorizationError()
      }

      try {
        return await useOrCreateTransaction(params?.trx, async (trx) => {
          const parsedData = inputSchema.parse(data)
          const rawEntity = (await f(id, parsedData, {
            trx,
            as: params?.as,
            asOf,
          })) as any
          const entity = outputSchema.parse(rawEntity)
          return entity
        })
      } catch (error) {
        console.error(`Action failed. Data: ${JSON.stringify(data)}`)
        throw error
      }
    },
  }

  return [action.handler, action] as const
}

export type GetAction<E, F> = (
  params?: {
    filters?: F
  } & ActionParams,
) => Promise<E[]>

export type CountActionHandler<F> = (
  params: {
    filters?: F
  } & ActionParams,
) => Promise<number>

export type GetActionDefinition<E, F> = ActionDefinition & {
  filterSchema: ZodSchema<F>
  handler: GetAction<E, F>
}

export const createGetAction = <E, F = null>(
  {
    outputSchema,
    filterSchema,
    authorization,
  }: {
    outputSchema: ZodSchema<E>
    filterSchema: ZodSchema<F>
    authorization: false | ((params: {as?: As}) => any)
  },
  f: (params: {filters?: F} & Yo) => Promise<E[]>,
) => {
  const action: GetActionDefinition<E, F> = {
    filterSchema,
    authorization,
    handler: async (params) => {
      const asOf = params?.asOf || utcNow()

      const filters = params?.filters
        ? filterSchema.parse(params.filters)
        : undefined

      if (
        params?.skipAuth !== true &&
        authorization !== false &&
        authorization({as: params?.as}) !== true
      ) {
        throw new AuthorizationError()
      }

      try {
        const resultEntities = await useOrCreateTransaction(
          params?.trx,
          async (trx) => {
            const entities = await f({
              filters,
              trx,
              as: params?.as,
              asOf,
            })
            return entities
          },
        )
        const entities = resultEntities.map((e) => outputSchema.parse(e))
        return entities
      } catch (error) {
        console.error(`Action failed.`)
        throw error
      }
    },
  }

  return [action.handler, action] as const
}

export type FilterMapping<F> = {
  [key in keyof F]: (query: Knex.QueryBuilder, filters: F) => Knex.QueryBuilder
}

export const applyFilters = <F>(
  query: Knex.QueryBuilder,
  mapping: FilterMapping<F>,
  filters?: F,
) => {
  const filteredQuery = filters
    ? Object.keys(filters)
        .filter((key) => !!filters[key as keyof F])
        .reduce((acc, filterKey) => {
          const applier = mapping[filterKey as keyof F]
          if (!applier) {
            throw new Error('Missing filter applier')
          }
          return applier(query, filters)
        }, query)
    : query

  return filteredQuery
}
