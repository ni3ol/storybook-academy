import {makeRequest} from '../../shared/utils'

export const unassignBookFromSchool = async ({
  data,
  authToken,
}: {
  data: {bookId: string; schoolId: string}
  authToken: string
}) => {
  await makeRequest({
    authToken,
    method: 'post',
    path: `/schools/${data.schoolId}/unassignBook`,
    data: {
      bookId: data.bookId,
    },
  })

  return
}
