import {z} from 'zod'
import {entitySchema} from '../shared/utils'

export const bookSchema = entitySchema
  .extend({
    createdByUserId: z.string().uuid(),
    title: z.string(),
    level: z.number(),
  })
  .strict()

export type Book = z.infer<typeof bookSchema>
