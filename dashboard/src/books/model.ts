import {z} from 'zod'
import {entitySchema} from '../shared/entity'

export const bookSchema = entitySchema.extend({
  createdByUserId: z.string().uuid(),
  title: z.string(),
  level1Name: z.string().optional().nullable(),
  level1Type: z.string().optional().nullable(),
  level2Name: z.string().optional().nullable(),
  level2Type: z.string().optional().nullable(),
  level3Name: z.string().optional().nullable(),
  level3Type: z.string().optional().nullable(),
  level4Name: z.string().optional().nullable(),
  level4Type: z.string().optional().nullable(),
  level5Name: z.string().optional().nullable(),
  level5Type: z.string().optional().nullable(),
})

export type Book = z.infer<typeof bookSchema>
