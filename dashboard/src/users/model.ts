import {z} from 'zod'
import {entitySchema} from '../shared/entity'

export enum UserRole {
  User = 'user',
  Admin = 'admin',
  Teacher = 'teacher',
  Principal = 'principal',
  Child = 'child',
}

export const userSchema = entitySchema.extend({
  firstName: z.string(),
  lastName: z.string(),
  emailAddress: z.string().email(),
  role: z.nativeEnum(UserRole),
  profileCreated: z.boolean().optional().nullable(),
  nickname: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  age: z.number().nullable().optional(),
  favouriteColor: z.string().optional().nullable(),
  favouriteAnimal: z.string().optional().nullable(),
})

export type User = z.infer<typeof userSchema>
