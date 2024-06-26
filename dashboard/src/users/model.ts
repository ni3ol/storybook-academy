import {z} from 'zod'
import {entitySchema} from '../shared/entity'

export enum UserRole {
  User = 'user',
  Admin = 'admin',
  Educator = 'educator',
  Administrator = 'administrator',
  Child = 'child',
}

export const userSchema = entitySchema.extend({
  firstName: z.string(),
  lastName: z.string(),
  emailAddress: z.string().email().optional().nullable(),
  role: z.nativeEnum(UserRole),
  schoolId: z.string().optional().nullable(),
  classId: z.string().optional().nullable(),
  profileCreated: z.boolean().optional().nullable(),
  nickname: z.string().optional().nullable(),
  readingLevel: z.number().optional().nullable(),
  username: z.string().optional().nullable(),
  age: z.number().nullable().optional(),
  favouriteColor: z.string().optional().nullable(),
  favouriteAnimal: z.string().optional().nullable(),
  profilePicture: z.string().optional().nullable(),
  linkedChildId: z.string().uuid().nullable().optional(),
})

export type User = z.infer<typeof userSchema>
