import {Serializer} from '../../shared/serializer'
import {User} from '../model'

export const serializeUser: Serializer<User> = (user) => {
  return {
    ...user,
  }
}
