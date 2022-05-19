import {makeRequest} from '../../shared/utils'
import {Message, messageSchema} from '../model'

type Filters = {
  roomId: string
}

export const getMessages = async ({
  authToken,
  filters,
}: {
  authToken: string
  filters: Filters
}) => {
  const {data}: {data: any} = await makeRequest({
    authToken,
    method: 'get',
    path: '/messages',
    queryParams: filters,
  })
  const messages: Message[] = data.entities.map((dto: any) =>
    messageSchema.parse(dto),
  )
  return messages
}
