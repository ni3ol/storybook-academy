import {makeRequest} from '../../shared/utils'
import {BookSession, bookSessionSchema} from '../model'

type Filters = {
  id?: string
  classId?: string
  childId?: string
}

export const getBookSessions = async ({
  authToken,
  filters,
}: {
  authToken: string
  filters?: Filters
}) => {
  const {data}: {data: any} = await makeRequest({
    authToken,
    method: 'get',
    path: '/bookSessions',
    queryParams: filters,
  })
  const bookSessions: BookSession[] = data.entities.map((dto: any) =>
    bookSessionSchema.parse(dto),
  )
  return bookSessions
}
