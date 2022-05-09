import {Knex} from 'knex'
import {z} from 'zod'
import {createBookAssignment} from '../../bookAssignments/actions/createBookAssignment'
import {getBooks} from '../../books/actions/getBooks'
import {useOrCreateTransaction} from '../../db/db'
import {User} from '../../users/model'

export const assignBookToSchoolInputSchema = z.object({
  bookId: z.string().uuid(),
  schoolId: z.string().uuid(),
})

export type AssignBookToSchoolData = z.infer<
  typeof assignBookToSchoolInputSchema
>

export const assignBookToSchool = async (
  data: AssignBookToSchoolData,
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
        schoolId: data.schoolId,
      },
      {trx, as: params?.as},
    )
    return book
  })
}
