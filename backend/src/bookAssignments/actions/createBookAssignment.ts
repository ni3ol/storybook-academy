import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {AuthorizationError} from '../../errors'
import {getUuid, utcNow} from '../../shared/utils'
import {User, UserRole} from '../../users/model'
import {BookAssignment, bookAssignmentSchema} from '../model'

export const createBookAssignmentInputSchema = z.object({
  bookId: z.string().uuid(),
  schoolId: z.string().uuid().optional().nullable(),
  classId: z.string().uuid().optional().nullable(),
})

export type CreateBookAssignmentInputData = z.infer<
  typeof createBookAssignmentInputSchema
>

export const createBookAssignment = async (
  data: CreateBookAssignmentInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  const asOf = utcNow()

  if (params?.skipAuth !== true && params?.as?.user?.role !== UserRole.Admin) {
    throw new AuthorizationError()
  }

  const parsedData = createBookAssignmentInputSchema.parse(data)
  const id = getUuid()
  const bookAssignment: BookAssignment = {
    ...parsedData,
    id,
    createdAt: asOf,
    updatedAt: asOf,
  }

  await useOrCreateTransaction(params?.trx, async (trx) => {
    await db('bookAssignments')
      .insert(bookAssignment)
      .returning('*')
      .transacting(trx)
  })

  const parsedBookAssignment = bookAssignmentSchema.parse(bookAssignment)
  return parsedBookAssignment
}
