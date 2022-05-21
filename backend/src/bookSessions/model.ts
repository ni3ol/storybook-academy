import {z} from 'zod'
import {entitySchema} from '../shared/utils'

export const bookSessionSchema = entitySchema
  .extend({
    child1Id: z.string().uuid(),
    child2Id: z.string().uuid(),
    bookId: z.string().uuid().optional().nullable(),
    page: z.number().default(1),
  })
  .strict()

export type BookSession = z.infer<typeof bookSessionSchema>
