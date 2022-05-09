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
    emailAddress: z.string().email().optional(),
    username: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    passwordHash: z.string(),
    role: z.nativeEnum(UserRole),
    age: z.number().nullable().optional(),
    favouriteAnimal: z.string().nullable().optional(),
    favouriteColor: z.string().nullable().optional(),
    nickname: z.string().nullable().optional(),
    profileCreated: z.boolean().nullable().optional(),
  })
  .strict()

export type User = z.infer<typeof userSchema>
