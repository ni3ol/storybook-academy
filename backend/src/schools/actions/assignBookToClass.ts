import {Knex} from 'knex'
import {z} from 'zod'
import {createBookAssignment} from '../../bookAssignments/actions/createBookAssignment'
import {getBooks} from '../../books/actions/getBooks'
import {useOrCreateTransaction} from '../../db/db'
import {User} from '../../users/model'

export const assignBookToClassInputSchema = z.object({
  bookId: z.string().uuid(),
  classId: z.string().uuid(),
})

export type AssignBookToClassData = z.infer<typeof assignBookToClassInputSchema>

export const assignBookToClass = async (
  data: AssignBookToClassData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const [book] = await getBooks({
      filters: {id: data.bookId},
      trx,
      as: params?.as,
    })
    await createBookAssignment(
      {
        bookId: data.bookId,
        classId: data.classId,
      },
      {trx, as: params?.as},
    )
    return book
  })
}
