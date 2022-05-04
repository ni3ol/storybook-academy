import {z} from 'zod'
import {entitySchema} from '../shared/entity'

export const bookSchema = entitySchema.extend({
  createdByUserId: z.string().uuid(),
  title: z.string(),
  level: z.number(),
})

export type Book = z.infer<typeof bookSchema>
