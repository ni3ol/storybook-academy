import {z} from 'zod'
import {entitySchema} from '../shared/utils'

export const bookAssignmentSchema = entitySchema
  .extend({
    bookId: z.string().uuid(),
    schoolId: z.string().uuid().optional().nullable(),
    classId: z.string().uuid().optional().nullable(),
  })
  .strict()

export type BookAssignment = z.infer<typeof bookAssignmentSchema>
