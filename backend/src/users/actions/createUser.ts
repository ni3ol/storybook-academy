import {Knex} from 'knex'
import {z} from 'zod'
import {hashPassword} from '../../auth/utils'
import {getClasses} from '../../classes/actions/getClasses'
import {db, useOrCreateTransaction} from '../../db/db'
import {AuthorizationError, ConflictError} from '../../errors'
import {getSchools} from '../../schools/actions/getSchools'
import {getUuid, utcNow} from '../../shared/utils'
import {User, UserRole, userSchema} from '../model'
import {getUsers} from './getUsers'

export const createUserInputSchema = z.object({
  id: userSchema.shape.id.optional(),
  emailAddress: userSchema.shape.emailAddress.optional(),
  username: userSchema.shape.username.optional(),
  firstName: userSchema.shape.firstName,
  lastName: userSchema.shape.lastName,
  password: z.string().optional(),
  role: userSchema.shape.role.optional(),
  schoolId: userSchema.shape.schoolId,
  readingLevel: userSchema.shape.readingLevel.optional(),
  classId: userSchema.shape.classId.optional(),
})

export type CreateUserInputData = z.infer<typeof createUserInputSchema>

export const createUser = async (
  data: CreateUserInputData,
  params?: {trx?: Knex.Transaction; as?: {user?: User}; skipAuth?: boolean},
) => {
  const [existingUser] = data.emailAddress
    ? await getUsers({
        filters: {emailAddress: data.emailAddress},
        skipAuth: true,
      })
    : []
  if (existingUser) {
    throw new ConflictError(`User with that email address already exists`)
  }

  const asOf = utcNow()

  if (params?.skipAuth !== true && params?.as?.user?.role !== UserRole.Admin) {
    throw new AuthorizationError()
  }

  const {password, schoolId, firstName, lastName, classId, ...other} =
    createUserInputSchema.parse(data)
  const [theClass] = await getClasses({filters: classId ? {id: classId} : {}})
  const classPassword = theClass ? theClass.password : undefined
  // eslint-disable-next-line no-nested-ternary
  const passwordHash = password
    ? await hashPassword(password)
    : classPassword
    ? await hashPassword(classPassword)
    : undefined
  const id = other.id || getUuid()
  const schools = await getSchools()
  const schoolName = schools
    .find((s) => s.id === schoolId)
    ?.name?.slice(0, 3)
    .toLowerCase()

  let username = `${firstName.slice(0, 3).toLowerCase()}${lastName
    .slice(0, 3)
    .toLowerCase()}${schoolName ? '-' : ''}${schoolName || ''}`

  const isUsernameUnique = async (userName: string) =>
    (await getUsers({filters: {username: userName}})).length === 0
  const getRandomNumber = () => Math.floor(Math.random() * (9 - 1 + 1) + 1)

  if (!(await isUsernameUnique(username))) {
    username += getRandomNumber()
    if (!(await isUsernameUnique(username))) {
      username += getRandomNumber()
    }
  }

  const user: User = {
    ...other,
    id,
    createdAt: asOf,
    updatedAt: asOf,
    passwordHash,
    schoolId,
    firstName,
    lastName,
    role: data.role || UserRole.User,
    username,
  }

  await useOrCreateTransaction(params?.trx, async (trx) => {
    await db('users').insert(user).returning('*').transacting(trx)
  })

  const parsedUser = userSchema.parse(user)
  return parsedUser
}
