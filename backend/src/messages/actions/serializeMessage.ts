import {Serializer} from '../../shared/serializer'
import {Message} from '../model'

export const serializeMessage: Serializer<Message> = (message) => {
  return {
    ...message,
  }
}
