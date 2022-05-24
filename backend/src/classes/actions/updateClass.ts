import {Knex} from 'knex'
import {z} from 'zod'
import {hashPassword} from '../../auth/utils'
import {db, useOrCreateTransaction} from '../../db/db'
import {getUuid, utcNow} from '../../shared/utils'
import {getUsers} from '../../users/actions/getUsers'
import {User} from '../../users/model'
import {Class, classSchema} from '../model'
import {getClasses} from './getClasses'

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
      const chatRoomId = getUuid()
      await db('classes')
        .update({linkedClassId: id, updatedAt: now})
        .where('id', '=', data.linkedClassId)
        .returning('*')
        .transacting(trx)

      const [linkedClass] = await getClasses({filters: {id}})
      const [linkedClassEducator] = await getUsers({
        filters: {id: linkedClass.educatorId},
      })
      const [theClassEducator] = await getUsers({
        filters: {id: data.educatorId},
      })

      await db('chatRooms')
        .insert({
          id: chatRoomId,
          createdAt: now,
          updatedAt: now,
          participant1Id: theClassEducator.id,
          participant2Id: linkedClassEducator.id,
          isAdmin: false,
        })
        .returning('*')
        .transacting(trx)
    }

    if (data.educatorId) {
      await db('users')
        .update({classId: id, updatedAt: now})
        .where('id', '=', data.educatorId)
        .returning('*')
        .transacting(trx)
    }

    if (data.bookId) {
      const [updatingClass] = await getClasses({filters: {id}})
      if (updatingClass?.linkedClassId) {
        const [linkedClass] = await getClasses({
          filters: {id: updatingClass.linkedClassId},
        })
        await db('classes')
          .update({bookId: data.bookId, updatedAt: now})
          .where('id', '=', linkedClass.id)
          .returning('*')
          .transacting(trx)
      }
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
