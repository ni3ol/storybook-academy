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
  profileCreated: z.boolean(),
})

export type User = z.infer<typeof userSchema>
