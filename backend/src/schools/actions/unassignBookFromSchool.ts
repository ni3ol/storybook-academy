import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {User} from '../../users/model'

export const unassignBookToSchoolInputSchema = z.object({
  bookId: z.string().uuid(),
  schoolId: z.string().uuid(),
})

export type UnassignBookToSchoolData = z.infer<
  typeof unassignBookToSchoolInputSchema
>

export const unassignBookToSchool = async (
  data: UnassignBookToSchoolData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    await db('bookAssignments')
      .where('bookId', data.bookId)
      .andWhere('schoolId', data.schoolId)
      .del()
      .transacting(trx)
  })
}
