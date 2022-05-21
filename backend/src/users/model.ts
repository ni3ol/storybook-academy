import {z} from 'zod'
import {entitySchema} from '../shared/utils'

export enum UserRole {
  User = 'user',
  Admin = 'admin',
  Teacher = 'teacher',
  Principal = 'principal',
  Child = 'child',
}

export const userSchema = entitySchema
  .extend({
    emailAddress: z.string().email().optional().nullable(),
    username: z.string().optional().nullable(),
    firstName: z.string(),
    lastName: z.string(),
    passwordHash: z.string().optional().nullable(),
    role: z.nativeEnum(UserRole),
    schoolId: z.string().uuid().nullable().optional(),
    classId: z.string().uuid().nullable().optional(),
    readingLevel: z.number().nullable().optional(),
    age: z.number().nullable().optional(),
    favouriteAnimal: z.string().nullable().optional(),
    favouriteColor: z.string().nullable().optional(),
    nickname: z.string().nullable().optional(),
    profileCreated: z.boolean().nullable().optional(),
    profilePicture: z.string().nullable().optional(),
    linkedChildId: z.string().uuid().optional().nullable(),
  })
  .strict()

export type User = z.infer<typeof userSchema>
