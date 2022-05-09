import {bookSchema} from '../../books/model'
import {makeRequest} from '../../shared/utils'

export const assignBookToSchool = async ({
  data,
  authToken,
}: {
  data: {bookId: string; schoolId: string}
  authToken: string
}) => {
  const response = await makeRequest({
    authToken,
    method: 'post',
    path: `/schools/${data.schoolId}/assignBook`,
    data: {
      bookId: data.bookId,
    },
  })

  const book = bookSchema.parse(response.data)

  return book
}
