import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {AuthorizationError} from '../../errors'
import {getUuid, utcNow} from '../../shared/utils'
import {User, UserRole} from '../../users/model'
import {Book, bookSchema} from '../model'

export const createBookInputSchema = z.object({
  createdByUserId: z.string().uuid(),
  title: z.string(),
  level1Name: z.string().optional().nullable(),
  level1Type: z.string().optional().nullable(),
  level2Name: z.string().optional().nullable(),
  level2Type: z.string().optional().nullable(),
  level3Name: z.string().optional().nullable(),
  level3Type: z.string().optional().nullable(),
  level4Name: z.string().optional().nullable(),
  level4Type: z.string().optional().nullable(),
  level5Name: z.string().optional().nullable(),
  level5Type: z.string().optional().nullable(),
})

export type CreateBookInputData = z.infer<typeof createBookInputSchema>

export const createBook = async (
  data: CreateBookInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  const asOf = utcNow()

  if (params?.skipAuth !== true && params?.as?.user?.role !== UserRole.Admin) {
    throw new AuthorizationError()
  }

  const parsedData = createBookInputSchema.parse(data)
  const id = getUuid()
  const book: Book = {
    ...parsedData,
    id,
    createdAt: asOf,
    updatedAt: asOf,
  }

  await useOrCreateTransaction(params?.trx, async (trx) => {
    await db('books').insert(book).returning('*').transacting(trx)
  })

  const parsedBook = bookSchema.parse(book)
  return parsedBook
}
