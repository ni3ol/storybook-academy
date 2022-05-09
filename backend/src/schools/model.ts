import {z} from 'zod'
import {entitySchema} from '../shared/utils'

export const schoolSchema = entitySchema
  .extend({
    name: z.string(),
  })
  .strict()

export type School = z.infer<typeof schoolSchema>
