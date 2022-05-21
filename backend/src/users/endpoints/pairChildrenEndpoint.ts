/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Endpoint} from '../../http/endpoint'
import {pairChildren, pairChildrenSchema} from '../actions/pairChildren'

export const pairChildrenEndpoint: Endpoint<any, any, any> = {
  method: 'post',
  path: '/users/pairChildren',
  requireAuth: true,
  validation: {
    body: pairChildrenSchema,
  },
  handler: async ({body}) => {
    await pairChildren(body)
    return {message: 'ok'}
  },
}
