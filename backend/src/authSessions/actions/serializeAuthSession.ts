import {Serializer} from '../../shared/serializer'
import {AuthSession} from '../model'

export const serializeAuthSession: Serializer<AuthSession> = (authSession) => {
  return {
    ...authSession,
  }
}
