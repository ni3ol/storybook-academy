import {makeRequest} from '../../shared/utils'
import {Book, bookSchema} from '../model'

type Filters = {
  id?: string
  search?: string
  schoolId?: string
  classId?: string
}

export const getBooks = async ({
  authToken,
  filters,
}: {
  authToken: string
  filters?: Filters
}) => {
  const {data}: {data: any} = await makeRequest({
    authToken,
    method: 'get',
    path: '/books',
    queryParams: filters,
  })
  const books: Book[] = data.entities.map((dto: any) => bookSchema.parse(dto))
  return books
}
