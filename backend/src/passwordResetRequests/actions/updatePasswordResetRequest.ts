import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {utcNow} from '../../shared/utils'
import {User} from '../../users/model'
import {PasswordResetRequest} from '../model'

export const updatePasswordResetRequestSchema = z.object({
  usedOn: z.date().optional(),
})

export type UpdatePasswordResetRequest = z.infer<
  typeof updatePasswordResetRequestSchema
>

export const updatePasswordResetRequest = (
  id: string,
  data: UpdatePasswordResetRequest,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const now = utcNow()
    const query = db('passwordResetRequests')
      .update({...data, updatedAt: now})
      .where('id', '=', id)
      .returning('*')
      .transacting(trx)
    const [passwordResetRequest] = (await query) as PasswordResetRequest[]
    return passwordResetRequest
  })
}
