import {z} from 'zod'
import {entitySchema} from '../shared/entity'

export const authSessionSchema = entitySchema.extend({
  userId: z.string(),
  token: z.string(),
})

export type AuthSession = z.infer<typeof authSessionSchema>
