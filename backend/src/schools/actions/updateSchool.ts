import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {utcNow} from '../../shared/utils'
import {User} from '../../users/model'
import {School, schoolSchema} from '../model'

export const updateSchoolInputSchema = z.object({
  name: schoolSchema.shape.name,
})

export type UpdateSchoolInputData = z.infer<typeof updateSchoolInputSchema>

export const updateSchool = (
  id: string,
  data: UpdateSchoolInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const now = utcNow()
    const query = db('schools')
      .update({...data, updatedAt: now})
      .where('id', '=', id)
      .returning('*')
      .transacting(trx)
    const [school] = (await query) as School[]
    return school
  })
}
