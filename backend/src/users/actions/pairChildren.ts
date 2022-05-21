import {Knex} from 'knex'
import {z} from 'zod'
import {createBookSession} from '../../bookSessions/actions/createBookSession'
import {getClasses} from '../../classes/actions/getClasses'
import {db, useOrCreateTransaction} from '../../db/db'
import {InvalidRequestError} from '../../errors'
import {UserRole} from '../model'
import {getUsers} from './getUsers'
import {updateUser} from './updateUser'

export const pairChildrenSchema = z.object({
  child1Id: z.string().uuid(),
  child2Id: z.string().uuid(),
})

export type PairChildrenData = z.infer<typeof pairChildrenSchema>

export const pairChildren = async (
  data: PairChildrenData,
  params?: {trx?: Knex.Transaction},
) => {
  return useOrCreateTransaction(params?.trx, async (trx) => {
    const [child1] = await getUsers({filters: {id: data.child1Id}, trx})
    const [child2] = await getUsers({filters: {id: data.child2Id}, trx})

    if (!(child1.role === UserRole.Child && child2.role === UserRole.Child)) {
      throw new InvalidRequestError('Users must both be children')
    }

    if (!child1.classId || !child2.classId) {
      throw new InvalidRequestError('Missing or misconfigured class id')
    }

    const [theClass] = await getClasses({filters: {id: child1.classId}})

    await db('bookSessions')
      .delete()
      .where('child1Id', data.child1Id)
      .orWhere('child1Id', data.child2Id)
      .orWhere('child2Id', data.child1Id)
      .orWhere('child2Id', data.child2Id)
      .transacting(trx)

    const bookSession = await createBookSession(
      {
        child1Id: data.child1Id,
        child2Id: data.child2Id,
        bookId: theClass.bookId,
        page: 1,
      },
      {trx},
    )

    await updateUser(
      data.child1Id,
      {linkedChildId: data.child2Id, bookSessionId: bookSession.id},
      {trx},
    )
    await updateUser(
      data.child2Id,
      {linkedChildId: data.child1Id, bookSessionId: bookSession.id},
      {trx},
    )
  })
}
