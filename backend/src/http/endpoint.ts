/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {ZodSchema} from 'zod'
import {User} from '../users/model'

export type Endpoint<BS = undefined, PS = undefined, QS = undefined> = {
  requireAuth?: boolean
  method: 'get' | 'post' | 'patch' | 'delete' | 'put'
  path: string
  validation?: {
    body?: ZodSchema<BS>
    params?: ZodSchema<PS>
    queryParams?: ZodSchema<QS>
  }
  handler: ({
    params,
    body,
    queryParams,
    user,
  }: {
    params?: PS
    body?: BS
    queryParams?: QS
    user?: User
  }) => Promise<Record<string, any>>
}

export type NewEndpoint<BS = undefined, PS = undefined, QS = undefined> = {
  requireAuth?: boolean
  method: 'get' | 'post' | 'patch' | 'delete' | 'put'
  path: string
  validation?: {
    body?: ZodSchema<BS>
    params?: ZodSchema<PS>
    queryParams?: ZodSchema<QS>
  }
  handler: ({
    params,
    body,
    queryParams,
    user,
  }: {
    params?: PS
    body?: BS
    queryParams?: QS
    user?: User
  }) => Promise<Record<string, any>>
}
