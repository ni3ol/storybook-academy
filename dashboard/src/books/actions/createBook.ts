import {makeRequest} from '../../shared/utils'
import {bookSchema} from '../model'

export const createBook = async ({
  data,
  authToken,
}: {
  data: {
    title: string
    level1Name?: string
    level1Type?: string
    level2Name?: string
    level2Type?: string
    level3Name?: string
    level3Type?: string
    level4Name?: string
    level4Type?: string
    level5Name?: string
    level5Type?: string
  }
  authToken: string
}) => {
  const response = await makeRequest({
    authToken,
    method: 'post',
    path: '/books',
    data,
  })

  const book = bookSchema.parse(response.data)

  return book
}
