import {z} from 'zod'
import {entitySchema} from '../shared/entity'

export const classSchema = entitySchema.extend({
  name: z.string(),
  educatorId: z.string().uuid(),
  schoolId: z.string().uuid(),
  linkedClassId: z.string().uuid().optional().nullable(),
  bookId: z.string().uuid().optional().nullable(),
  password: z.string(),
})

export type Class = z.infer<typeof classSchema>
