import {z} from 'zod'
import {entitySchema} from '../shared/utils'

export const bookAssignmentSchema = entitySchema
  .extend({
    bookId: z.string().uuid(),
    schoolId: z.string().uuid(),
  })
  .strict()

export type BookAssignment = z.infer<typeof bookAssignmentSchema>
