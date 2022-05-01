import {Serializer} from '../../shared/serializer'
import {Book} from '../model'

export const serializeBook: Serializer<Book> = (book) => {
  return {
    ...book,
  }
}
