/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Endpoint} from '../../http/endpoint'
import {createMessageInputSchema, createMessage} from '../actions/createMessage'
import {serializeMessage} from '../actions/serializeMessage'

export const createMessageEndpoint: Endpoint<any, any, any> = {
  method: 'post',
  path: '/messages',
  requireAuth: true,
  validation: {
    body: createMessageInputSchema,
  },
  handler: async ({body, user: authedUser}) => {
    const message = await createMessage(
      {...body, createdByUserId: authedUser!.id},
      {as: {user: authedUser}},
    )
    const serializedEntity = await serializeMessage(message, {
      as: {user: authedUser},
    })
    return serializedEntity
  },
}
