import {z} from 'zod'
import {entitySchema} from '../shared/utils'

export const authSessionSchema = entitySchema.extend({
  userId: z.string(),
  token: z.string(),
})

export type AuthSession = z.infer<typeof authSessionSchema>
