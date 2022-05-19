/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Endpoint} from '../../http/endpoint'
import {
  createChatRoom,
  createChatRoomInputSchema,
} from '../actions/createChatRoom'
import {serializeChatRoom} from '../actions/serializeChatRoom'

export const createChatRoomEndpoint: Endpoint<any, any, any> = {
  method: 'post',
  path: '/chatRooms',
  requireAuth: true,
  validation: {
    body: createChatRoomInputSchema,
  },
  handler: async ({body, user: authedUser}) => {
    const message = await createChatRoom(
      {...body, createdByUserId: authedUser!.id},
      {as: {user: authedUser}},
    )
    const serializedEntity = await serializeChatRoom(message, {
      as: {user: authedUser},
    })
    return serializedEntity
  },
}
