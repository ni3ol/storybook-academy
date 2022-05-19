import {Knex} from 'knex'
import {z} from 'zod'
import {hashPassword} from '../../auth/utils'
import {db, useOrCreateTransaction} from '../../db/db'
import {utcNow} from '../../shared/utils'
import {User} from '../../users/model'
import {Class, classSchema} from '../model'

export const updateClassInputSchema = z.object({
  name: classSchema.shape.name.optional(),
  bookId: classSchema.shape.bookId.optional(),
  linkedClassId: classSchema.shape.linkedClassId.optional(),
  educatorId: classSchema.shape.educatorId.optional(),
  password: classSchema.shape.password.optional(),
})

export type UpdateClassInputData = z.infer<typeof updateClassInputSchema>

export const updateClass = (
  id: string,
  data: UpdateClassInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const now = utcNow()
    const query = db('classes')
      .update({...data, updatedAt: now})
      .where('id', '=', id)
      .returning('*')
      .transacting(trx)

    if (data.linkedClassId) {
      await db('classes')
        .update({linkedClassId: id, updatedAt: now})
        .where('id', '=', data.linkedClassId)
        .returning('*')
        .transacting(trx)
    }

    if (data.password) {
      const passwordHash = await hashPassword(data.password)
      await db('users')
        .update({passwordHash, updatedAt: now})
        .where('classId', '=', id)
        .returning('*')
        .transacting(trx)
    }

    const [theClass] = (await query) as Class[]
    return theClass
  })
}
