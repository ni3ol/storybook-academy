import {z} from 'zod'
import {dateSchema, entitySchema} from '../shared/entity'

export const bookSessionSchema = entitySchema
  .extend({
    updatedAt: dateSchema,
    child1Id: z.string().uuid(),
    child2Id: z.string().uuid(),
    bookId: z.string().uuid().optional().nullable(),
    page: z.number().default(1),
  })
  .strict()

export type BookSession = z.infer<typeof bookSessionSchema>
