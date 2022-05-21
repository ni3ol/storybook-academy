/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Endpoint} from '../../http/endpoint'
import {chatRoomFiltersSchema, getChatRooms} from '../actions/getChatRooms'
import {serializeChatRoom} from '../actions/serializeChatRoom'

export const getChatRoomsEndpoint: Endpoint<any, any, any> = {
  method: 'get',
  path: '/chatRooms',
  requireAuth: true,
  validation: {
    queryParams: chatRoomFiltersSchema,
  },
  handler: async ({queryParams, user: authedUser}) => {
    const chatRooms = await getChatRooms({
      filters: queryParams,
      as: {user: authedUser},
    })
    const data = chatRooms.map((room) =>
      serializeChatRoom(room, {as: {user: authedUser}}),
    )
    return {entities: data}
  },
}
