/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Endpoint} from '../../http/endpoint'
import {
  createPasswordResetRequest,
  createPasswordResetRequestSchema,
} from '../actions/createPasswordResetRequest'

export const createPasswordResetRequestEndpoint: Endpoint<any, any, any> = {
  method: 'post',
  path: '/passwordResetRequests',
  requireAuth: false,
  validation: {
    body: createPasswordResetRequestSchema,
  },
  handler: async ({body}) => {
    await createPasswordResetRequest({
      emailAddress: body.emailAddress,
    })

    return {message: 'ok'}
  },
}
