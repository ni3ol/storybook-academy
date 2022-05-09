import {z} from 'zod'
import {entitySchema} from '../shared/entity'

export const schoolSchema = entitySchema.extend({
  name: z.string(),
})

export type School = z.infer<typeof schoolSchema>
