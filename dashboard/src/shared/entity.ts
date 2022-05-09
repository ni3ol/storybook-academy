import {parseISO} from 'date-fns'
import {z} from 'zod'

export const dateSchema = z.preprocess((arg: any) => {
  if (typeof arg === 'string') {
    return parseISO(arg)
  }

  if (arg instanceof Date) {
    return new Date(arg)
  }

  return arg
}, z.date())

export const entitySchema = z.object({
  id: z.string().uuid(),
  createdAt: dateSchema,
})
