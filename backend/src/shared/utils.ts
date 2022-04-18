import {v4} from 'uuid'
import {z} from 'zod'
import {addMinutes} from 'date-fns'

export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

export const utcNow = () => {
  const date = new Date()
  const utc = addMinutes(date, date.getTimezoneOffset())
  return utc
}

export const getUuid = () => {
  return v4()
}

export const requireEnvVar = (key: string) => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const entitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Entity = z.infer<typeof entitySchema>
