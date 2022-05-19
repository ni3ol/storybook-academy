import {Serializer} from '../../shared/serializer'
import {ChatRoom} from '../model'

export const serializeChatRoom: Serializer<ChatRoom> = (chatRoom) => {
  return {
    ...chatRoom,
  }
}
