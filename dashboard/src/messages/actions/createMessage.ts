import {makeRequest} from '../../shared/utils'
import {messageSchema} from '../model'

export const createMessage = async ({
  data,
  authToken,
}: {
  data: {body: string; roomId: string; senderId: string}
  authToken: string
}) => {
  const response = await makeRequest({
    authToken,
    method: 'post',
    path: '/messages',
    data,
  })

  const message = messageSchema.parse(response.data)

  return message
}
