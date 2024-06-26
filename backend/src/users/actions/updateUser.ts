import {Knex} from 'knex'
import {z} from 'zod'
import {db, useOrCreateTransaction} from '../../db/db'
import {utcNow} from '../../shared/utils'
import {User, userSchema} from '../model'

export const updateUserInputSchema = z.object({
  emailAddress: userSchema.shape.emailAddress.optional(),
  firstName: userSchema.shape.firstName.optional(),
  lastName: userSchema.shape.lastName.optional(),
  role: userSchema.shape.role.optional(),
  age: userSchema.shape.age.optional(),
  favouriteAnimal: userSchema.shape.favouriteAnimal.optional(),
  favouriteColor: userSchema.shape.favouriteColor.optional(),
  nickname: userSchema.shape.nickname.optional(),
  profileCreated: userSchema.shape.profileCreated.optional(),
  schoolId: userSchema.shape.schoolId,
  classId: userSchema.shape.classId,
  readingLevel: userSchema.shape.readingLevel.optional(),
  username: userSchema.shape.username.optional(),
  profilePicture: userSchema.shape.profilePicture.optional(),
  passwordHash: userSchema.shape.passwordHash.optional(),
  linkedChildId: userSchema.shape.linkedChildId.optional(),
  bookSessionId: userSchema.shape.bookSessionId.optional(),
})

export type UpdateUserInputData = z.infer<typeof updateUserInputSchema>

export const updateUser = (
  id: string,
  data: UpdateUserInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  const updatedUser = {
    ...data,
    classId: data.schoolId ? null : data.classId,
    linkedChildId: data.schoolId ? null : data.linkedChildId,
    bookSessionId: data.schoolId ? null : data.bookSessionId,
  }

  return useOrCreateTransaction(params?.trx, async (trx) => {
    const now = utcNow()
    const query = db('users')
      .update({...updatedUser, updatedAt: now})
      .where('id', '=', id)
      .returning('*')
      .transacting(trx)
    const [user] = (await query) as User[]
    return user
  })
}
