import {z} from 'zod'
import {entitySchema} from '../shared/utils'

export const passwordResetRequestSchema = entitySchema
  .extend({
    emailAddress: z.string().email(),
    userId: z.string().uuid(),
    token: z.string(),
    expiresOn: z.date(),
    usedOn: z.date().optional().nullable(),
  })
  .strict()

export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>
