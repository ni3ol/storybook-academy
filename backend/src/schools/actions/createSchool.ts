import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {AuthorizationError} from '../../errors'
import {getUuid, utcNow} from '../../shared/utils'
import {User, UserRole} from '../../users/model'
import {School, schoolSchema} from '../model'

export const createSchoolInputSchema = z.object({
  name: z.string(),
})

export type CreateSchoolInputData = z.infer<typeof createSchoolInputSchema>

export const createSchool = async (
  data: CreateSchoolInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  const asOf = utcNow()

  if (params?.skipAuth !== true && params?.as?.user?.role !== UserRole.Admin) {
    throw new AuthorizationError()
  }

  const parsedData = createSchoolInputSchema.parse(data)
  const id = getUuid()
  const school: School = {
    ...parsedData,
    id,
    createdAt: asOf,
    updatedAt: asOf,
  }

  await useOrCreateTransaction(params?.trx, async (trx) => {
    await db('schools').insert(school).returning('*').transacting(trx)
  })

  const parsedBook = schoolSchema.parse(school)
  return parsedBook
}
