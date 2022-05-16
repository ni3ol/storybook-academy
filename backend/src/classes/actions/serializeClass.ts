import {Serializer} from '../../shared/serializer'
import {Class} from '../model'

export const serializeClass: Serializer<Class> = (theClass) => {
  return {
    ...theClass,
  }
}
