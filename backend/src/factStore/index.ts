/* eslint-disable @typescript-eslint/no-unsafe-return */
import {groupBy} from 'lodash'
import {Knex} from 'knex'
import {getUuid, utcNow, WithOptional} from '../shared/utils'
import {db, useOrCreateTransaction} from '../db/db'

export type Fact<D> = {
  id: string
  createdAt: Date
  entityType: string
  entityId: string
  data: D
}

export const persistFacts = async <E>(
  facts: WithOptional<Fact<Partial<E>>, 'id' | 'createdAt'>[],
  params?: {trx?: Knex.Transaction; asOf?: Date},
) => {
  const asOf = params?.asOf || utcNow()

  const factsData = facts.map((fact) => ({
    id: fact.id || getUuid(),
    createdAt: fact.createdAt || asOf,
    ...fact,
  }))

  const entitiesById = groupBy(
    factsData,
    (fact) => `${fact.entityType}:${fact.entityId}`,
  )

  const entityData = Object.keys(entitiesById).map((key) => {
    const [entityType, entityId] = key.split(':')
    const entityFacts = entitiesById[key]
    const data = entityFacts.reduce((acc, curr) => {
      return {
        ...acc,
        ...curr.data,
      }
    }, entityFacts[0].data)
    return {
      id: entityId,
      createdAt: asOf,
      updatedAt: asOf,
      type: entityType,
      data: {...data},
    }
  })

  return useOrCreateTransaction(params?.trx, async (trx) => {
    const [entitiesResult, createdFacts] = await Promise.all([
      db
        .raw(
          `
              ? ON CONFLICT (id)
                DO UPDATE
                  SET
                    data = entities.data || EXCLUDED.data,
                    "updatedAt" = '${asOf.toISOString()}'
                  WHERE
                    entities.id = EXCLUDED.id
                RETURNING *;
            `,
          [db('entities').insert(entityData)],
        )
        .transacting(trx),
      db('facts').insert(factsData).transacting(trx).returning('*') as Promise<
        Fact<Partial<E>>[]
      >,
    ])

    const entities = (entitiesResult.rows as any[]).map(
      (row: any) =>
        ({
          ...row.data,
          id: row.id,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        } as E),
    )

    return {entities, facts: createdFacts}
  })
}

export const queryEntities = <E>({
  entityType,
  hook,
  trx: passedTrx,
}: {
  entityType: string
  hook?: (query: Knex.QueryBuilder) => Knex.QueryBuilder
  trx?: Knex.Transaction
}) => {
  return useOrCreateTransaction(passedTrx, async (trx) => {
    const query = db
      .select('*')
      .from('entities')
      .where('entities.type', '=', entityType)
      .transacting(trx)

    const updatedQuery = hook ? hook(query) : query

    const rows: any[] = await updatedQuery

    const entities: E[] = rows.map((row) => ({
      ...row.data,
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }))

    return entities
  })
}
