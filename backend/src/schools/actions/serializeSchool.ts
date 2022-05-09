import {Serializer} from '../../shared/serializer'
import {School} from '../model'

export const serializeSchool: Serializer<School> = (school) => {
  return {
    ...school,
  }
}
