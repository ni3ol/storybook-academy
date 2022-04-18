/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {z, ZodSchema} from 'zod'
import {CreateAction, GetAction, UpdateAction} from '../shared/actionUtils'
import {User} from '../users/model'

export const actionToEndpoints = <E, D, F>(
  action: CreateAction<E, D> | UpdateAction<E, D> | GetAction<E, F>,
  baseUrl: string,
) => {
  const methodMapping = {
    create: 'post',
    update: 'patch',
    get: 'get',
  } as const

  const getOrUpdate = ['update'].includes(action.type)

  const idSchema = z.object({id: z.string().uuid()})

  type P = z.infer<typeof idSchema>

  const singularEndpoint: Endpoint<D, P | undefined> = {
    requireAuth: !!action.authorization,
    method: methodMapping[action.type],
    path: `/${baseUrl}${getOrUpdate ? `/:id` : ''}`,
    validation: {
      body: action.inputSchema as any,
      params: getOrUpdate ? idSchema : undefined,
      queryParams: (action as any).filterSchema,
    },
    handler: ({body, params, queryParams, user}) => {
      const as = {user}

      if (action.type === 'create') {
        return action.handler(body!, {as})
      }
      if (action.type === 'update') {
        return action.handler(params!.id!, body!, {as})
      }
      if (action.type === 'get') {
        return action.handler({filters: queryParams, as})
      }

      throw new Error('Unsupported')
    },
  }

  return [singularEndpoint]
}

export type Endpoint<BS, PS = undefined, QS = undefined> = {
  requireAuth?: boolean
  method: 'get' | 'post' | 'patch' | 'delete'
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
