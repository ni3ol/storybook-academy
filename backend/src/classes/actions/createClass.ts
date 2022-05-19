import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {AuthorizationError} from '../../errors'
import {getUuid, utcNow} from '../../shared/utils'
import {User, UserRole} from '../../users/model'
import {classSchema, Class} from '../model'

export const createClassInputSchema = z.object({
  name: z.string(),
  educatorId: z.string().uuid(),
  schoolId: z.string().uuid(),
  linkedClassId: z.string().uuid().optional(),
  bookId: z.string().uuid().optional(),
  password: z.string(),
})

export type CreateClassInputData = z.infer<typeof createClassInputSchema>

export const createClass = async (
  data: CreateClassInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  const asOf = utcNow()

  if (params?.skipAuth !== true && params?.as?.user?.role !== UserRole.Admin) {
    throw new AuthorizationError()
  }

  const parsedData = createClassInputSchema.parse(data)
  const id = getUuid()
  const theClass: Class = {
    ...parsedData,
    id,
    createdAt: asOf,
    updatedAt: asOf,
  }

  await useOrCreateTransaction(params?.trx, async (trx) => {
    await db('classes').insert(theClass).returning('*').transacting(trx)
    await db('users')
      .update({classId: theClass.id, updatedAt: asOf})
      .where('id', '=', theClass.educatorId)
      .returning('*')
      .transacting(trx)
  })

  const parsedClass = classSchema.parse(theClass)
  return parsedClass
}
