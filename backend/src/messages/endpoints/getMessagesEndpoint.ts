/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Endpoint} from '../../http/endpoint'
import {getMessages, messageFiltersSchema} from '../actions/getMessages'
import {serializeMessage} from '../actions/serializeMessage'

export const getMessagesEndpoint: Endpoint<any, any, any> = {
  method: 'get',
  path: '/messages',
  requireAuth: true,
  validation: {
    queryParams: messageFiltersSchema,
  },
  handler: async ({queryParams, user: authedUser}) => {
    const messages = await getMessages({
      filters: queryParams,
      as: {user: authedUser},
    })
    const data = messages.map((message) =>
      serializeMessage(message, {as: {user: authedUser}}),
    )
    return {entities: data}
  },
}
